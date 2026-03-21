import { dirname, extname, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const OPENAI_TTS_URL = "https://api.openai.com/v1/audio/speech";

const DEFAULT_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const DEFAULT_VOICE = process.env.OPENAI_TTS_VOICE || "marin";
const DEFAULT_FORMAT = process.env.OPENAI_TTS_FORMAT || "mp3";
const DEFAULT_INSTRUCTIONS =
  process.env.OPENAI_TTS_INSTRUCTIONS ||
  "Speak clearly, naturally, and at a steady pace for a professional learning module.";

export type OpenAITTSOptions = {
  model?: string;
  voice?: string;
  responseFormat?: "mp3" | "wav" | "opus" | "aac" | "flac" | "pcm";
  instructions?: string;
};

function getOpenAIKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("Missing OPENAI_API_KEY for OpenAI TTS.");
  }

  return key;
}

export function chunkTextForOpenAITTS(text: string, maxChars = 3800): string[] {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.length <= maxChars) {
    return [trimmed];
  }

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
      slice.lastIndexOf("; "),
      slice.lastIndexOf(", "),
    );
    const cutAt = lastBreak > maxChars * 0.45 ? lastBreak + 1 : maxChars;
    chunks.push(remaining.slice(0, cutAt).trim());
    remaining = remaining.slice(cutAt).trim();
  }

  return chunks.filter(Boolean);
}

async function synthesizeChunk(
  text: string,
  options?: OpenAITTSOptions,
): Promise<Buffer> {
  const responseFormat = options?.responseFormat ?? DEFAULT_FORMAT;
  const res = await fetch(OPENAI_TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAIKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options?.model ?? DEFAULT_MODEL,
      voice: options?.voice ?? DEFAULT_VOICE,
      input: text,
      response_format: responseFormat,
      instructions: options?.instructions ?? DEFAULT_INSTRUCTIONS,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI TTS synthesis failed (${res.status}): ${body}`);
  }

  const audioBuffer = await res.arrayBuffer();
  return Buffer.from(audioBuffer);
}

export async function synthesizeTextToChunkFiles(
  text: string,
  outputFilePath: string,
  options?: OpenAITTSOptions,
): Promise<string[]> {
  const chunks = chunkTextForOpenAITTS(text);
  if (chunks.length === 0) {
    return [];
  }

  await mkdir(dirname(outputFilePath), { recursive: true });

  const extension = extname(outputFilePath) || `.${options?.responseFormat ?? DEFAULT_FORMAT}`;
  const baseName = outputFilePath.slice(0, -extension.length);
  const paths: string[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunkPath =
      chunks.length === 1
        ? outputFilePath
        : join(dirname(outputFilePath), `${baseName.split("/").pop()}-chunk-${index + 1}${extension}`);
    const audio = await synthesizeChunk(chunks[index], options);
    await writeFile(chunkPath, audio);
    paths.push(chunkPath);
  }

  return paths;
}
