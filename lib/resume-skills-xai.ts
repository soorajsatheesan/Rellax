/**
 * xAI-based skill extraction from resume text for employee learning paths.
 */
const XAI_API_BASE = "https://api.x.ai/v1";
const XAI_MODEL =
  process.env.XAI_JD_ANALYSIS_MODEL || "grok-4.20-0309-reasoning";

const skillsSchema = {
  name: "resume_skills",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      skills: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: ["skills"],
  },
} as const;

function getXAIKey() {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("Missing XAI_API_KEY.");
  return key;
}

function parseResponseText(responseJson: unknown): string {
  const r = responseJson as {
    output?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };
  const texts =
    r.output
      ?.flatMap((o) => o.content ?? [])
      .filter((c) => c.type === "output_text" && typeof c.text === "string")
      .map((c) => c.text ?? "") ?? [];
  return texts.join("\n").trim();
}

export async function extractSkillsFromResume(resumeText: string): Promise<string[]> {
  const key = getXAIKey();
  const response = await fetch(`${XAI_API_BASE}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: XAI_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "Extract a concise list of professional skills from the resume. Return only technical and soft skills: tools, technologies, methodologies, languages, frameworks, competencies. No job titles or company names. Lowercase, one skill per item.",
            },
          ],
        },
        {
          role: "user",
          content: [
            { type: "input_text", text: `Resume:\n${resumeText.slice(0, 15000)}` },
          ],
        },
      ],
      text: {
        format: { type: "json_schema", ...skillsSchema },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`xAI resume skill extraction failed: ${body}`);
  }

  const json = await response.json();
  const outputText = parseResponseText(json);
  if (!outputText) throw new Error("xAI returned no output.");

  const parsed = JSON.parse(outputText) as { skills: string[] };
  const skills = [...new Set((parsed.skills || []).map((s) => s.trim().toLowerCase()).filter(Boolean))];
  return skills;
}
