import { randomUUID } from "node:crypto";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_LEARNING_MODEL = process.env.OPENAI_LEARNING_MODEL || "gpt-4.1-mini";

type LearningGenerationInput = {
  employeeName: string;
  roleTitle: string;
  companyName: string;
  resumeText: string;
  extractedSkills: string[];
  requiredSkills: string[];
  gapSkills: string[];
};

export type GeneratedCourseScene = {
  title: string;
  focus?: string;
  bullets: string[];
  speakerNotes: string;
  narration: string;
  takeaway?: string;
  visualCue?: string;
  approxDurationSec: number;
  audioUrl?: string;
};

export type GeneratedCourseModule = {
  title: string;
  category: string;
  summary: string;
  targetSkill: string;
  personalizationNote: string;
  videoStyle: string;
  learningObjectives: string[];
  scenes: GeneratedCourseScene[];
  knowledgeChecks: string[];
};

export type GeneratedLearningCourse = {
  courseTitle: string;
  learnerPersonaSummary: string;
  modules: GeneratedCourseModule[];
};

const learningCourseSchema = {
  name: "employee_learning_course",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      courseTitle: { type: "string" },
      learnerPersonaSummary: { type: "string" },
      modules: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            category: { type: "string" },
            summary: { type: "string" },
            targetSkill: { type: "string" },
            personalizationNote: { type: "string" },
            videoStyle: { type: "string" },
            learningObjectives: {
              type: "array",
              minItems: 2,
              maxItems: 4,
              items: { type: "string" },
            },
            scenes: {
              type: "array",
              minItems: 3,
              maxItems: 5,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: { type: "string" },
                  focus: { type: "string" },
                  bullets: {
                    type: "array",
                    minItems: 3,
                    maxItems: 5,
                    items: { type: "string" },
                  },
                  speakerNotes: { type: "string" },
                  narration: { type: "string" },
                  takeaway: { type: "string" },
                  visualCue: { type: "string" },
                  approxDurationSec: { type: "number" },
                },
                required: [
                  "title",
                  "focus",
                  "bullets",
                  "speakerNotes",
                  "narration",
                  "takeaway",
                  "visualCue",
                  "approxDurationSec",
                ],
              },
            },
            knowledgeChecks: {
              type: "array",
              minItems: 2,
              maxItems: 3,
              items: { type: "string" },
            },
          },
          required: [
            "title",
            "category",
            "summary",
            "targetSkill",
            "personalizationNote",
            "videoStyle",
            "learningObjectives",
            "scenes",
            "knowledgeChecks",
          ],
        },
      },
    },
    required: ["courseTitle", "learnerPersonaSummary", "modules"],
  },
} as const;

function getOpenAIKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("Missing OPENAI_API_KEY for employee learning generation.");
  }

  return key;
}

function parseResponseText(responseJson: unknown): string {
  const response = responseJson as {
    output?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  const texts =
    response.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text" && typeof item.text === "string")
      .map((item) => item.text ?? "") ?? [];

  return texts.join("\n").trim();
}

function compactList(values: string[], fallback: string[]) {
  const deduped = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  return deduped.length > 0 ? deduped : fallback;
}

function getTargetSkills(input: LearningGenerationInput) {
  return compactList(
    input.gapSkills,
    compactList(input.requiredSkills, compactList(input.extractedSkills, [input.roleTitle])),
  );
}

function buildPrompt(input: LearningGenerationInput) {
  const targetSkills = getTargetSkills(input);
  const moduleCount = Math.min(Math.max(targetSkills.length, 3), 5);

  return [
    `You are creating a personalized, professional video-course for ${input.employeeName}, a ${input.roleTitle} at ${input.companyName}.`,
    `This is not generic training. It is a direct, individualized learning experience based on their actual background.`,
    `The content will be rendered as narrated slides — the narration becomes Google Text-to-Speech audio spoken directly to the learner.`,
    ``,
    `PERSONALIZATION REQUIREMENTS:`,
    `- Reference the learner's actual resume background, projects, and experience explicitly.`,
    `- Acknowledge what they already know before teaching what's new.`,
    `- Connect every concept to their specific role: ${input.roleTitle} at ${input.companyName}.`,
    `- Use their existing skills (${compactList(input.extractedSkills, [input.roleTitle]).slice(0, 8).join(", ")}) as bridges to new concepts.`,
    `- Every module must feel hand-crafted for this specific person, not copy-pasted.`,
    ``,
    `VIDEO SCRIPT REQUIREMENTS:`,
    `- Narration must sound like a professional presenter speaking directly to the learner, conversationally.`,
    `- Use natural spoken language: contractions, short punchy sentences, varied rhythm.`,
    `- Build energy and curiosity. Start scenes with a hook — a surprising fact, a direct question, or a relatable scenario.`,
    `- Each narration should be 50-120 words — long enough to be substantive, short enough to stay engaging.`,
    `- Never say "scene", "slide", "in this module", "let's dive in", or any meta-framing.`,
    `- Start every narration with the idea itself.`,
    ``,
    `VISUAL CUE REQUIREMENTS:`,
    `- Each scene's visualCue should describe a specific, concrete visual: a diagram, chart type, screenshot, icon set, workflow, analogy image, or animation concept.`,
    `- Be descriptive enough that a designer could create it. E.g. "Split-screen comparison: left shows old manual SQL query, right shows dbt transformation YAML" not just "diagram".`,
    ``,
    `SLIDE CONTENT REQUIREMENTS:`,
    `- Bullets must be presentation-quality: specific, actionable, not vague fragments.`,
    `- Focus line = the single most important insight from this scene (one crisp sentence).`,
    `- Takeaway = the one thing the learner must remember and apply at work.`,
    ``,
    `Create exactly ${moduleCount} modules, each covering one of these priority gaps:`,
    `${targetSkills.join(", ")}`,
    ``,
    `Role requirements: ${compactList(input.requiredSkills, [input.roleTitle]).join(", ")}`,
    `Employee current skills: ${compactList(input.extractedSkills, [input.roleTitle]).join(", ")}`,
    `Priority gaps to address: ${targetSkills.join(", ")}`,
    ``,
    `Resume (use this to personalize deeply):`,
    input.resumeText.slice(0, 6000),
  ].join("\n");
}

function estimateNarrationSeconds(narration: string) {
  const wordCount = narration
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;

  const wordsPerMinute = 140;
  const estimatedSeconds = Math.round((wordCount / wordsPerMinute) * 60);
  return Math.max(30, Math.min(120, estimatedSeconds));
}

function normalizeScene(scene: GeneratedCourseScene): GeneratedCourseScene {
  const narration = scene.narration.trim();
  return {
    title: scene.title.trim(),
    focus: scene.focus?.trim() || scene.title.trim(),
    bullets: scene.bullets.map((bullet) => bullet.trim()).filter(Boolean).slice(0, 4),
    speakerNotes: scene.speakerNotes.trim(),
    narration,
    takeaway: scene.takeaway?.trim() || scene.bullets.at(-1)?.trim() || undefined,
    visualCue: scene.visualCue?.trim() || undefined,
    approxDurationSec: estimateNarrationSeconds(narration),
    audioUrl: scene.audioUrl,
  };
}

function normalizeModule(module: GeneratedCourseModule): GeneratedCourseModule {
  const scenes = module.scenes.map(normalizeScene).filter((scene) => scene.bullets.length > 0);

  return {
    title: module.title.trim(),
    category: module.category.trim() || "Skills",
    summary: module.summary.trim(),
    targetSkill: module.targetSkill.trim(),
    personalizationNote: module.personalizationNote.trim(),
    videoStyle: module.videoStyle.trim() || "Narrated explainer",
    learningObjectives: compactList(module.learningObjectives, [module.targetSkill]).slice(0, 4),
    scenes,
    knowledgeChecks: compactList(module.knowledgeChecks, ["Explain the core takeaway from this module."]).slice(0, 3),
  };
}

export function durationLabelFromScenes(scenes: GeneratedCourseScene[]) {
  const totalSeconds = scenes.reduce((sum, scene) => sum + scene.approxDurationSec, 0);
  const roundedMinutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${roundedMinutes} min`;
}

export function narrationScriptFromScenes(scenes: GeneratedCourseScene[]) {
  return scenes
    .map((scene) => `${scene.title}\n${scene.narration}`)
    .join("\n\n");
}

export function generationVersion() {
  return `openai-learning-${randomUUID().slice(0, 8)}`;
}

export async function generatePersonalizedLearningCourse(
  input: LearningGenerationInput,
): Promise<GeneratedLearningCourse> {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getOpenAIKey()}`,
    },
    body: JSON.stringify({
      model: DEFAULT_LEARNING_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a world-class instructional designer creating personalized video-course content. You write compelling, direct narration scripts that will be spoken aloud via TTS. Every word must earn its place. Be specific, personal, and engaging — never generic.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: buildPrompt(input) }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          ...learningCourseSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI learning generation failed: ${body}`);
  }

  const responseJson = await response.json();
  const outputText = parseResponseText(responseJson);

  if (!outputText) {
    throw new Error("OpenAI learning generation returned no structured output.");
  }

  const parsed = JSON.parse(outputText) as GeneratedLearningCourse;

  return {
    courseTitle: parsed.courseTitle.trim(),
    learnerPersonaSummary: parsed.learnerPersonaSummary.trim(),
    modules: parsed.modules.map(normalizeModule).filter((module) => module.scenes.length > 0),
  };
}
