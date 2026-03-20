<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Local And Shared Knowledge

`.vibe/` is for collaborative, team-shared project knowledge and may be committed.

`.local_vibe/` is for local machine-specific knowledge and should not be committed.

If the user asks for a GitHub push or related GitHub publishing command, check `.local_vibe/github.md` first. If that file is not present, use the standard method for the current repo state.
