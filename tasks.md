# Rellax — Agile Implementation Tasks (Employee-first, Merge-safe)

Date: 2026-03-20
Principle: Epic > User Story > Task

---
## 1) EPIC — [EPIC] - Employee Learning Journey MVP (Resume -> Skills -> Roadmap -> Progress)

### 1. Executive Summary
**Objective:** Deliver the employee experience for uploading a resume, extracting skills, computing skill gaps vs role requirements, generating a learning roadmap, and tracking module progress.
**Business Value:** Reduces onboarding time by making training personalized and data-driven.
**Beneficiaries:** Employees (primary), Employer (indirect later insights).

### 2. Scope
In Scope:
- Employee dashboard rendering (replace placeholders)
- Resume upload + roadmap generation workflow (MVP)
- Skill extraction, gap analysis, learning path generation (MVP)
- Progress persistence (MVP)
Out of Scope (initially):
- Full LMS / module content pages
- Deep analytics
- Complex permissioning beyond current auth

### 3. Success Metrics (KPIs)
- Resume upload rate
- Learning path interaction rate
- % employees who complete at least 1 module
- Progress state persists after refresh

### 4. Key Deliverables
- Convex data model for employee learning artifacts (employee-owned)
- Employee routes + UI for dashboard/roadmap/upload
- Convex queries/mutations for roadmap + progress

---
### 1) STORY — [STORY] - View assigned modules on Employee Dashboard

**Title:** `[STORY] - View assigned modules (no placeholders)`

1. The Narrative
> **As a** logged-in employee,  
> **I want to** see my assigned learning modules,  
> **So that** I know what to learn next.

2. Acceptance Criteria (Definition of Done)
- [ ] Given an authenticated employee
- [ ] When they visit `/employee/dashboard`
- [ ] Then the page renders modules from Convex (no `PLACEHOLDER_COURSES`)
- [ ] When a module status is `not_started`, it shows “Not started”
- [ ] When status is `in_progress`, it shows “In progress”
- [ ] When status is `completed`, it shows “Completed”
- [ ] If no learning path exists yet, a CTA to upload resume is shown

3. Technical Constraints / Notes
- Requires learning-path/module read models from Convex.
- Employer contract for gap analysis: `role_requirements` keyed by `roleTitle`.

4. Estimations
- Story points / size: M

#### Tasks (Technical Implementation)
1. Add learning-path/module query for current employee
   - **Link to Story:** `View assigned modules on Employee Dashboard`
   - **File(s) to touch:** `convex/**` (employee-owned)
   - **Logic:**
     - Read current employee identity via Convex auth
     - Load assigned learning path + modules + status
   - **Dependencies:** Learning data model exists (see next stories)
   - **Verification Steps:** Roadmap modules appear correctly after data exists
2. Replace placeholder module rendering with real Convex data
   - **File(s) to touch:** `app/employee/dashboard/page.tsx`
   - **Logic:** Swap `PLACEHOLDER_COURSES` for the Convex result
   - **Verification Steps:** UI shows real module cards and correct status labels

---
### 2) STORY — [STORY] - Upload resume and generate roadmap

**Title:** `[STORY] - Upload resume -> generate roadmap`

1. The Narrative
> **As a** new employee,  
> **I want to** upload my resume,  
> **So that** I get a personalized learning roadmap.

2. Acceptance Criteria
- [ ] Given an authenticated employee
- [ ] When they submit resume from employee UI
- [ ] Then the system persists the resume intake (MVP handling)
- [ ] Then the system extracts skills from resume (LLM step; MVP can be mocked if needed)
- [ ] Then it loads role requirements using `role_requirements` with employee `roleTitle`
- [ ] Then it computes skill gaps: `gaps = requiredSkills - existingSkills`
- [ ] Then it generates learning path modules (ordered)
- [ ] Then `/employee/roadmap` renders the generated modules

3. Technical Constraints / Notes
- Resume storage:
  - MVP option A: store resume text
  - Later: file storage (S3/Blob) for real PDF parsing
- Roadmap generation must be persisted so refresh works.

4. Estimations
- Story points / size: L

#### Tasks
1. Add employee-owned learning schema (tables)
   - **File(s) to touch:** `convex/schema.ts` (SHARED SCHEMA CHANGE; coordinate with employer)
   - **Suggested minimum tables:**
     - `employee_resumes`
     - `employee_skills`
     - `role_gaps` or `employee_skill_gaps`
     - `learning_paths`
     - `learning_path_modules`
     - `module_progress` (optional if embedded in module statuses)
   - **Verification Steps:** Convex redeploy succeeds and queries can access tables
2. Implement Convex mutation for resume submission -> pipeline
   - **File(s) to touch:** `convex/employee-*.ts` (employee-owned)
   - **Logic:**
     - validate inputs
     - persist resume intake + generate learning path records
     - run extraction + gap analysis + module generation (sync for MVP)
   - **Verification Steps:** Roadmap appears after resume submission
3. Implement Convex query for roadmap view
   - **File(s) to touch:** `convex/employee-*.ts`
   - **Verification Steps:** `/employee/roadmap` renders correct module list
4. Add UI routes:
   - `app/employee/upload-resume/page.tsx`
   - `app/employee/roadmap/page.tsx`
   - **File(s) to touch:** `components/employee/**` (employee-only)
   - **Verification Steps:** upload resume -> roadmap appears without placeholder data

---
### 3) STORY — [STORY] - Start and complete modules (persisted progress)

**Title:** `[STORY] - Persist module progress`

1. The Narrative
> **As a** logged-in employee,  
> **I want to** start and complete modules,  
> **So that** my progress updates reliably.

2. Acceptance Criteria
- [ ] Given an employee has assigned modules
- [ ] When they start a module
  - Then module status becomes `in_progress`
- [ ] When they complete a module
  - Then module status becomes `completed`
- [ ] After refresh, statuses and dashboard counts remain correct

3. Technical Constraints / Notes
- Use Convex mutations for status persistence.
- Dashboard reads from persisted status fields.

4. Estimations
- Story points / size: M

#### Tasks
1. Add Convex mutation: `startModule`
   - **File(s) to touch:** `convex/employee-*.ts`
   - **Logic:** validate module belongs to current employee; then set `in_progress`
   - **Verification Steps:** Start persists after refresh
2. Add Convex mutation: `completeModule`
   - **File(s) to touch:** `convex/employee-*.ts`
   - **Logic:** set `completed`; optionally record `completedAt`
   - **Verification Steps:** Completed persists after refresh
3. Implement UI handlers for module actions
   - **File(s) to touch:** `app/employee/dashboard/page.tsx` and/or `components/employee/**`
   - **Verification Steps:** Start/complete updates card status and dashboard counts

---
### 4) STORY — [STORY] - Edit extracted skills and regenerate gaps/roadmap (Good to Have)

**Title:** `[STORY] - Edit skills -> regenerate`

1. The Narrative
> **As a** employee,  
> **I want to** edit my extracted skills,  
> **So that** my roadmap better matches my actual experience.

2. Acceptance Criteria
- [ ] Given a roadmap exists
- [ ] When employee edits skill list (add/remove/level)
- [ ] Then extracted skills are updated
- [ ] Then gap analysis and roadmap generation updates (rerun can be simplified for MVP)
- [ ] Then dashboard/roadmap reflect updated modules

3. Technical Constraints / Notes
- If time is limited, keep MVP functional without this story.

4. Estimations
- Story points / size: S/M

#### Tasks
1. UI skill editor
   - **File(s) to touch:** `components/employee/**`
2. Convex mutations for updating extracted skills
   - **File(s) to touch:** `convex/employee-*.ts`
3. Convex mutation to recompute gaps + regenerate learning path modules
   - **File(s) to touch:** `convex/employee-*.ts`

---
## 2) EPIC — [EPIC] - Employee Change Password (Employee-only)

### 1. Executive Summary
**Objective:** Enable an authenticated employee to change their password after login.
**Business Value:** Improves security and reduces support burden.
**Beneficiaries:** Employees.

### 2. Scope
In Scope:
- `/employee/change-password` page
- Server action to verify current password and update password in WorkOS
- Dashboard entry point link/button
Out of Scope:
- Convex audit/event tracking for password changes (optional)

### 3. Success Metrics
- Password change success rate
- Wrong current password maps to a clear user-facing error

### 4. Key Deliverables
- Employee change password UI + server action
- Dashboard link/button

---
### 1) STORY — [STORY] - Change password while logged in

**Title:** `[STORY] - Change password (WorkOS-backed)`

1. The Narrative
> **As a** logged-in employee,  
> **I want to** change my password,  
> **So that** I can keep my account secure.

2. Acceptance Criteria
- [ ] Given an authenticated employee session
- [ ] When they submit valid current + new + confirm passwords
- [ ] Then WorkOS password update succeeds
- [ ] Then user is redirected back to `/employee/dashboard`
- [ ] When current password is wrong
- [ ] Then UI shows: `Current password is incorrect.`
- [ ] When new password != confirm password
- [ ] Then UI shows: `New password and confirm password must match.`
- [ ] After success, subsequent sign-in works with the new password

3. Technical Constraints / Notes
- Employee-only implementation (no employer dependencies).
- Must use WorkOS methods:
  - verify current password via `authenticateWithPassword`
  - update password via `userManagement.updateUser({ userId, password })`
- Use `withAuth({ ensureSignedIn: true })` to get WorkOS user `id` and `email`.

4. Estimations
- Story points / size: M

#### Tasks
1. Create route: `app/employee/change-password/page.tsx`
   - **File(s) to touch:** `app/employee/change-password/page.tsx`
   - **Logic:** `withAuth()` guard + render form component
   - **Verification Steps:** unauthorized users cannot access this page
2. Create client form: `components/employee/change-password-form.tsx`
   - **File(s) to touch:** `components/employee/change-password-form.tsx` (new)
   - **Logic:** fields `currentPassword`, `newPassword`, `confirmPassword`; validate match
   - **Verification Steps:** errors show in UI on mismatch
3. Create server action: `components/employee/change-password-action.ts`
   - **File(s) to touch:** `components/employee/change-password-action.ts` (new)
   - **Logic:**
     - `"use server"`
     - validate inputs (non-empty + basic min length)
     - `withAuth({ ensureSignedIn: true })`
     - verify current password via WorkOS `authenticateWithPassword`
     - if verified, update via WorkOS `userManagement.updateUser`
     - redirect to `/employee/dashboard`
   - **Verification Steps:** success path updates password in WorkOS
4. Add dashboard entry link/button
   - **File(s) to touch:** `app/employee/dashboard/page.tsx`
   - **Logic:** “Change password” link near “Sign out”
   - **Verification Steps:** link works and form submits
5. Implement error mapping rules in the action
   - Wrong current password -> `Current password is incorrect.`
   - Mismatch -> `New password and confirm password must match.`
   - Unknown -> `Unable to update password right now. Please try again.`

## Integration Contract Note
Employee stories reference employer-provided role requirements as an integration contract.
This file intentionally excludes employer implementation tasks to avoid merge conflicts.

