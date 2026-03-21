import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, rm } from "node:fs/promises";
import path from "node:path";

import {
  durationLabelFromSlides,
  narrationScriptFromSlides,
  type GeneratedSlide,
  type RoadmapModule,
} from "@/lib/content-engine";
import { buildLearningModuleAssets } from "@/lib/learning-asset-generator";

const sampleModule: RoadmapModule = {
  title: "Stakeholder communication for launch readiness",
  category: "Communication",
  summary: "Translate technical work into clear launch updates for cross-functional partners.",
  targetSkill: "stakeholder communication",
  personalizationNote: "The learner has strong technical depth, so this module emphasizes executive-ready framing.",
  difficulty: "intermediate",
  estimatedMinutes: 18,
  learningObjectives: [
    "Frame launch risk in business terms",
    "Summarize decisions and owners clearly",
    "Lead sharper cross-functional updates",
  ],
};

const sampleSlides: GeneratedSlide[] = [
  {
    title: "Why launch updates fail",
    focus: "People lose the thread when impact, risk, and ownership are mixed together.",
    bullets: ["Too much detail", "No owner clarity", "Impact buried"],
    speakerNotes: "Open with a realistic launch-status example.",
    narration:
      "Launch updates usually fail when the audience cannot tell what changed, what is blocked, and who owns the next move.",
    takeaway: "Make the outcome, risk, and owner instantly visible.",
    visualCue: "Split screen of noisy update versus clean summary",
    approxDurationSec: 70,
  },
  {
    title: "A simple communication frame",
    focus: "Use a repeatable structure every time.",
    bullets: ["State outcome", "Highlight risk", "Assign owner"],
    speakerNotes: "Keep the framework memorable.",
    narration:
      "A strong update starts with the expected outcome, then names the main risk, and closes with a concrete owner and next action.",
    takeaway: "Use one frame consistently so stakeholders scan fast.",
    visualCue: "Three-step diagram",
    approxDurationSec: 90,
  },
];

test("durationLabelFromSlides rounds to practical minutes", () => {
  assert.equal(durationLabelFromSlides(sampleSlides), "3 min");
});

test("narrationScriptFromSlides creates a slide-by-slide transcript", () => {
  const script = narrationScriptFromSlides(sampleSlides);

  assert.match(script, /^Why launch updates fail/m);
  assert.match(script, /^A simple communication frame/m);
  assert.doesNotMatch(script, /Scene 1:/);
});

test("buildLearningModuleAssets writes slide deck, transcript, and manifest files", async () => {
  const bundle = await buildLearningModuleAssets({
    employeeId: "emp-42",
    module: sampleModule,
    notesContent: "Detailed notes content for the learner.",
    knowledgeChecks: ["What should appear in a launch-ready stakeholder update?"],
    videoStyle: "Narrated explainer",
    slides: sampleSlides,
    qaPairs: [
      {
        question: "What belongs in the first line of an update?",
        options: [
          "A full technical incident timeline",
          "The expected outcome and the current status against it.",
          "A list of every stakeholder in the meeting",
          "Only the names of engineers working on the launch",
        ],
        correctAnswer: "The expected outcome and the current status against it.",
        explanation: "Strong updates open with the outcome and current status so stakeholders can orient immediately.",
      },
    ],
  });

  assert.ok(bundle.assets.slideDeckUrl.endsWith(".pptx"));
  assert.ok(bundle.assets.transcriptUrl.endsWith(".txt"));
  assert.ok(bundle.assets.artifactManifestUrl.endsWith(".json"));

  const slideDeckPath = path.join(process.cwd(), "public", bundle.assets.slideDeckUrl.replace(/^\//, ""));
  const transcriptPath = path.join(process.cwd(), "public", bundle.assets.transcriptUrl.replace(/^\//, ""));
  const manifestPath = path.join(process.cwd(), "public", bundle.assets.artifactManifestUrl.replace(/^\//, ""));

  await access(slideDeckPath);
  const transcript = await readFile(transcriptPath, "utf8");
  const manifest = await readFile(manifestPath, "utf8");

  assert.match(transcript, /^Why launch updates fail/m);
  assert.match(manifest, /stakeholder communication/);

  await rm(path.dirname(slideDeckPath), { recursive: true, force: true });
});
