#!/usr/bin/env node
/**
 * Generates sample-resume.docx and sample-resume.pdf for testing resume upload.
 * Run: node scripts/generate-sample-resume.mjs
 */
import { Document, Paragraph, TextRun, Packer, AlignmentType } from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..");

const RESUME_CONTENT = `
JANE DOE
Email: jane.doe@example.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/janedoe

PROFESSIONAL SUMMARY
Software engineer with 5+ years of experience in full-stack development. Proficient in JavaScript, TypeScript, React, Node.js, and cloud platforms. Strong problem-solving skills and experience leading agile teams.

TECHNICAL SKILLS
• Programming: JavaScript, TypeScript, Python, SQL
• Frontend: React, Next.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, REST APIs, GraphQL
• Databases: PostgreSQL, MongoDB, Redis
• DevOps: Docker, AWS, GitHub Actions, CI/CD
• Tools: Git, Jira, Figma

WORK EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2021 – Present
• Led development of customer-facing web applications using React and Node.js
• Reduced page load time by 40% through performance optimization
• Mentored 3 junior developers and conducted code reviews
• Implemented CI/CD pipelines using GitHub Actions and AWS

Software Engineer | StartupXYZ | 2018 – 2021
• Built RESTful APIs and microservices using Node.js and Express
• Collaborated with product team on feature planning and sprint execution
• Integrated third-party payment and analytics services

EDUCATION
B.S. Computer Science | State University | 2018

CERTIFICATIONS
• AWS Certified Developer – Associate
• Scrum Master Certified (SMC)
`.trim();

async function generateDocx() {
  const lines = RESUME_CONTENT.split("\n").filter((l) => l.trim());
  const children = lines.map((line) => {
    const isHeading = line === "JANE DOE" || /^[A-Z][A-Z\s]+$/.test(line) && line.length < 50;
    return new Paragraph({
      children: [
        new TextRun({
          text: line,
          bold: isHeading,
          size: isHeading ? 28 : 24,
        }),
      ],
      spacing: { after: 100 },
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Sample Resume for Testing", bold: true, size: 32 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          ...children,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const path = join(OUTPUT_DIR, "sample-resume.docx");
  writeFileSync(path, buffer);
  console.log("Created:", path);
}

async function generatePdf() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  const { height } = page.getSize();
  let y = height - 50;
  const lineHeight = 14;
  const titleSize = 16;
  const bodySize = 10;

  const lines = RESUME_CONTENT.split("\n");
  for (const line of lines) {
    if (y < 50) {
      page.addPage([612, 792]);
      y = height - 50;
    }
    const isHeading = line === "JANE DOE" || (/^[A-Z][A-Z\s]+$/.test(line) && line.length < 50);
    const fontToUse = isHeading ? boldFont : font;
    const size = isHeading ? titleSize : bodySize;
    page.drawText(line || " ", {
      x: 50,
      y,
      size,
      font: fontToUse,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  }

  const pdfBytes = await doc.save();
  const path = join(OUTPUT_DIR, "sample-resume.pdf");
  writeFileSync(path, pdfBytes);
  console.log("Created:", path);
}

async function main() {
  await generateDocx();
  await generatePdf();
  console.log("\nDone. Use sample-resume.docx or sample-resume.pdf to test the upload flow.");
}

main().catch(console.error);
