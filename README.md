# Rellax

Rellax is an AI-assisted onboarding platform for employers and employees.

At a high level, the product does four things:

1. Employers create a workspace, define role requirements, and invite employees.
2. Employees sign in, upload a resume, and let the system extract their current skills.
3. Rellax compares those skills against employer-defined role expectations and generates a personalized learning roadmap.
4. The platform then expands each roadmap module into real learning assets: notes, narrated slide-based lessons, transcripts, quizzes, and downloadable PowerPoint decks.

This repository is a full-stack Next.js application using:

- `Next.js 16` with the App Router
- `React 19`
- `Convex` for app data, queries, mutations, and auth-aware backend state
- `WorkOS AuthKit` for employer and employee authentication
- `OpenAI` for roadmap and learning-content generation
- `xAI` for resume skill extraction and job-description parsing
- `PptxGenJS` plus file generation utilities for exported learning artifacts

## What The Product Does

Rellax is designed around adaptive onboarding rather than static course assignment.

Instead of giving every employee the same checklist, the application tries to understand:

- who the employee is
- what they already know
- what the job requires
- which gaps matter most
- what sequence of modules would get them productive faster

The system has two main personas:

### Employer

The employer side of the app is responsible for:

- creating and maintaining the company workspace
- defining role requirements
- inviting and managing employees
- reviewing aggregate onboarding progress
- maintaining the company profile shown across the workspace

### Employee

The employee side of the app is responsible for:

- signing in with employer-created credentials
- uploading or pasting resume content
- generating a personalized roadmap
- consuming module content
- tracking module completion
- changing their password

## Core User Flow

The implemented flow in this repository looks like this:

1. Employer signs up or signs in.
2. Employer completes onboarding if company details are missing.
3. Employer creates one or more role requirements.
4. Employer creates employee accounts tied to those roles.
5. Employee signs in.
6. Employee uploads a `.docx` or `.pdf` resume, or pastes resume text.
7. Resume text is extracted.
8. Resume skills are extracted through xAI.
9. Employer role requirements are loaded from Convex.
10. Skill gaps are computed.
11. OpenAI generates a personalized roadmap.
12. The roadmap is stored in Convex.
13. Background generation starts for the first module.
14. Each module is expanded into:
    - long-form notes
    - slide outlines
    - slide narration
    - quiz questions
    - PowerPoint deck
    - transcript file
    - audio narration chunks
    - artifact manifest JSON
15. Employee opens module detail pages and works through the content.
16. Module state moves from `not_started` to `in_progress` to `completed`.

## Tech Stack

### Frontend

- `Next.js 16.2.0`
- `React 19.2.4`
- `Tailwind CSS 4`
- App Router server components plus targeted client components

### Backend And Data

- `Convex`
- Convex schema, queries, and mutations in `convex/`
- Authenticated Convex access through WorkOS-issued tokens

### Authentication

- `@workos-inc/authkit-nextjs`
- `@workos-inc/node`
- `@convex-dev/workos`

### AI And Content Generation

- `OpenAI Responses API` for roadmap, notes, slide, script, and quiz generation
- `OpenAI speech API` for narration audio generation
- `xAI Responses API` for:
  - job-description parsing
  - resume skill extraction

### Document / Asset Processing

- `mammoth` for `.docx` resume extraction
- `unpdf` for `.pdf` text extraction
- `PptxGenJS` for slide deck generation
- `docx` and `pdf-lib` for sample resume generation utilities
- `xlsx` for spreadsheet handling in employee tooling

## Architecture Overview

The application is split into a few clear layers.

### 1. App Router Pages

The `app/` directory contains page routes, API routes, layout configuration, and static content pages.

Important route groups:

- public marketing and policy pages
- employer auth and onboarding
- employer dashboard
- employee dashboard, upload, roadmap, and module pages
- internal API routes for generation and utilities

### 2. UI Components

The `components/` directory is organized mostly by domain:

- `components/auth` for login and signup flows
- `components/dashboard` for employer workspace UI
- `components/employee` for employee learning UI
- `components/home` for the marketing landing page
- `components/onboarding` for employer setup
- `components/global` for shared visual primitives
- `components/splash` for the splash/loading experience

### 3. Backend Logic In Convex

The `convex/` directory defines the application data model and the server-side operations used by both employer and employee flows.

This includes:

- employer profile creation and updates
- employee creation and lookup
- role requirement CRUD
- learning-path storage
- module generation state
- progress updates

### 4. AI / Content Services

The `lib/` directory contains the intelligence layer:

- extracting resume text
- extracting skills from resume text
- parsing job descriptions
- generating adaptive roadmaps
- generating module notes, slides, narration, and quiz content
- generating PowerPoint decks, transcripts, and audio files

### 5. Public Artifact Storage

Generated learning artifacts are written to:

- `public/generated-learning/...`

That makes them directly accessible from the browser using normal static file URLs.

## Project Structure

```text
app/                     Next.js routes, layouts, API handlers, and pages
components/              UI by domain (auth, dashboard, employee, home, etc.)
convex/                  Convex schema, queries, mutations, and auth config
lib/                     AI, TTS, parsing, file-generation, and helper logic
public/                  Static assets and generated learning artifacts
scripts/                 Local utility scripts
tests/                   Node test suite
sample-resume.docx       Test fixture for resume upload
sample-resume.pdf        Test fixture for resume upload
proxy.ts                 WorkOS middleware configuration
convex.json              Convex project config
next.config.ts           Next.js config
```

## Route Map

### Public / Marketing Routes

- `/` landing page
- `/about`
- `/blog`
- `/careers`
- `/contact`
- `/privacy`
- `/cookies`
- `/security`
- `/terms`

These pages are mostly content and branding surfaces built from reusable page-shell and home-page components.

### Authentication Routes

- `/login` shared sign-in page with employer vs employee view
- `/signup` employer signup page
- `/sign-in` WorkOS sign-in redirect helper
- `/sign-up` WorkOS sign-up redirect helper
- `/auth/social` provider-based social auth redirect route
- `/callback` WorkOS callback handler
- `/verify-email` verification guidance page

### Employer Routes

- `/onboarding` employer setup form
- `/dashboard` employer workspace

The employer dashboard has four main sections:

- overview
- employees
- roles
- profile

The active section is stored in the `section` query string.

### Employee Routes

- `/employee/dashboard`
- `/employee/upload-resume`
- `/employee/roadmap`
- `/employee/roadmap/[moduleId]`
- `/employee/change-password`

### Internal API Routes

- `/api/learning/generate` module content-generation orchestrator
- `/api/image-proxy` safe-ish remote image proxy for slide images
- `/api/debug-token` temporary auth debugging endpoint

## Authentication Model

Rellax uses WorkOS for identity and Convex for application data authorization.

### Employer Authentication

Employers can:

- sign up with email/password
- sign in with email/password
- use social auth through Google or Microsoft/Outlook

Employer sessions are established with WorkOS AuthKit and then used to authenticate Convex requests.

### Employee Authentication

Employees are created by employers through the dashboard.

When an employer creates an employee:

- a WorkOS user is created or updated
- the employee receives an auto-generated password
- a matching employee record is written to Convex

Employees then sign in through the employee login flow and are redirected to `/employee/dashboard`.

### Convex Auth Configuration

`convex/auth.config.ts` accepts WorkOS JWTs from two issuers:

- `https://api.workos.com`
- `https://api.workos.com/user_management/${WORKOS_CLIENT_ID}`

That matters because WorkOS can issue tokens with different issuer values depending on the auth flow used.

### Middleware Notes

`proxy.ts` configures `authkitMiddleware`.

Important detail: several dashboard and employee routes are currently listed in `unauthenticatedPaths` with comments indicating this was done temporarily for development. The page components themselves still perform auth checks and redirects, but the middleware is currently permissive for those routes.

That means:

- page-level auth is still enforced in many places
- middleware-level route protection is looser than production should likely allow

If you are preparing this app for production, review `proxy.ts` first.

## Data Model

The main schema lives in `convex/schema.ts`.

### `employers`

Stores employer workspace and owner information.

Key fields:

- company identity
- website and logo
- industry, size, headquarters
- owner email, name, and role
- WorkOS user id for the employer owner
- auth provider metadata
- onboarding timestamps

### `employees`

Stores employee identity inside an employer workspace.

Key fields:

- `employerId`
- `employeeId`
- `workOSUserId`
- `email`
- `fullName`
- `roleId`
- `roleTitle`
- `status`

This is the bridge between WorkOS identities and the app’s employee domain.

### `role_requirements`

Stores the required capabilities for a role defined by an employer.

Key fields:

- `roleTitle`
- `roleId`
- `roleKey`
- `requiredSkills`
- `preferredSkills`
- `responsibilities`
- `qualifications`
- `toolsAndTechnologies`
- `roleSummary`
- `seniority`
- raw JD-related fields

This table is the source of truth for employee gap analysis.

### `employee_resumes`

Stores employee resume text and extracted skills.

Key fields:

- `resumeText`
- `extractedSkills`
- `employeeId`
- `employerId`

### `learning_paths`

Stores high-level roadmap metadata for an employee.

Key fields:

- source resume
- role title at generation time
- learner persona summary
- required skills snapshot
- gap skills snapshot
- generation version
- generation state
- current module being generated

### `learning_path_modules`

Stores the module-level detail for a learning path.

This is the most important learning-content table.

It includes:

- title, category, summary
- target skill
- personalization note
- notes content
- slide data
- narration script
- quiz data
- slide deck URL
- transcript URL
- manifest URL
- module order
- generation state
- learner progress state

### `employee_progress`

Stores employer-facing progress percentages per employee.

This is separate from per-module status and is used to support aggregate employer reporting.

## Employer-Side Implementation

The employer experience is centered around the dashboard in `/dashboard`.

### Workspace And Onboarding

When an employer signs in:

- the app checks for an existing employer record in Convex
- if setup is incomplete, the employer is redirected to `/onboarding`
- `components/onboarding/company-onboarding-form.tsx` saves company and owner metadata

### Employee Management

Employer employee-management actions live primarily in:

- `components/dashboard/employee-actions.ts`

What this logic does:

- validates employee ID, email, and role selection
- ensures the employer workspace exists
- ensures the selected role exists
- generates a strong password
- creates or updates the WorkOS user
- writes the employee record to Convex

The helper `lib/workos-strong-password.ts` uses Web Crypto to generate passwords aligned with the project’s known-good WorkOS requirements.

### Role Management

Role requirement creation and editing live in:

- `components/dashboard/role-requirement-actions.ts`
- `convex/roleRequirements.ts`

Employers can provide:

- a manual required-skills list
- JD text
- or a JD file

If JD input is provided, the app calls xAI to extract:

- required skills
- preferred skills
- responsibilities
- qualifications
- tools and technologies
- seniority
- role summary

This creates the role-definition layer that powers employee roadmap generation.

### Employer Profile

Employer profile editing lives in:

- `components/dashboard/profile-actions.ts`
- `convex/employers.ts`

Supported fields include:

- company name
- owner name and role
- website
- logo URL
- industry
- size
- headquarters
- company description

## Employee-Side Implementation

The employee experience is the main adaptive-learning surface.

### Dashboard

`/employee/dashboard` shows:

- employee identity information
- employer/company association
- high-level learning stats
- assigned module cards
- quick links for password change and sign out

The dashboard uses:

- `api.employeeLearning.getLearningPathForEmployee`
- server-rendered fallback data
- client-side Convex queries for live updates

### Resume Upload

`/employee/upload-resume` is the entry point for roadmap generation.

The form supports:

- `.docx` upload
- `.pdf` upload
- raw pasted text

The upload form communicates the generation stages to the user while the server action runs.

### Resume Extraction

`lib/extract-resume-text.ts` handles file parsing.

Behavior:

- `.docx` files are parsed with `mammoth`
- `.pdf` files are parsed with `unpdf`
- `.doc` is explicitly rejected
- files with too little text are rejected
- scanned/image-only PDFs may fail because text extraction depends on selectable text

### Resume Skill Extraction

`lib/resume-skills-xai.ts` sends resume text to xAI and expects structured JSON output with a deduplicated skill list.

It intentionally extracts:

- technical skills
- soft skills
- tools
- frameworks
- methodologies

It intentionally excludes:

- company names
- job titles

### Gap Analysis

The employee submit action:

1. loads the employee profile
2. loads the matching employer role requirement
3. lowercases and deduplicates role skills
4. computes:

`gapSkills = requiredSkills - extractedSkills`

This result is then passed into the roadmap generator.

### Roadmap Generation

`lib/content-engine.ts` contains `generateAdaptiveRoadmap`.

This function:

- builds a personalized prompt from employee identity, role, company, resume text, extracted skills, required skills, and gap skills
- asks OpenAI for structured JSON
- enforces a schema-driven output
- normalizes the returned modules

The minimum roadmap length is adaptive and is based on the number of meaningful target skills, with a floor of seven modules.

### Learning Path Persistence

`convex/employeeLearning.ts` stores:

- the source resume
- the roadmap metadata
- one record per roadmap module

Modules start in a pending generation state and a `not_started` learner state.

### Roadmap Page

`/employee/roadmap` shows the stored roadmap and continuously nudges module generation forward by calling `/api/learning/generate` while work remains.

This page also surfaces:

- how many modules are ready
- how many are queued
- how many failed
- a delete-generation action to wipe the latest path and its generated files

### Module Generation Pipeline

The most important orchestration endpoint is:

- `app/api/learning/generate/route.ts`

Its job is to:

1. authenticate the current user
2. load path context from Convex
3. claim the next module that needs generation
4. generate notes if missing
5. generate slide outlines if missing
6. generate narration scripts if missing
7. build learning assets
8. generate quiz questions if missing
9. write all outputs back to Convex
10. mark failures cleanly if any stage fails

### What “Build Learning Assets” Means

`lib/learning-asset-generator.ts` takes content-engine outputs and writes:

- `.pptx` slide deck
- `.txt` transcript
- `.json` artifact manifest
- slide audio chunk files

Artifacts are stored in:

- `public/generated-learning/<batch>/...`

The manifest also includes structured data about:

- module metadata
- notes
- learning objectives
- QA pairs
- slide metadata
- audio chunk paths

### Audio Generation

Current asset generation uses:

- `lib/openai-tts.ts`

That means the active narration pipeline relies on OpenAI speech synthesis and the `OPENAI_API_KEY`.

There is also a complete Google TTS helper in:

- `lib/google-tts.ts`

But it is not currently wired into `lib/learning-asset-generator.ts`.

This is important when configuring secrets:

- `GOOGLE_*` variables appear in `.env.example`
- but the current generation path uses `OpenAI TTS`, not Google TTS

### Module Detail Experience

`/employee/roadmap/[moduleId]` loads the generated module detail experience.

`components/employee/module-detail-content.tsx` handles:

- fetching the live module record
- automatically starting a module once content is ready
- rendering notes with a custom markdown renderer
- rendering the video tab
- rendering quiz questions
- letting the learner complete the module

The notes renderer supports:

- headings
- lists
- code fences
- inline code
- bold
- italics

without pulling in a heavy markdown dependency.

### Progress States

Each module uses:

- `not_started`
- `in_progress`
- `completed`

Convex mutations:

- `startModule`
- `completeModule`

persist these changes so refreshes keep the correct state.

### Password Change

Employees can change passwords through:

- `/employee/change-password`

The server action verifies the current password with WorkOS first, then updates the password through WorkOS user management.

## AI Layer In Detail

The repository currently uses two AI providers for distinct jobs.

### xAI

xAI is used for:

- job-description parsing in `lib/openai.ts`
- resume skill extraction in `lib/resume-skills-xai.ts`

Despite the filename `lib/openai.ts`, that module is actually xAI-backed.

### OpenAI

OpenAI is used for:

- roadmap generation
- module note generation
- slide outline generation
- slide narration generation
- quiz generation
- narration audio generation

The main content engine module is `lib/content-engine.ts`.

The older file `lib/openai-learning-course.ts` is still present and appears to represent an earlier or alternative generation approach. The current employee roadmap pipeline uses `lib/content-engine.ts`, not that older module.

## Static Pages And Branding

The landing and content pages are built from:

- `components/home/*`
- `components/pages/*`

The root page `app/page.tsx` simply renders `HomePage`.

The site also includes:

- a splash experience via `components/splash/*`
- a brand logo component
- theme toggling in dashboard surfaces

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values.

### Convex

- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL` optional

### WorkOS

- `WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `WORKOS_COOKIE_PASSWORD`
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI`

### xAI

- `XAI_API_KEY`
- `XAI_JD_ANALYSIS_MODEL`

### OpenAI

- `OPENAI_API_KEY`
- `OPENAI_LEARNING_MODEL`
- optionally:
  - `OPENAI_TTS_MODEL`
  - `OPENAI_TTS_VOICE`
  - `OPENAI_TTS_FORMAT`
  - `OPENAI_TTS_INSTRUCTIONS`
  - `OPENAI_TTS_CONCURRENCY`

### Google TTS

Google TTS environment variables exist in the example file, but they are only relevant if you switch the active narration pipeline away from OpenAI TTS.

Available helpers support:

- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `GOOGLE_TTS_VOICE`
- `GOOGLE_TTS_LANGUAGE`
- `GOOGLE_TTS_SPEAKING_RATE`

## Local Development

Install dependencies with one package manager and stick to it.

The repository currently contains both `package-lock.json` and `pnpm-lock.yaml`, so choose one workflow instead of mixing them.

### Install

```bash
npm install
```

or

```bash
pnpm install
```

### Start Next.js

```bash
npm run dev
```

### Start Convex

In a separate terminal, run Convex development as needed for your setup:

```bash
npx convex dev
```

If schema or generated API types are stale, restart Convex so the latest validators and generated bindings are pushed.

### Production Build

```bash
npm run build
npm run start
```

## Scripts

### Generate Sample Resume Fixtures

```bash
node scripts/generate-sample-resume.mjs
```

This script creates:

- `sample-resume.docx`
- `sample-resume.pdf`

These are useful for testing the resume-upload flow locally.

## Testing

Run tests with:

```bash
npm test
```

The current test suite focuses on the content and asset pipeline.

`tests/content-engine.test.ts` verifies:

- slide-duration labeling
- transcript construction
- learning-asset generation
- writing slide deck, transcript, and manifest files

This is a useful smoke test for the export side of the learning system, but it is not yet a full end-to-end test suite.

## Key Files To Read First

If you are onboarding to the codebase, start here:

### Product And Core Flow

- `app/employee/upload-resume/page.tsx`
- `components/employee/submit-resume-action.ts`
- `app/api/learning/generate/route.ts`
- `lib/content-engine.ts`
- `lib/learning-asset-generator.ts`
- `convex/employeeLearning.ts`

### Auth And Workspace Setup

- `components/auth/auth-actions.ts`
- `proxy.ts`
- `convex/auth.config.ts`
- `components/onboarding/company-onboarding-form.tsx`

### Employer Domain

- `app/dashboard/page.tsx`
- `components/dashboard/dashboard-shell.tsx`
- `components/dashboard/employee-actions.ts`
- `components/dashboard/role-requirement-actions.ts`
- `convex/employers.ts`
- `convex/employees.ts`
- `convex/roleRequirements.ts`

### Employee Domain

- `app/employee/dashboard/page.tsx`
- `components/employee/dashboard-modules.tsx`
- `components/employee/roadmap-content.tsx`
- `components/employee/module-detail-content.tsx`

## Important Operational Notes

### 1. Generated Files Are Stored In `public/`

Learning artifacts are written to publicly servable directories under `public/generated-learning`.

That is convenient for an MVP, but for a production system you would likely want:

- object storage
- signed URLs
- retention policies
- access control beyond static file serving

### 2. There Is A Debug Route In The Repository

`/api/debug-token` is explicitly marked temporary and exposes token claims for debugging. It should not survive into a hardened production deployment.

### 3. Middleware Protection Is Currently Relaxed

As noted earlier, `proxy.ts` currently exempts several normally protected routes from middleware auth. That should be reviewed before deployment.

### 4. AI Provider Naming Is Slightly Inconsistent

Some filenames are historical:

- `lib/openai.ts` actually talks to xAI
- `lib/openai-learning-course.ts` is not the active pipeline

Read the implementation, not only the filename.

### 5. Role Requirements Are Critical

Resume uploads can still generate a roadmap without rich role data, but the quality of gap analysis depends heavily on the employer having defined good role requirements first.

## Deployment Considerations

Before deploying this application seriously, review:

- WorkOS production credentials and redirect URIs
- Convex production deployment
- middleware auth restrictions
- removal of debug endpoints
- artifact storage strategy
- rate limiting and request throttling around AI generation
- secret handling and rotation
- cost controls for OpenAI and xAI usage

## Summary

Rellax is not just a marketing site with auth bolted on. The core of the product is a multi-stage onboarding engine:

- identity and role setup through WorkOS and Convex
- skill extraction from resumes
- employer-defined skill targets
- gap analysis
- roadmap generation
- module-by-module content generation
- exported learning assets
- persisted learner progress

If you want to understand the system quickly, the shortest path is:

1. read `components/employee/submit-resume-action.ts`
2. read `lib/content-engine.ts`
3. read `app/api/learning/generate/route.ts`
4. read `lib/learning-asset-generator.ts`
5. read `convex/schema.ts`

Those files explain the heart of the product.
