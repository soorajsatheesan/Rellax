# Rellax

Rellax is an AI-assisted onboarding platform for employers and employees. Employers define role expectations and invite employees; employees upload a resume, get a personalized learning roadmap, and work through generated training content.

## What It Does

- Creates employer workspaces and role requirements
- Manages employee accounts tied to employer-defined roles
- Extracts resume text and skills from uploaded resumes
- Compares current skills against role expectations
- Generates personalized learning paths and module content
- Produces learning artifacts such as notes, slides, transcripts, audio, and PowerPoint decks

## Stack

- `Next.js 16` with App Router
- `React 19`
- `Convex` for app data and backend functions
- `WorkOS AuthKit` for employer and employee authentication
- `OpenAI` for roadmap and learning content generation
- `xAI` for resume skill extraction and job-description parsing
- `PptxGenJS`, `mammoth`, and `unpdf` for document and asset generation

## Core Flow

1. Employer signs up, completes onboarding, and creates role requirements.
2. Employer creates employee accounts linked to those roles.
3. Employee signs in and uploads a `.pdf` or `.docx` resume, or pastes resume text.
4. Rellax extracts skills, compares them to the target role, and generates a roadmap.
5. The app expands each roadmap module into learning artifacts employees can consume in the dashboard.

## Project Structure

```text
app/         Next.js routes, layouts, pages, and API handlers
components/  UI components by domain
convex/      Schema, queries, mutations, and auth config
lib/         AI, parsing, generation, and helper logic
public/      Static assets and generated learning artifacts
tests/       Node-based test suite
```

## Prerequisites

- Node.js 20+
- A Convex project
- A WorkOS project
- OpenAI API access
- xAI API access
- Google Cloud Text-to-Speech credentials

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file:

```bash
cp .env.example .env.local
```

3. Fill in the required values in `.env.local`.

4. Start the app:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

## Environment Variables

Rellax expects these integrations:

- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`
- `WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `WORKOS_COOKIE_PASSWORD`
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI`
- `XAI_API_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_SERVICE_ACCOUNT_KEY` or `GOOGLE_APPLICATION_CREDENTIALS`

See [`.env.example`](.env.example) for the full list, defaults, and optional settings.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
```

## Important Notes

- Generated learning artifacts are written under `public/generated-learning/`.
- Authentication is handled with WorkOS and wired into Convex auth.
- Resume extraction supports both `.pdf` and `.docx` uploads.
- Some routes and auth behavior should be reviewed before production deployment, especially middleware and debug-oriented paths.

## Testing

Run the test suite with:

```bash
npm run test
```

Run linting with:

```bash
npm run lint
```

## Repository

Remote: `git@github.com:soorajsatheesan/Rellax.git`
