# Coding Standards & Best Practices Context

## 1. Core Engineering Principles
* **SOLID Principles**:
    * **S**ingle Responsibility: A class/module should have one, and only one, reason to change.
    * **O**pen/Closed: Entities should be open for extension but closed for modification.
    * **L**iskov Substitution: Subtypes must be substitutable for their base types.
    * **I**nterface Segregation: Depend on specific interfaces rather than general-purpose ones.
    * **D**ependency Inversion: Depend on abstractions, not concretions.
* **DRY (Don't Repeat Yourself)**: Abstract duplicated logic into shared functions or modules to prevent redundancy.
* **KISS (Keep It Simple, Stupid)**: Avoid over-engineering. The simplest solution that fits the requirements is often the best.
* **YAGNI (You Aren't Gonna Need It)**: Do not implement features or abstractions based on speculative future needs.

## 2. Modularity & Architecture
* **Separation of Concerns**: Distinct logic (UI, Business Logic, Data Access) should reside in distinct modules/files.
* **High Cohesion, Low Coupling**: Modules should be self-contained and interact with others through strict, minimal interfaces.
* **Pure Functions**: Prefer pure functions (output determined solely by input, no side effects) wherever possible to make debugging and testing easier.
* **File Size Limits**: If a file exceeds 300-400 lines, consider refactoring it into smaller sub-modules.

## 3. Naming Conventions
* **Intent-Revealing Names**: Names must explain *what* a variable holds or *what* a function does.
    * *Bad*: `d` (days), `temp` (user data), `process()`
    * *Good*: `daysSinceModification`, `userProfile`, `calculateMonthlyRevenue()`
* **Consistency**: Stick to the project's casing convention (camelCase, snake_case, PascalCase) strictly. Do not mix styles.
* **Avoid Magic Numbers**: Replace hardcoded numbers/strings with named constants (e.g., `MAX_RETRY_ATTEMPTS = 3` instead of using `3` directly).
* **Boolean Variables**: Prefix booleans with `is`, `has`, or `can` to imply a question (e.g., `isValid`, `hasAccess`, `canEdit`).
* **Symmetry**: Use complementary pairs for naming (e.g., `get/set`, `add/remove`, `start/stop`, `min/max`).

## 4. Functions & Methods
* **Single Task**: A function should do exactly one thing. If it does "this AND that", break it apart.
* **Function Length**: Ideal functions are short (5-20 lines). If a function requires scrolling, it is likely too complex.
* **Argument Count**: Limit function arguments to 3 or fewer. If you need more, consider passing a configuration object or data structure.
* **Early Returns**: Use guard clauses to handle edge cases at the top of the function to avoid deep nesting of `if/else` blocks.

## 5. Documentation & Comments
* **Explain "Why", Not "What"**: Code tells you what is happening; comments should explain *why* that decision was made.
    * *Redundant*: `i++ // increment i`
    * *Useful*: `// Incrementing strictly by 1 to match the external API index requirement`
* **Docstrings/Header Comments**: Every public-facing function or class must have a summary describing its purpose, parameters, and return value.
* **Self-Documenting Code**: Prioritize readable code over comments. If a comment explains a complex block of code, try refactoring the code to be clearer first.
* **TODOs**: If a `TODO` is left in the code, it must include a brief explanation and, ideally, a linked issue ticket number.

## 6. Error Handling & Security
* **Fail Fast**: Do not hide errors. If a function receives invalid input, it should throw an exception or return an error immediately.
* **No Silent Failures**: Never use empty `catch/except` blocks. Always log the error or handle it explicitly.
* **Input Validation**: Validate all external inputs at the boundary of your system (API endpoints, function parameters) before processing.
* **Sanitization**: Never trust user input. Sanitize data before inserting it into a database or rendering it to a UI to prevent injection attacks.

## 7. Version Control & Commits
* **Atomic Commits**: Each commit should represent a single logical change or fix.
* **Commit Messages**: Use imperative mood (e.g., "Add feature" not "Added feature").
    * Format: `[Type]: Short description (50 chars)`
    * Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
