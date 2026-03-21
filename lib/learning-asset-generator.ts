import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import PptxGenJS from "pptxgenjs";

import type {
  GeneratedQAPair,
  GeneratedSlide,
  RoadmapModule,
} from "@/lib/content-engine";
import {
  durationLabelFromSlides,
  narrationScriptFromSlides,
} from "@/lib/content-engine";
import { synthesizeTextToChunkFiles } from "@/lib/openai-tts";

export type GeneratedModuleAssets = {
  slideDeckUrl: string;
  transcriptUrl: string;
  artifactManifestUrl: string;
};

export type GeneratedModuleBundle = {
  module: RoadmapModule;
  notesContent: string;
  knowledgeChecks: string[];
  videoStyle: string;
  slides: GeneratedSlide[];
  qaPairs: GeneratedQAPair[];
  narrationScript: string;
  duration: string;
  assets: GeneratedModuleAssets;
};

function trimSentence(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getFocusLine(slide: GeneratedSlide) {
  return trimSentence(slide.focus || slide.bullets[0] || slide.title);
}

function getTakeawayLine(slide: GeneratedSlide) {
  return trimSentence(slide.takeaway || slide.bullets[slide.bullets.length - 1] || slide.narration);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function getPublicOutputPaths(employeeId: string) {
  const batch = `${Date.now()}-${slugify(employeeId || "employee")}`;
  const absoluteDir = path.join(process.cwd(), "public", "generated-learning", batch);
  const publicBaseUrl = `/generated-learning/${batch}`;

  return { absoluteDir, publicBaseUrl };
}

function moduleManifest(bundle: GeneratedModuleBundle) {
  return {
    title: bundle.module.title,
    category: bundle.module.category,
    summary: bundle.module.summary,
    targetSkill: bundle.module.targetSkill,
    personalizationNote: bundle.module.personalizationNote,
    videoStyle: bundle.videoStyle,
    duration: bundle.duration,
    learningObjectives: bundle.module.learningObjectives,
    knowledgeChecks: bundle.knowledgeChecks,
    narrationScript: bundle.narrationScript,
    notesContent: bundle.notesContent,
    qaPairs: bundle.qaPairs,
    slides: bundle.slides.map((slide, index) => ({
      index: index + 1,
      title: slide.title,
      bullets: slide.bullets,
      speakerNotes: slide.speakerNotes,
      narration: slide.narration,
      visualCue: slide.visualCue,
      imageUrl: slide.imageUrl,
      imageSourceUrl: slide.imageSourceUrl,
      imageCaption: slide.imageCaption,
      layoutVariant: slide.layoutVariant,
      approxDurationSec: slide.approxDurationSec,
      audioChunks: slide.audioChunks ?? [],
    })),
    assets: bundle.assets,
  };
}

function imageExtensionFrom(contentType: string | null, sourceUrl: string) {
  if (contentType?.includes("image/png")) return ".png";
  if (contentType?.includes("image/webp")) return ".webp";
  if (contentType?.includes("image/svg")) return ".svg";
  if (contentType?.includes("image/gif")) return ".gif";
  if (contentType?.includes("image/jpeg")) return ".jpg";

  try {
    const pathname = new URL(sourceUrl).pathname.toLowerCase();
    if (pathname.endsWith(".png")) return ".png";
    if (pathname.endsWith(".webp")) return ".webp";
    if (pathname.endsWith(".svg")) return ".svg";
    if (pathname.endsWith(".gif")) return ".gif";
    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return ".jpg";
  } catch {
    return ".jpg";
  }

  return ".jpg";
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
        return new URL(match[1], baseUrl).toString();
      } catch {
        continue;
      }
    }
  }

  return null;
}

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

function buildFallbackSvg(slide: GeneratedSlide) {
  const titleLines = wrapText(slide.title || "Rellax AI Slide");
  const caption = slide.imageCaption || slide.visualCue || "Generated fallback visual";
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
  <text x="56" y="650" fill="#D7E2DB" font-size="28" font-family="IBM Plex Sans, Arial, sans-serif">${escapeXml(caption)}</text>
</svg>`;
}

async function fetchImageAsset(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Rellax/1.0 Image Fetcher",
      Accept: "image/*,*/*;q=0.8",
    },
    cache: "force-cache",
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.toLowerCase().startsWith("image/")) {
    return null;
  }

  return response;
}

async function resolveSlideImageUrl(slide: GeneratedSlide) {
  if (!slide.imageUrl) {
    return null;
  }

  const direct = await fetchImageAsset(slide.imageUrl);
  if (direct) {
    return { response: direct, resolvedUrl: slide.imageUrl };
  }

  if (!slide.imageSourceUrl) {
    return null;
  }

  try {
    const sourceUrl = new URL(slide.imageSourceUrl);
    const sourceResponse = await fetch(sourceUrl.toString(), {
      headers: {
        "User-Agent": "Rellax/1.0 Image Fetcher",
        Accept: "text/html,*/*;q=0.8",
      },
      cache: "force-cache",
      signal: AbortSignal.timeout(12000),
    });

    if (!sourceResponse.ok) {
      return null;
    }

    const html = await sourceResponse.text();
    const metaImageUrl = extractMetaImage(html, sourceUrl);
    if (!metaImageUrl) {
      return null;
    }

    const fallback = await fetchImageAsset(metaImageUrl);
    if (!fallback) {
      return null;
    }

    return { response: fallback, resolvedUrl: metaImageUrl };
  } catch {
    return null;
  }
}

async function cacheSlideImage(
  absoluteDir: string,
  publicBaseUrl: string,
  slug: string,
  slide: GeneratedSlide,
  index: number,
) {
  if (!slide.imageUrl) {
    return slide;
  }

  try {
    const resolved = await resolveSlideImageUrl(slide);
    if (!resolved) {
      const imagePath = path.join(absoluteDir, `${slug}-slide-${index + 1}.svg`);
      await writeFile(imagePath, buildFallbackSvg(slide), "utf8");
      return {
        ...slide,
        imageUrl: `${publicBaseUrl}/${path.basename(imagePath)}`,
      };
    }

    const contentType = resolved.response.headers.get("content-type");
    const extension = imageExtensionFrom(contentType, resolved.resolvedUrl);
    const imagePath = path.join(absoluteDir, `${slug}-slide-${index + 1}${extension}`);
    const buffer = Buffer.from(await resolved.response.arrayBuffer());
    await writeFile(imagePath, buffer);

    return {
      ...slide,
      imageUrl: `${publicBaseUrl}/${path.basename(imagePath)}`,
    };
  } catch {
    const imagePath = path.join(absoluteDir, `${slug}-slide-${index + 1}.svg`);
    await writeFile(imagePath, buildFallbackSvg(slide), "utf8");
    return {
      ...slide,
      imageUrl: `${publicBaseUrl}/${path.basename(imagePath)}`,
    };
  }
}

function addSlide(
  pptx: PptxGenJS,
  module: RoadmapModule,
  videoStyle: string,
  slideContent: GeneratedSlide,
  sceneIndex: number,
) {
  const focusLine = getFocusLine(slideContent);
  const takeawayLine = getTakeawayLine(slideContent);
  const slide = pptx.addSlide();
  slide.background = { color: "F6F3EA" };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 1.0,
    fill: { color: "3F675B" },
    line: { color: "3F675B" },
  });

  slide.addText(module.title, {
    x: 0.7,
    y: 0.3,
    w: 8.8,
    h: 0.3,
    fontFace: "Aptos Display",
    fontSize: 22,
    bold: true,
    color: "FFFFFF",
  });

  slide.addText(`Part ${sceneIndex + 1}`, {
    x: 11.0,
    y: 0.34,
    w: 1.6,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 9,
    color: "E7EFE9",
    align: "right",
  });

  slide.addText(slideContent.title, {
    x: 0.7,
    y: 1.35,
    w: 7.9,
    h: 0.6,
    fontFace: "Aptos Display",
    fontSize: 25,
    bold: true,
    color: "1F2933",
  });

  slide.addText("Focus", {
    x: 0.9,
    y: 2.0,
    w: 1.0,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 10,
    bold: true,
    color: "3F675B",
  });

  slide.addText(focusLine, {
    x: 1.55,
    y: 1.95,
    w: 5.9,
    h: 0.35,
    fontFace: "Aptos",
    fontSize: 14,
    bold: true,
    color: "1F2933",
  });

  slide.addText(
    slideContent.bullets.map((bullet) => ({
      text: bullet,
      options: { bullet: { indent: 18 } },
    })),
    {
      x: 0.9,
      y: 2.55,
      w: 6.8,
      h: 2.55,
      fontFace: "Aptos",
      fontSize: 16,
      color: "334155",
      breakLine: true,
      paraSpaceAfter: 10,
      valign: "top",
    },
  );

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.2,
    y: 1.65,
    w: 4.4,
    h: 2.3,
    rectRadius: 0.12,
    fill: { color: "E8EFE9" },
    line: { color: "C7D7CC", pt: 1 },
  });

  slide.addText("Visual direction", {
    x: 8.55,
    y: 1.95,
    w: 1.8,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 10,
    bold: true,
    color: "3F675B",
  });

  slide.addText(slideContent.visualCue || videoStyle, {
    x: 8.55,
    y: 2.25,
    w: 3.7,
    h: 1.1,
    fontFace: "Aptos",
    fontSize: 15,
    align: "left",
    valign: "middle",
    color: "284236",
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.2,
    y: 4.25,
    w: 4.4,
    h: 1.35,
    rectRadius: 0.12,
    fill: { color: "F2EBDD" },
    line: { color: "E1D4BA", pt: 1 },
  });

  slide.addText("Takeaway", {
    x: 8.55,
    y: 4.45,
    w: 1.3,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 10,
    bold: true,
    color: "8A5A12",
  });

  slide.addText(takeawayLine, {
    x: 8.55,
    y: 4.75,
    w: 3.7,
    h: 0.55,
    fontFace: "Aptos",
    fontSize: 14,
    bold: true,
    color: "6B4F2A",
  });

  slide.addText(`Presenter note: ${slideContent.speakerNotes}`, {
    x: 0.8,
    y: 5.35,
    w: 11.8,
    h: 1.25,
    fontFace: "Aptos",
    fontSize: 10,
    color: "5B6472",
    italic: true,
  });

  slide.addNotes(
    `[Focus]\n${focusLine}\n\n[Takeaway]\n${takeawayLine}\n\n[Speaker Notes]\n${slideContent.speakerNotes}\n\n[Narration]\n${slideContent.narration}`,
  );
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.min(Math.max(concurrency, 1), items.length);
  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
  return results;
}

async function writeSlideDeck(
  filePath: string,
  module: RoadmapModule,
  videoStyle: string,
  slides: GeneratedSlide[],
) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Rellax";
  pptx.company = "Rellax";
  pptx.subject = module.summary;
  pptx.title = module.title;
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
  };

  slides.forEach((slide, index) => addSlide(pptx, module, videoStyle, slide, index));
  await pptx.writeFile({ fileName: filePath });
}

async function synthesizeSlideAudioChunks(
  absoluteDir: string,
  publicBaseUrl: string,
  slug: string,
  slides: GeneratedSlide[],
) {
  const audioConcurrency = Number(process.env.OPENAI_TTS_CONCURRENCY ?? "3");

  return mapWithConcurrency(slides, audioConcurrency, async (slide, index) => {
    const slideAudioPath = path.join(absoluteDir, `${slug}-slide-${index + 1}.mp3`);

    try {
      const writtenChunkPaths = await synthesizeTextToChunkFiles(slide.narration, slideAudioPath);
      return {
        ...slide,
        audioChunks: writtenChunkPaths.map(
          (chunkPath) => `${publicBaseUrl}/${path.basename(chunkPath)}`,
        ),
        audioUrl:
          writtenChunkPaths.length > 0
            ? `${publicBaseUrl}/${path.basename(writtenChunkPaths[0])}`
            : undefined,
      };
    } catch {
      return {
        ...slide,
        audioChunks: [],
        audioUrl: undefined,
      };
    }
  });
}

export async function buildLearningModuleAssets(args: {
  employeeId: string;
  module: RoadmapModule;
  notesContent: string;
  knowledgeChecks: string[];
  videoStyle: string;
  slides: GeneratedSlide[];
  qaPairs: GeneratedQAPair[];
}) {
  const { absoluteDir, publicBaseUrl } = getPublicOutputPaths(args.employeeId);
  await mkdir(absoluteDir, { recursive: true });

  const slug = slugify(args.module.title) || "module";
  const slideDeckPath = path.join(absoluteDir, `${slug}.pptx`);
  const transcriptPath = path.join(absoluteDir, `${slug}.txt`);
  const manifestPath = path.join(absoluteDir, `${slug}.json`);
  const slidesWithLocalImages = await mapWithConcurrency(args.slides, 4, (slide, index) =>
    cacheSlideImage(absoluteDir, publicBaseUrl, slug, slide, index),
  );
  const slidesWithAudio = await synthesizeSlideAudioChunks(
    absoluteDir,
    publicBaseUrl,
    slug,
    slidesWithLocalImages,
  );
  const narrationScript = narrationScriptFromSlides(slidesWithAudio);

  await writeSlideDeck(slideDeckPath, args.module, args.videoStyle, slidesWithAudio);
  await writeFile(transcriptPath, narrationScript, "utf8");

  const assets: GeneratedModuleAssets = {
    slideDeckUrl: `${publicBaseUrl}/${path.basename(slideDeckPath)}`,
    transcriptUrl: `${publicBaseUrl}/${path.basename(transcriptPath)}`,
    artifactManifestUrl: `${publicBaseUrl}/${path.basename(manifestPath)}`,
  };

  const bundle: GeneratedModuleBundle = {
    module: args.module,
    notesContent: args.notesContent,
    knowledgeChecks: args.knowledgeChecks,
    videoStyle: args.videoStyle,
    slides: slidesWithAudio,
    qaPairs: args.qaPairs,
    narrationScript,
    duration: durationLabelFromSlides(slidesWithAudio),
    assets,
  };

  await writeFile(manifestPath, JSON.stringify(moduleManifest(bundle), null, 2), "utf8");

  return bundle;
}
