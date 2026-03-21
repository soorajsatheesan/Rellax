const ALLOWED_PROTOCOLS = new Set(["https:"]);

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxChars = 26) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 4);
}

function buildFallbackSvg(title: string, caption: string) {
  const titleLines = wrapText(title || "Rellax AI Slide");
  const captionLine = caption || "Generated fallback visual";
  const titleText = titleLines
    .map(
      (line, index) =>
        `<tspan x="56" dy="${index === 0 ? 0 : 44}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(640 120) rotate(90) scale(420 860)">
      <stop stop-color="#244E3A" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#0B0D10"/>
    </radialGradient>
    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#3D6B4F" fill-opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="1280" height="720" rx="28" fill="url(#g1)"/>
  <rect width="1280" height="720" rx="28" fill="url(#dots)"/>
  <rect x="40" y="40" width="1200" height="640" rx="24" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
  <circle cx="78" cy="82" r="8" fill="#7DE2A8"/>
  <text x="104" y="88" fill="#F2F5F3" font-size="22" font-family="IBM Plex Mono, monospace" letter-spacing="3.5">RELLAX AI</text>
  <text x="56" y="520" fill="#FFFFFF" font-size="58" font-weight="700" font-family="Georgia, 'Times New Roman', serif">${titleText}</text>
  <text x="56" y="650" fill="#D7E2DB" font-size="28" font-family="IBM Plex Sans, Arial, sans-serif">${escapeXml(captionLine)}</text>
</svg>`;
}

function isPrivateHostname(hostname: string) {
  const normalized = hostname.toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized.endsWith(".localhost")
  );
}

function extractMetaImage(html: string, baseUrl: URL) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      try {
        const resolved = new URL(match[1], baseUrl);
        if (ALLOWED_PROTOCOLS.has(resolved.protocol) && !isPrivateHostname(resolved.hostname)) {
          return resolved.toString();
        }
      } catch {
        continue;
      }
    }
  }

  return null;
}

async function fetchImageResponse(target: URL) {
  const upstream = await fetch(target.toString(), {
    headers: {
      "User-Agent": "Rellax/1.0 Image Proxy",
      Accept: "image/*,*/*;q=0.8",
    },
    cache: "force-cache",
    signal: AbortSignal.timeout(12000),
  });

  if (!upstream.ok) {
    return null;
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("image/")) {
    return null;
  }

  return upstream;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");
  const rawSourceUrl = searchParams.get("source");
  const title = searchParams.get("title") ?? "Rellax AI Slide";
  const caption = searchParams.get("caption") ?? "Generated fallback visual";

  if (!rawUrl) {
    return new Response("Missing url", { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (!ALLOWED_PROTOCOLS.has(targetUrl.protocol) || isPrivateHostname(targetUrl.hostname)) {
    return new Response("Blocked url", { status: 400 });
  }

  let upstream: Response | null;
  try {
    upstream = await fetchImageResponse(targetUrl);
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  if (!upstream && rawSourceUrl) {
    try {
      const sourceUrl = new URL(rawSourceUrl);
      if (ALLOWED_PROTOCOLS.has(sourceUrl.protocol) && !isPrivateHostname(sourceUrl.hostname)) {
        const sourceResponse = await fetch(sourceUrl.toString(), {
          headers: {
            "User-Agent": "Rellax/1.0 Image Proxy",
            Accept: "text/html,*/*;q=0.8",
          },
          cache: "force-cache",
          signal: AbortSignal.timeout(12000),
        });

        if (sourceResponse.ok) {
          const html = await sourceResponse.text();
          const metaImageUrl = extractMetaImage(html, sourceUrl);
          if (metaImageUrl) {
            upstream = await fetchImageResponse(new URL(metaImageUrl));
          }
        }
      }
    } catch {
      // ignore and fall through
    }
  }

  if (!upstream) {
    return new Response(buildFallbackSvg(title, caption), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
