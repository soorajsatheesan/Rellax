# Agile Hierarchy & Ticket Standards

This document defines the standard format for creating tickets. All work must follow the hierarchy: **Epic > User Story > Task**.

---

## 1. Epic (The "Big Picture")
*Represents a large body of work that spans multiple sprints or releases.*

### Template
**Title:** `[EPIC] - {Feature Name or Initiative}`

**1. Executive Summary**
* **Objective:** What is the high-level goal?
* **Business Value:** Why are we doing this? Who benefits?

**2. Scope**
* **In Scope:** What specific features are included?
* **Out of Scope:** What are we explicitly NOT doing right now? (Crucial for preventing scope creep).

**3. Success Metrics (KPIs)**
* How will we measure success? (e.g., "Reduce load time by 20%", "Increase conversion by 5%").

**4. Key Deliverables**
* List of high-level features or modules required.

---

## 2. User Story (The "Vertical Slice")
*Represents a piece of functionality from an end-user perspective. Must adhere to the INVEST principle (Independent, Negotiable, Valuable, Estimable, Small, Testable).*

### Template
**Title:** `[STORY] - {Action verb} {Feature}`

**1. The Narrative (Standard Format)**
> **As a** {role/persona},
> **I want to** {perform an action},
> **So that** {I achieve a specific outcome/value}.

**2. Acceptance Criteria (The "Definition of Done")**
*Use Gherkin syntax (Given/When/Then) or clear checklist items.*
* [ ] **Scenario 1:** Happy Path
    * **Given** the user is on page X
    * **When** they click Y
    * **Then** Z should happen
* [ ] **Scenario 2:** Error Handling
    * **Given** the input is invalid
    * **When** the user submits
    * **Then** an error message "X" appears
* [ ] **Scenario 3:** UI/Responsiveness
    * Matches Figma design exactly on Mobile and Desktop.

**3. Technical Constraints / Notes**
* API endpoints involved.
* Database schema changes required.
* Security considerations (e.g., "Requires Auth Token").

**4. Estimations**
* Story Points / T-Shirt Size.

---

## 3. Task (The "Technical Implementation")
*Small, technical steps required to complete a User Story. These are usually written by developers for developers.*

### Template
**Title:** `[TASK] - {Technical Action} for {Story Name}`

**1. Description**
* Specific technical instruction (e.g., "Create POST /login endpoint").
* Link to the parent User Story.

**2. Technical Implementation Details**
* **File(s) to touch:** (e.g., `auth_controller.ts`, `user_model.py`)
* **Logic:**
    * Validate input X.
    * Call Service Y.
    * Return Response Z.
* **Dependencies:** Does this rely on another task?

**3. Verification Steps**
* How does the developer verify this works before handing it to QA? (e.g., "Run unit test suite `test_auth.py`").

---

## Example Workflow

### Epic: User Authentication
* **Goal:** Allow users to securely sign up and log in.

### Story: Email Login
* **As a** returning user, **I want to** log in with email/password, **So that** I can access my dashboard.
* **AC:**
    * Given valid credentials -> Redirect to dashboard.
    * Given invalid password -> Show "Invalid credentials" toast.

### Task: Backend API for Login
* **Action:** Implement `POST /api/v1/auth/login`.
* **Details:**
    * Accept `email`, `password`.
    * Hash password using bcrypt.
    * Compare with DB.
    * Issue JWT.
