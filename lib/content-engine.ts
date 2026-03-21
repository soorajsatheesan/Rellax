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

export type RoadmapModule = {
  title: string;
  category: string;
  summary: string;
  targetSkill: string;
  personalizationNote: string;
  difficulty: "foundation" | "intermediate" | "advanced";
  estimatedMinutes: number;
  learningObjectives: string[];
};

export type GeneratedRoadmap = {
  courseTitle: string;
  learnerPersonaSummary: string;
  modules: RoadmapModule[];
};

export type GeneratedSlide = {
  title: string;
  focus?: string;
  bullets: string[];
  speakerNotes: string;
  narration: string;
  takeaway?: string;
  visualCue?: string;
  imageUrl?: string;
  imageSourceUrl?: string;
  imageCaption?: string;
  layoutVariant?: "media-left" | "media-right" | "hero-top" | "focus-split";
  approxDurationSec: number;
  audioUrl?: string;
  audioChunks?: string[];
};

export type GeneratedModuleNotes = {
  notesContent: string;
  knowledgeChecks: string[];
  personalizationNote: string;
  videoStyle: string;
};

export type GeneratedSlideOutline = Omit<
  GeneratedSlide,
  "speakerNotes" | "narration" | "approxDurationSec" | "audioUrl" | "audioChunks"
>;

const SLIDES_PER_MODULE = 6;

function chooseSlideLayoutVariant(): GeneratedSlide["layoutVariant"] {
  return "media-left";
}

export type GeneratedQAPair = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

function getOpenAIKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("Missing OPENAI_API_KEY for content engine generation.");
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

function getMinimumModuleCount(input: LearningGenerationInput) {
  const targetSkills = getTargetSkills(input);
  return Math.max(7, targetSkills.length);
}

function estimateNarrationSeconds(narration: string) {
  const wordCount = narration
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;

  const wordsPerMinute = 145;
  const estimatedSeconds = Math.round((wordCount / wordsPerMinute) * 60);
  return Math.max(30, Math.min(120, estimatedSeconds));
}

async function requestStructuredJson<T>({
  systemPrompt,
  userPrompt,
  schema,
}: {
  systemPrompt: string;
  userPrompt: string;
  schema: { name: string; strict: true; schema: Record<string, unknown> };
}): Promise<T> {
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
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          ...schema,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI content engine generation failed: ${body}`);
  }

  const responseJson = await response.json();
  const outputText = parseResponseText(responseJson);

  if (!outputText) {
    throw new Error("OpenAI content engine generation returned no structured output.");
  }

  return JSON.parse(outputText) as T;
}

const roadmapSchema = {
  name: "adaptive_learning_roadmap",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      courseTitle: { type: "string" },
      learnerPersonaSummary: { type: "string" },
      modules: {
        type: "array",
        minItems: 7,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            category: { type: "string" },
            summary: { type: "string" },
            targetSkill: { type: "string" },
            personalizationNote: { type: "string" },
            difficulty: {
              type: "string",
              enum: ["foundation", "intermediate", "advanced"],
            },
            estimatedMinutes: { type: "number" },
            learningObjectives: {
              type: "array",
              minItems: 3,
              maxItems: 5,
              items: { type: "string" },
            },
          },
          required: [
            "title",
            "category",
            "summary",
            "targetSkill",
            "personalizationNote",
            "difficulty",
            "estimatedMinutes",
            "learningObjectives",
          ],
        },
      },
    },
    required: ["courseTitle", "learnerPersonaSummary", "modules"],
  },
} as const;

export async function generateAdaptiveRoadmap(
  input: LearningGenerationInput,
): Promise<GeneratedRoadmap> {
  const targetSkills = getTargetSkills(input);
  const minimumModuleCount = getMinimumModuleCount(input);

  const roadmap = await requestStructuredJson<GeneratedRoadmap>({
    systemPrompt:
      "You design deeply personalized learning roadmaps. Build adaptive, job-relevant modules from a learner's resume and the target role. Avoid generic training plans.",
    userPrompt: [
      `Create an adaptive roadmap for ${input.employeeName}, who is targeting success as ${input.roleTitle} at ${input.companyName}.`,
      `Use the resume skills, required role skills, and gap skills together.`,
      `Return at least ${minimumModuleCount} modules.`,
      "Do not cap the roadmap at a small fixed number. Add more modules when the learner has multiple meaningful gaps.",
      `Adapt difficulty and sequencing to the learner's actual background. Foundation modules should only appear where the resume shows a real gap.`,
      `Each module must be specific, practical, and long-form ready.`,
      `Resume skills: ${compactList(input.extractedSkills, [input.roleTitle]).join(", ")}`,
      `Required skills: ${compactList(input.requiredSkills, [input.roleTitle]).join(", ")}`,
      `Priority gaps: ${targetSkills.join(", ")}`,
      "",
      "Resume text:",
      input.resumeText.slice(0, 9000),
    ].join("\n"),
    schema: roadmapSchema,
  });

  return {
    courseTitle: roadmap.courseTitle.trim(),
    learnerPersonaSummary: roadmap.learnerPersonaSummary.trim(),
    modules: roadmap.modules.map((module) => ({
      ...module,
      title: module.title.trim(),
      category: module.category.trim() || "Skills",
      summary: module.summary.trim(),
      targetSkill: module.targetSkill.trim(),
      personalizationNote: module.personalizationNote.trim(),
      estimatedMinutes: Math.max(10, Math.round(module.estimatedMinutes)),
      learningObjectives: compactList(module.learningObjectives, [module.targetSkill]).slice(0, 5),
    })),
  };
}

const notesSchema = {
  name: "module_notes_content",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      notesContent: { type: "string" },
      knowledgeChecks: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        items: { type: "string" },
      },
      personalizationNote: { type: "string" },
      videoStyle: { type: "string" },
    },
    required: ["notesContent", "knowledgeChecks", "personalizationNote", "videoStyle"],
  },
} as const;

export async function generateModuleNotes(
  input: LearningGenerationInput,
  module: RoadmapModule,
): Promise<GeneratedModuleNotes> {
  return requestStructuredJson<GeneratedModuleNotes>({
    systemPrompt:
      "You write deep learning notes for a personalized upskilling engine. The output should read like expert study material a serious learner can use directly, not like a lightweight summary.",
    userPrompt: [
      `Write long-form notes for the module "${module.title}".`,
      `Target role: ${input.roleTitle} at ${input.companyName}.`,
      `Target skill: ${module.targetSkill}.`,
      `Difficulty: ${module.difficulty}.`,
      `The notes must be highly specific to the learner's background, technically deep, and practical.`,
      `Do not write shallow overview content. Teach the topic in a way that would actually level up a working engineer.`,
      `Use markdown with sections, detailed explanations, examples, edge cases, common mistakes, implementation steps, and best practices.`,
      `If the topic is technical, explain mechanisms, architecture, APIs, data flow, debugging approaches, tradeoffs, and performance implications where relevant.`,
      `Notes should be detailed enough for a serious notes tab, not bullet fragments or motivational filler.`,
      `Resume skills: ${compactList(input.extractedSkills, [input.roleTitle]).join(", ")}`,
      `Required skills: ${compactList(input.requiredSkills, [input.roleTitle]).join(", ")}`,
      `Gap skills: ${compactList(input.gapSkills, [module.targetSkill]).join(", ")}`,
      `Module summary: ${module.summary}`,
      `Module objectives: ${module.learningObjectives.join(", ")}`,
      "",
      "Resume text:",
      input.resumeText.slice(0, 9000),
    ].join("\n"),
    schema: notesSchema,
  });
}

const slidesSchema = {
  name: "module_slide_outline",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      slides: {
        type: "array",
        minItems: SLIDES_PER_MODULE,
        maxItems: SLIDES_PER_MODULE,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            focus: { type: "string" },
            bullets: {
              type: "array",
              minItems: 4,
              maxItems: 6,
              items: { type: "string" },
            },
            takeaway: { type: "string" },
            visualCue: { type: "string" },
            imageUrl: { type: "string" },
            imageSourceUrl: { type: "string" },
            imageCaption: { type: "string" },
          },
          required: [
            "title",
            "focus",
            "bullets",
            "takeaway",
            "visualCue",
            "imageUrl",
            "imageSourceUrl",
            "imageCaption",
          ],
        },
      },
    },
    required: ["slides"],
  },
} as const;

export async function generateModuleSlides(
  input: LearningGenerationInput,
  module: RoadmapModule,
  notesContent: string,
): Promise<GeneratedSlideOutline[]> {
  const response = await requestStructuredJson<{ slides: GeneratedSlideOutline[] }>({
    systemPrompt:
      "You turn deep learning notes into presentation-ready slide outlines. Each slide must teach a meaningful idea, not just summarize at surface level. When the topic is technical, explain it with technical precision, concrete mechanisms, and correct terminology instead of generic motivational language.",
    userPrompt: [
      `Create slide content for the module "${module.title}".`,
      `Return exactly ${SLIDES_PER_MODULE} slides.`,
      `Each slide must include a title, focus, 4-6 strong bullets, a takeaway, and a visual cue.`,
      `Each slide must also include one relevant public web image URL, one matching public source-page URL, and one short image caption.`,
      `This is for ${input.employeeName}, a ${input.roleTitle} at ${input.companyName}.`,
      `Do not make the slides basic. Each slide should carry meaningful depth and teach something substantial.`,
      `If the module topic is technical, the slides must explain the topic technically with implementation detail, reasoning, pitfalls, debugging cues, performance considerations, and best practices where relevant.`,
      `Prefer concrete concepts over vague advice. Avoid generic bullets like "understand X" or "learn Y".`,
      `Pick images that are directly related to the concept on the slide, not generic business stock photos.`,
      `Only use image URLs from reliable hotlink-friendly sources: images.unsplash.com, upload.wikimedia.org, images.pexels.com, or cdn.pixabay.com.`,
      `Do not use Medium, dev.to, CSS-Tricks, LogRocket, MDN page asset URLs, Google blog assets, or any URL with query signatures that may expire.`,
      `Only return normal public https image URLs and matching public source-page URLs.`,
      `Ground the slides in the following detailed notes:`,
      notesContent.slice(0, 12000),
    ].join("\n"),
    schema: slidesSchema,
  });

  return response.slides.map((slide) => ({
    ...slide,
    title: slide.title.trim(),
    focus: slide.focus?.trim(),
    bullets: slide.bullets.map((bullet) => bullet.trim()).filter(Boolean).slice(0, 6),
    takeaway: slide.takeaway?.trim(),
    visualCue: slide.visualCue?.trim(),
    imageUrl: slide.imageUrl?.trim(),
    imageSourceUrl: slide.imageSourceUrl?.trim(),
    imageCaption: slide.imageCaption?.trim(),
    layoutVariant: chooseSlideLayoutVariant(),
  }));
}

const scriptsSchema = {
  name: "module_slide_scripts",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      slides: {
        type: "array",
        minItems: SLIDES_PER_MODULE,
        maxItems: SLIDES_PER_MODULE,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            speakerNotes: { type: "string" },
            narration: { type: "string" },
          },
          required: ["title", "speakerNotes", "narration"],
        },
      },
    },
    required: ["slides"],
  },
} as const;

export async function generateSlideScripts(
  input: LearningGenerationInput,
  module: RoadmapModule,
  slideOutline: GeneratedSlideOutline[],
  notesContent: string,
): Promise<GeneratedSlide[]> {
  const response = await requestStructuredJson<{ slides: Array<{ title: string; speakerNotes: string; narration: string }> }>({
    systemPrompt:
      "You write spoken scripts for narrated learning slides. The narration should sound natural when converted to speech, match the slide ideas exactly, and feel like a warm, capable teacher giving a deep explanation rather than a surface-level summary.",
    userPrompt: [
      `Write slide scripts for "${module.title}".`,
      `There must be exactly one script item for each slide below, in the same order.`,
      `The learner is ${input.employeeName}, a ${input.roleTitle} at ${input.companyName}.`,
      `Narration length should be 70-120 words per slide.`,
      `The first slide narration must begin with the exact phrase "Hey, Sudarshan,".`,
      `Do not keep repeating Sudarshan in every slide. After the first slide, only use the name if it feels natural and rare.`,
      `Use a friendly, teacher-like tone instead of robotic or corporate phrasing.`,
      `Do not sound basic or generic. Each narration should deliver explanation depth, not just re-read the bullets.`,
      `If the topic is technical, explain it technically with precision, concrete reasoning, architecture, APIs, code-level concepts, tradeoffs, performance implications, and common mistakes where relevant.`,
      `Speaker notes should help a human instructor teach the slide clearly and emphasize the nuanced points.`,
      `Slides:`,
      JSON.stringify(slideOutline),
      `Reference notes:`,
      notesContent.slice(0, 10000),
    ].join("\n"),
    schema: scriptsSchema,
  });

  return slideOutline.map((slide, index) => {
    const script = response.slides[index];
    const narration = script?.narration?.trim() || slide.bullets.join(" ");

    return {
      ...slide,
      speakerNotes: script?.speakerNotes?.trim() || module.personalizationNote,
      narration,
      approxDurationSec: estimateNarrationSeconds(narration),
    };
  });
}

const qaSchema = {
  name: "module_question_answers",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      qaPairs: {
        type: "array",
        minItems: 4,
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            question: { type: "string" },
            options: {
              type: "array",
              minItems: 4,
              maxItems: 4,
              items: { type: "string" },
            },
            correctAnswer: { type: "string" },
            explanation: { type: "string" },
          },
          required: ["question", "options", "correctAnswer", "explanation"],
        },
      },
    },
    required: ["qaPairs"],
  },
} as const;

export async function generateModuleQAPairs(
  input: LearningGenerationInput,
  module: RoadmapModule,
  notesContent: string,
): Promise<GeneratedQAPair[]> {
  const response = await requestStructuredJson<{ qaPairs: GeneratedQAPair[] }>({
    systemPrompt:
      "You create practical multiple-choice quiz content for self-study. Each question must test real understanding, include exactly 4 plausible options, one correct answer, and a concise explanation.",
    userPrompt: [
      `Generate quiz content for the module "${module.title}".`,
      `Return 4-6 quiz questions.`,
      `Each question must have exactly 4 options, 1 correct answer, and 1 explanation.`,
      `Questions should check real understanding, not trivial recall.`,
      `Wrong options must be plausible, not silly.`,
      `If the module topic is technical, ask technical questions about actual concepts, APIs, behavior, architecture, tradeoffs, and debugging.`,
      `The learner is ${input.employeeName}, a ${input.roleTitle} at ${input.companyName}.`,
      `Use these notes:`,
      notesContent.slice(0, 12000),
    ].join("\n"),
    schema: qaSchema,
  });

  return response.qaPairs.map((pair) => ({
    question: pair.question.trim(),
    options: pair.options.map((option) => option.trim()).filter(Boolean).slice(0, 4),
    correctAnswer: pair.correctAnswer.trim(),
    explanation: pair.explanation.trim(),
  }));
}

export function durationLabelFromSlides(slides: Array<{ approxDurationSec: number }>) {
  const totalSeconds = slides.reduce((sum, slide) => sum + slide.approxDurationSec, 0);
  const roundedMinutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${roundedMinutes} min`;
}

export function narrationScriptFromSlides(
  slides: Array<{ title: string; narration: string }>,
) {
  return slides.map((slide) => `${slide.title}\n${slide.narration}`).join("\n\n");
}

export function generationVersion() {
  return `content-engine-${randomUUID().slice(0, 8)}`;
}
