<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Local And Shared Knowledge

`.vibe/` is for collaborative, team-shared project knowledge and may be committed.

`.local_vibe/` is for local machine-specific knowledge and should not be committed.

# Task Folder Workflow

When working from `.vibe/tasks/`, agents must keep task state updated to avoid collisions:

* Every task file must have a short stable ID in both the file content and the filename.
* Use compact IDs such as `e1`, `s1`, `t1`, `t2`.
* Use filenames in the format `<task-id>.md`, for example `t1.md`.
* Epic and story IDs should also be written inside the document using the same compact style.
* If a document contains multiple implementation tasks, each task section must have its own unique `t...` ID.
* Before starting implementation on a task, move its file from `.vibe/tasks/to-do/` to `.vibe/tasks/ongoing/`.
* Only one active copy of a task file should exist at a time. Do not leave duplicates across folders.
* When the task is finished, verified, and ready to be considered done, move it from `.vibe/tasks/ongoing/` to `.vibe/tasks/completed/`.
* If work stops before completion, keep the task in `.vibe/tasks/ongoing/` and update the file with the latest status/blocker instead of moving it back silently.
* Before starting a new task, check `.vibe/tasks/ongoing/` to avoid overlapping work with another model or agent.
* If a task is blocked by another active task, note the dependency in the task file rather than creating a competing duplicate task.

If the user asks for a GitHub push or related GitHub publishing command, check `.local_vibe/github.md` first. If that file is not present, use the standard method for the current repo state.
