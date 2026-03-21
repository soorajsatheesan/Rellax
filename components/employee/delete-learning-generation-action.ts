"use server";

import { rm } from "node:fs/promises";
import path from "node:path";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

function toPublicFilePath(urlPath: string) {
  const cleanPath = urlPath.replace(/^\//, "");
  return path.join(process.cwd(), "public", cleanPath);
}

function getAssetDirectories(modules: Array<Record<string, unknown>>) {
  const dirs = new Set<string>();

  for (const learningModule of modules) {
    const candidateUrls = [
      typeof learningModule.slideDeckUrl === "string" ? learningModule.slideDeckUrl : undefined,
      typeof learningModule.transcriptUrl === "string" ? learningModule.transcriptUrl : undefined,
      typeof learningModule.artifactManifestUrl === "string" ? learningModule.artifactManifestUrl : undefined,
    ].filter(Boolean) as string[];

    const slides = Array.isArray(learningModule.slides) ? learningModule.slides : [];
    for (const slide of slides) {
      if (slide && typeof slide === "object") {
        const audioUrl = "audioUrl" in slide && typeof slide.audioUrl === "string" ? slide.audioUrl : undefined;
        if (audioUrl) {
          candidateUrls.push(audioUrl);
        }

        const audioChunks =
          "audioChunks" in slide && Array.isArray(slide.audioChunks)
            ? slide.audioChunks.filter((chunk: unknown): chunk is string => typeof chunk === "string")
            : [];
        for (const chunk of audioChunks) {
          candidateUrls.push(chunk);
        }
      }
    }

    for (const url of candidateUrls) {
      dirs.add(path.dirname(toPublicFilePath(url)));
    }
  }

  return [...dirs];
}

export async function deleteLearningGenerationAction() {
  const auth = await withAuth({ ensureSignedIn: true });
  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const learningPath = await convex.query(api.employeeLearning.getLearningPathForEmployee, {});

  const assetDirectories = learningPath ? getAssetDirectories(learningPath.modules) : [];

  await convex.mutation(api.employeeLearning.deleteLatestLearningPathForEmployee, {});

  await Promise.all(assetDirectories.map((dir) => rm(dir, { recursive: true, force: true }).catch(() => null)));

  redirect("/employee/upload-resume");
}
