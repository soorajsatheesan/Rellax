<div align="center">

![header](https://capsule-render.vercel.app/api?type=rect&height=180&color=0:0a0a0a,100:0a0a0a&fontColor=ffffff&fontSize=62&text=RELLAX&fontAlignY=52&desc=AI-Adaptive%20Onboarding%20Engine&descSize=14&descAlignY=74&descAlign=50)

<br/>

*Turn onboarding from static content into a personalized skill journey — powered by AI.*

<br/>

![Next.js](https://img.shields.io/badge/Next.js-0a0a0a?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-0a0a0a?style=flat-square&logo=typescript&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-0a0a0a?style=flat-square&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-0a0a0a?style=flat-square&logo=openai&logoColor=white)
![Hackathon](https://img.shields.io/badge/IISc%20Hackathon-0a0a0a?style=flat-square&logoColor=white)

</div>

---

## What is RELLAX?

RELLAX is an AI-driven onboarding platform that eliminates one-size-fits-all training. Instead of assigning the same content to every hire, RELLAX reads each employee's existing skills, compares them against role requirements, and generates a personalized learning path — automatically.

**The problem it solves:** Most onboarding wastes time. Senior hires sit through basics they already know. Juniors get overwhelmed without context. Neither gets what they actually need. RELLAX fixes this at the source by computing the exact delta between what someone knows and what their role demands.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        RELLAX SYSTEM                        │
├──────────────────────┬──────────────────────────────────────┤
│   EMPLOYER LAYER     │         EMPLOYEE LAYER               │
│                      │                                      │
│  · Add employees     │  · Upload resume                     │
│  · Define roles      │  · View skill gaps                   │
│  · Upload JDs        │  · Follow learning path              │
│  · Monitor progress  │  · Edit skills manually              │
├──────────────────────┴──────────────────────────────────────┤
│                      AI ENGINE                              │
│                                                             │
│   Resume → Skills    JD → Requirements    Gap = Δ Skills    │
│                                                             │
│   Learning Path ← Ordered by dependency + importance       │
├─────────────────────────────────────────────────────────────┤
│  Next.js · Convex · OpenAI · TypeScript                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Skill-Gap Analysis — How It Works

The core intelligence of RELLAX is the gap engine. Here's the logic:

### Step 1 — Skill Extraction
The employee uploads their resume. The AI engine parses it using an LLM prompt chain to extract a normalized list of skills:

```
Input:  Raw resume text
Prompt: "Extract all technical and soft skills. Return as JSON array with name, confidence, and category."
Output: ["Python", "REST APIs", "Team Leadership", ...]
```

### Step 2 — JD Parsing
The employer uploads a Job Description. The same pipeline extracts role-required skills:

```
Input:  Job Description text
Prompt: "Extract required and preferred skills from this JD. Tag each as required/preferred."
Output: { required: ["Python", "System Design"], preferred: ["Kubernetes"] }
```

### Step 3 — Skill Normalization
Raw extracted skills are mapped to a canonical skill ontology to resolve synonyms:

```
"JS"  →  "JavaScript"
"k8s" →  "Kubernetes"
"ML"  →  "Machine Learning"
```
Normalization uses embedding similarity — each raw skill is vectorized and matched to the nearest canonical entry in the taxonomy using cosine distance.

### Step 4 — Gap Computation

```
Gap = Required Skills − Existing Skills (normalized)

Example:
  Required:  [Python, System Design, Kubernetes, REST APIs]
  Employee:  [Python, REST APIs, Docker]
  
  Gap:       [System Design, Kubernetes]
  Overlap:   [Python, REST APIs]
  Bonus:     [Docker]  ← not required but present
```

### Step 5 — Learning Path Generation
Gap skills are not presented in arbitrary order. The engine orders them by:

1. **Dependency** — foundational skills before advanced ones (e.g. "Networking" before "Service Mesh")
2. **Importance weight** — required skills ranked above preferred
3. **Estimated effort** — short modules surface first to build momentum

```
Gap: [System Design, Kubernetes]

Path:
  1. Networking Fundamentals     ← prerequisite
  2. Distributed Systems Basics  ← prerequisite
  3. System Design               ← gap skill
  4. Container Fundamentals      ← prerequisite
  5. Kubernetes                  ← gap skill
```

Each step in the path links to curated content — documentation, videos, or AI-generated module summaries.

---

## User Flows

**Employer**
```
Login → Dashboard → Add Role (+ JD upload) → Add Employees → Monitor Progress
```

**Employee**
```
Login → Upload Resume → AI Analysis → View Roadmap → Learn → Track Progress
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js · React · TypeScript |
| Backend | Convex |
| AI / LLM | OpenAI API |
| Skill Matching | Text Embeddings + Cosine Similarity |
| Storage | Convex file storage |
| Auth | Convex Auth |

---

## Setup

### Prerequisites

- Node.js `v18+`
- npm or pnpm
- OpenAI API key
- Convex account

### Install

```bash
git clone https://github.com/soorajsatheesan/Rellax.git
cd Rellax
npm install
```

### Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

### Initialize Convex

```bash
npx convex dev
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Dependencies

```json
{
  "next": "^14.x",
  "react": "^18.x",
  "typescript": "^5.x",
  "convex": "^1.x",
  "openai": "^4.x"
}
```

Install all:

```bash
npm install next react react-dom typescript convex openai
```

---

## Key Design Decisions

**Why Convex?** Real-time reactivity out of the box. Employee progress updates propagate to the employer dashboard instantly without polling or websocket setup.

**Why embeddings for skill matching?** String matching fails on synonyms and abbreviations. Embedding similarity handles "ML" → "Machine Learning", "k8s" → "Kubernetes" without maintaining an explicit synonym dictionary.

**Why LLM for extraction over regex?** Resumes have no fixed format. LLM extraction generalizes across layouts, styles, and languages. Regex would require constant maintenance.

---

## What's Next

- Continuous learning loops beyond initial onboarding
- AI mentor / coach interface
- Real-time skill assessments
- HR tool integrations (Workday, SAP, BambooHR)
- Team-level skill mapping for managers

---

<div align="center">

<br/>

*Built at ArtPark CodeForge Hackathon
Indian Institute of Science (IISc), Bangalore*

** [Navyashree B C](https://github.com/Navyashree-B-C) · [Darshh](https://github.com/darshhv) · [Sooraj](https://github.com/soorajsatheesan)**

<br/>

</div>
