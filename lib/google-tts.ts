import { createSign } from "node:crypto";
import { dirname, extname, join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const GOOGLE_TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const TTS_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

const DEFAULT_VOICE = process.env.GOOGLE_TTS_VOICE || "en-US-Neural2-J";
const DEFAULT_LANGUAGE = process.env.GOOGLE_TTS_LANGUAGE || "en-US";
const DEFAULT_SPEED = parseFloat(process.env.GOOGLE_TTS_SPEAKING_RATE || "0.95");

// ── Service account types ─────────────────────────────────────────────────────

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

function normalizeServiceAccount(raw: ServiceAccount): ServiceAccount {
  const markdownMailMatch = raw.client_email.match(/\((?:mailto:)?([^)]+)\)$/i);
  const bracketMailMatch = raw.client_email.match(/\[([^\]]+@[^\]]+)\]/);
  const directMailMatch = raw.client_email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

  const clientEmail =
    markdownMailMatch?.[1] ??
    bracketMailMatch?.[1] ??
    directMailMatch?.[0] ??
    raw.client_email;

  return {
    ...raw,
    client_email: clientEmail.trim(),
    private_key: raw.private_key.replace(/\r\n/g, "\n"),
    token_uri: raw.token_uri?.trim(),
  };
}

// ── In-process token cache (valid for 55 min out of 60 min lifetime) ─────────

type CachedToken = { token: string; expiresAt: number };
let _tokenCache: CachedToken | null = null;

// ── Load service account from file path or inline JSON ────────────────────────

async function loadServiceAccount(): Promise<ServiceAccount> {
  // Option 1: GOOGLE_SERVICE_ACCOUNT_KEY — inline JSON string (single or multi-line)
  const credKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (credKey) {
    const cleaned = credKey
      .trim()
      .replace(/^'+|'+$/g, "")   // strip wrapping single-quotes if present
      .trim();
    return normalizeServiceAccount(JSON.parse(cleaned) as ServiceAccount);
  }

  // Option 2: GOOGLE_SERVICE_ACCOUNT_JSON — same, alternate name
  const credJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (credJson) {
    return normalizeServiceAccount(JSON.parse(credJson.trim()) as ServiceAccount);
  }

  // Option 3: GOOGLE_APPLICATION_CREDENTIALS — path to the downloaded JSON file
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath) {
    const raw = await readFile(credPath, "utf8");
    return normalizeServiceAccount(JSON.parse(raw) as ServiceAccount);
  }

  throw new Error(
    "Google TTS: set GOOGLE_SERVICE_ACCOUNT_KEY (inline JSON), " +
    "GOOGLE_SERVICE_ACCOUNT_JSON, or GOOGLE_APPLICATION_CREDENTIALS (file path).",
  );
}

// ── Build and sign the JWT, then exchange for an access token ─────────────────

function base64url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64url");
}

async function fetchAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = sa.token_uri ?? TOKEN_URL;

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: sa.client_email,
      sub: sa.client_email,
      scope: TTS_SCOPE,
      aud: tokenUri,
      iat: now,
      exp: now + 3600,
    }),
  );

  const signingInput = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = base64url(signer.sign(sa.private_key));
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google OAuth2 token exchange failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  return data.access_token;
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  // Reuse cached token if still valid (with 5-min buffer)
  if (_tokenCache && _tokenCache.expiresAt > now + 5 * 60 * 1000) {
    return _tokenCache.token;
  }

  const sa = await loadServiceAccount();
  const token = await fetchAccessToken(sa);
  _tokenCache = { token, expiresAt: now + 55 * 60 * 1000 }; // cache for 55 min
  return token;
}

// ── Text chunking (Google TTS limit: ~5 000 bytes per request) ────────────────

export function chunkTextForTTS(text: string, maxChars = 4800): string[] {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= maxChars) return [trimmed];

  const chunks: string[] = [];
  let remaining = trimmed;

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining);
      break;
    }
    const slice = remaining.slice(0, maxChars);
    const lastBreak = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("? "),
      slice.lastIndexOf(".\n"),
    );
    const cutAt = lastBreak > maxChars * 0.4 ? lastBreak + 1 : maxChars;
    chunks.push(remaining.slice(0, cutAt).trim());
    remaining = remaining.slice(cutAt).trim();
  }

  return chunks.filter(Boolean);
}

// ── Single-chunk synthesis ────────────────────────────────────────────────────

async function synthesizeChunk(
  text: string,
  accessToken: string,
  voice: string,
  language: string,
  speed: number,
): Promise<Buffer> {
  const res = await fetch(GOOGLE_TTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: language, name: voice },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: speed,
        pitch: 0,
        effectsProfileId: ["headphone-class-device"],
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google TTS synthesis failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { audioContent: string };
  return Buffer.from(data.audioContent, "base64");
}

// ── Public API ────────────────────────────────────────────────────────────────

export type GoogleTTSOptions = {
  voiceName?: string;
  languageCode?: string;
  speakingRate?: number;
};

export async function synthesizeWithGoogleTTS(
  text: string,
  outputFilePath: string,
  options?: GoogleTTSOptions,
): Promise<string | undefined> {
  const voice = options?.voiceName ?? DEFAULT_VOICE;
  const language = options?.languageCode ?? DEFAULT_LANGUAGE;
  const speed = options?.speakingRate ?? DEFAULT_SPEED;

  const chunks = chunkTextForTTS(text);
  if (chunks.length === 0) return undefined;

  if (chunks.length > 1) {
    throw new Error(
      "synthesizeWithGoogleTTS only supports a single chunk. Use synthesizeTextToChunkFiles for long-form narration.",
    );
  }

  const accessToken = await getAccessToken();
  const buffer = await synthesizeChunk(chunks[0], accessToken, voice, language, speed);
  await writeFile(outputFilePath, buffer);
  return outputFilePath;
}

export async function synthesizeTextToChunkFiles(
  text: string,
  outputFilePath: string,
  options?: GoogleTTSOptions,
): Promise<string[]> {
  const voice = options?.voiceName ?? DEFAULT_VOICE;
  const language = options?.languageCode ?? DEFAULT_LANGUAGE;
  const speed = options?.speakingRate ?? DEFAULT_SPEED;
  const chunks = chunkTextForTTS(text);

  if (chunks.length === 0) {
    return [];
  }

  await mkdir(dirname(outputFilePath), { recursive: true });

  const accessToken = await getAccessToken();
  const extension = extname(outputFilePath) || ".mp3";
  const baseName = outputFilePath.slice(0, -extension.length);
  const paths: string[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const buffer = await synthesizeChunk(
      chunks[index],
      accessToken,
      voice,
      language,
      speed,
    );
    const chunkPath =
      chunks.length === 1
        ? outputFilePath
        : join(dirname(outputFilePath), `${baseName.split("/").pop()}-chunk-${index + 1}${extension}`);
    await writeFile(chunkPath, buffer);
    paths.push(chunkPath);
  }

  return paths;
}
