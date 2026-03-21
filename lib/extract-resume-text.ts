/**
 * Extract plain text from resume files: .docx (Word) and .pdf.
 * Uses unpdf (serverless-friendly) instead of pdf-parse to avoid worker bundling issues.
 */
import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

const MIN_TEXT_LENGTH = 50;

async function extractFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await mammoth.extractRawText({ buffer });
  return result.value?.trim() ?? "";
}

async function extractFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  const pdf = await getDocumentProxy(data);
  const { text } = await extractText(pdf, { mergePages: true });
  return text?.trim() ?? "";
}

export async function extractTextFromResumeFile(file: File): Promise<string> {
  const ext = file.name.toLowerCase().slice(Math.max(0, file.name.lastIndexOf(".")));
  const mime = file.type?.toLowerCase() ?? "";

  if (
    ext === ".docx" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const text = await extractFromDocx(file);
    if (!text || text.length < MIN_TEXT_LENGTH) {
      throw new Error(
        "The document appears empty or too short. Ensure it contains your resume text (at least 50 characters).",
      );
    }
    return text;
  }

  if (ext === ".pdf" || mime === "application/pdf") {
    const text = await extractFromPdf(file);
    if (!text || text.length < MIN_TEXT_LENGTH) {
      throw new Error(
        "The PDF appears empty or too short. Ensure it contains selectable text (at least 50 characters). Scanned/image-only PDFs may not work.",
      );
    }
    return text;
  }

  if (ext === ".doc") {
    throw new Error(
      "Legacy .doc format is not supported. Please save as .docx (File → Save As → Word Document) and upload again.",
    );
  }

  throw new Error(
    "Upload a .docx or .pdf file. Other formats are not supported.",
  );
}
