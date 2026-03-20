# PRD — RELLAX

**AI-Adaptive Onboarding Engine**

---

## 1. Overview

RELLAX is an AI-driven onboarding platform that personalizes training pathways for employees based on their current skills, role requirements, and organizational context.

Instead of static onboarding, RELLAX dynamically identifies skill gaps and generates tailored learning journeys to achieve role-specific competency faster and more efficiently.

---

## 2. Problem

### Current State

* One-size-fits-all onboarding programs
* Time wasted for experienced hires
* Overload for beginners
* No visibility into actual skill gaps

### Core Problem

Organizations lack a system that:

* Understands employee skill levels
* Maps them to role requirements
* Generates adaptive learning paths

---

## 3. Goals

### Primary Goals

* Extract skills from resumes automatically
* Map skills to role requirements (JD)
* Identify skill gaps
* Generate personalized learning paths

### Secondary Goals

* Track employee progress
* Provide employer dashboard insights
* Enable scalable onboarding workflows

---

## 4. Users

### 1. Employer (Admin)

* Adds employees
* Defines roles & skill requirements
* Tracks onboarding progress

### 2. Employee

* Uploads resume
* Views personalized roadmap
* Completes learning modules

---

## 5. Core Features

### 5.1 Authentication

* Employer login
* Employee login

---

### 5.2 Employer Dashboard

#### Add Employee

* Name
* ID
* Email
* Role assignment
* Bulk upload (Excel)

#### Add Role

* Role Name
* Role ID
* Description
* Skills required
* JD upload / parsing

#### Employee Monitoring

* Progress tracking (% completion)
* Skill coverage tracking
* Performance insights

---

### 5.3 Employee Flow

1. Login
2. Upload Resume
3. Skill Extraction (AI)
4. Skill Gap Analysis
5. Personalized Learning Path Generated
6. Edit/Add Skills (manual override)
7. Start Learning Content

---

### 5.4 AI Engine (Core System)

#### Input

* Resume
* Job Description (JD)
* Skill taxonomy

#### Processing

1. Resume parsing → extract skills
2. JD parsing → required skills
3. Normalize skills → map to ontology
4. Gap analysis:

   ```
   Gap = Required Skills - Existing Skills
   ```
5. Generate learning path:

   * Order by dependency
   * Weight by importance

#### Output

* Skill gap report
* Learning roadmap

---

### 5.5 Content Engine

* Auto-generate learning modules OR
* Curate from:

  * Docs
  * Videos
  * Internal resources

---

## 6. User Flows

### Employer Flow

Login → Dashboard → Add Role → Add Employee → Monitor Progress

### Employee Flow

Login → Upload Resume → AI Analysis → View Roadmap → Learn → Progress Update

---

## 7. Data Model (Simplified)

### Employee

* id
* name
* email
* role_id
* skills[]
* progress

### Role

* id
* name
* description
* required_skills[]

### Skill

* name
* level (optional)
* category

### Learning Path

* employee_id
* modules[]
* completion %

---

## 8. Success Metrics

### Product Metrics

* Time to onboarding completion ↓
* Skill gap reduction %
* Course completion rate

### Engagement Metrics

* Daily active users
* Resume upload rate
* Learning path interaction

---

## 9. MVP Scope (Hackathon)

### Must Have

* Resume upload
* Skill extraction (LLM)
* JD parsing
* Gap analysis
* Learning path generation
* Basic dashboard

### Good to Have

* Excel bulk upload
* Progress tracking UI
* Skill editing

### Not Required (for MVP)

* Full LMS
* Deep analytics
* Complex permissions

---

## 10. Tech Approach (Suggested)

### Frontend

* Next.js / React

### Backend

* Convex / Node.js

### AI Layer

* OpenAI / local LLM
* Embeddings for skill matching

### Storage

* Resume storage (S3 / Blob)
* Structured DB for entities

---

## 11. Risks

* Skill extraction inaccuracies
* Poor skill taxonomy mapping
* Over-reliance on LLM hallucination
* Content generation quality

---

## 12. Future Scope

* Continuous learning system (not just onboarding)
* AI mentor / coach
* Real-time skill assessment
* Integration with HR tools (Workday, SAP)

---

## 13. Key Insight (Core Differentiator)

RELLAX is not a content platform.

It is a **decision engine** that:

* Understands skills
* Computes gaps
* Prescribes learning

---

## 14. One-Line Positioning

"RELLAX turns onboarding from static content into a personalized skill journey powered by AI."

---
