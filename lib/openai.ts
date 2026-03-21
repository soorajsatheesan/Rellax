const XAI_API_BASE = "https://api.x.ai/v1";
const XAI_MODEL =
  process.env.XAI_JD_ANALYSIS_MODEL || "grok-4.20-0309-reasoning";

type AnalyzeJobDescriptionInput = {
  roleTitleHint?: string;
  rawJdText?: string;
  file?: File | null;
};

export type JobDescriptionAnalysis = {
  roleSummary: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  toolsAndTechnologies: string[];
  seniority: string;
};

const analysisSchema = {
  name: "job_description_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      roleSummary: { type: "string" },
      requiredSkills: {
        type: "array",
        items: { type: "string" },
      },
      preferredSkills: {
        type: "array",
        items: { type: "string" },
      },
      responsibilities: {
        type: "array",
        items: { type: "string" },
      },
      qualifications: {
        type: "array",
        items: { type: "string" },
      },
      toolsAndTechnologies: {
        type: "array",
        items: { type: "string" },
      },
      seniority: { type: "string" },
    },
    required: [
      "roleSummary",
      "requiredSkills",
      "preferredSkills",
      "responsibilities",
      "qualifications",
      "toolsAndTechnologies",
      "seniority",
    ],
  },
} as const;

function getXAIKey() {
  const key = process.env.XAI_API_KEY;

  if (!key) {
    throw new Error("Missing XAI_API_KEY.");
  }

  return key;
}

function toTrimmedArray(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function parseResponseText(responseJson: unknown) {
  const response = responseJson as {
    output?: Array<{
      type?: string;
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

async function uploadFileToXAI(file: File) {
  const formData = new FormData();
  formData.append("purpose", "user_data");
  formData.append("file", file, file.name);

  const response = await fetch(`${XAI_API_BASE}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getXAIKey()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`xAI file upload failed: ${body}`);
  }

  const json = (await response.json()) as { id: string };
  return json.id;
}

async function deleteFileFromXAI(fileId: string) {
  await fetch(`${XAI_API_BASE}/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getXAIKey()}`,
    },
  }).catch(() => null);
}

export async function analyzeJobDescription({
  roleTitleHint,
  rawJdText,
  file,
}: AnalyzeJobDescriptionInput): Promise<JobDescriptionAnalysis> {
  const input: Array<Record<string, unknown>> = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text:
            "You extract structured hiring data from job descriptions. Preserve explicit details, infer cautiously, and return concise business-ready output. If a value is missing, return an empty string or an empty array instead of guessing.",
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: roleTitleHint
            ? `Role title hint from the employer: ${roleTitleHint}`
            : "No role title hint was provided. Infer the title from the JD.",
        },
      ],
    },
  ];

  let uploadedFileId: string | null = null;

  if (rawJdText) {
    input.push({
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Job description source text:\n${rawJdText}`,
        },
      ],
    });
  }

  if (file) {
    uploadedFileId = await uploadFileToXAI(file);
    input.push({
      role: "user",
      content: [
        {
          type: "input_file",
          file_id: uploadedFileId,
        },
      ],
    });
  }

  try {
    const response = await fetch(`${XAI_API_BASE}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getXAIKey()}`,
      },
      body: JSON.stringify({
        model: XAI_MODEL,
        input,
        text: {
          format: {
            type: "json_schema",
            ...analysisSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`xAI analysis failed: ${body}`);
    }

    const responseJson = await response.json();
    const outputText = parseResponseText(responseJson);

    if (!outputText) {
      throw new Error("xAI analysis returned no structured output.");
    }

    const parsed = JSON.parse(outputText) as JobDescriptionAnalysis;

    return {
      ...parsed,
      requiredSkills: toTrimmedArray(parsed.requiredSkills),
      preferredSkills: toTrimmedArray(parsed.preferredSkills),
      responsibilities: toTrimmedArray(parsed.responsibilities),
      qualifications: toTrimmedArray(parsed.qualifications),
      toolsAndTechnologies: toTrimmedArray(parsed.toolsAndTechnologies),
    };
  } finally {
    if (uploadedFileId) {
      await deleteFileFromXAI(uploadedFileId);
    }
  }
}
