# Session 12 — Docs, Config Refresh, and Video Pipeline Planning

**Branches:** `fix/chat-url-overflow`, `docs/readme-banner`, `docs/readme-and-claude-rules`, `docs/update-md-files`, `feature/video-publishing-pipeline`
**PRs:** #41–45
**Date:** May 12–16, 2026

---

## Goal

Fix a chat widget overflow bug, polish documentation, sync all Claude config files to reflect the live chatbot stack, reorganize the knowledge base for scalability, and plan the video publishing pipeline.

---

## Prompts

### Prompt 1 — Fix chat URL overflow (PR #41)

> Long URLs in the chat widget (e.g. YouTube links) are overflowing the message bubble width. Fix it.

1. `frontend/src/components/ChatWidget.tsx` — added `break-words` Tailwind class to chat message bubble containers so long URLs wrap instead of overflowing.

### Result

Lint clean, build passes. PR #41 merged.

---

### Prompt 2 — Add README banner (PR #42)

> Add a banner image to the README showing the live site homepage.

1. `docs/branding/images/readme-banner.png` — added screenshot of live site homepage
2. `README.md` — added banner image reference at the top

### Result

PR #42 merged.

---

### Prompt 3 — Update README and add Claude rules (PR #43)

> Update README.md to reflect the current state of the project (chatbot, CI/CD, repo layout). Update CLAUDE.md to mention the chatbot and knowledge base. Add a .claude/rules/chatbot.md file covering the Lambda stack, Python conventions, CORS, KB content rules, and safety guardrails.

1. `README.md` — complete overhaul: accurate repo layout, chatbot mention, tech stack table, Contributing section, CI/CD description
2. `CLAUDE.md` — fixed language line to TypeScript + Python; added chatbot and knowledge-base entries to Quick Reference; added chatbot.md to rules table
3. `.claude/rules/chatbot.md` — new rules file covering Lambda stack, Python conventions, env vars, CORS, KB content rules, safety guardrails

### Result

Lint clean, build passes. PR #43 merged.

---

### Prompt 4 — Refresh memory and sync Claude config files (PR #44)

> Refresh your memory on this project and tell me where we left off.

> I want you to ensure the md files (CLAUDE.md and associated files in the .claude/* folder and sub-folders) are up-to-date based on what we implemented for this project thus far.

Identified stale content across four files:
- `.claude/rules/project.md` — missing `chatbot/` and `knowledge-base/` in repo tree; Current Scope still said "no backend, no API calls"
- `.claude/rules/infrastructure.md` — missing `chatbot-stack.ts` in lib/ tree; missing GitHub secrets table
- `.claude/rules/frontend.md` — missing `/built-with` route; `tailwind.config.ts` listed but doesn't exist (Tailwind v4)
- `.claude/agents/python-agent.md` — wrong directory path, wrong env var name (`KNOWLEDGE_BASE_ID` → `KB_ID`), stale MODEL_ARN, oversimplified CORS example

Also added a "Keeping Claude Config Current" rule to `workflow.md` and made it step 1 of the `ship` skill so it runs every time.

### Result

Lint clean, build passes. PR #44 merged.

---

### Prompt 5 — Reorganize knowledge base and plan video pipeline (PR #45)

> Should we move the current contents in the knowledge-base folder into knowledge-base/website, then create /videos and /blogs?

> Do the move, then verify the --delete, then do the update after the move steps.

> Please create a new NEW_VIDEO_v2.md with your suggested approach for adding a video.

Moved existing 5 KB files into `knowledge-base/website/`. Created `knowledge-base/videos/` and `knowledge-base/blogs/`. Verified `--delete` flag is present on the S3 sync in `deploy.yml` (line 145) — clean re-key on next CI run.

Proposed and documented a simpler v2 approach for the video publishing pipeline — build-time static generation instead of DynamoDB + Lambda:
- MD files in `knowledge-base/videos/` are the single source of truth
- `tools/gen-videos.py` (CI pre-build step) parses frontmatter → writes `frontend/src/data/videos.json`
- Vite bundles the JSON statically — no runtime API, no new AWS resources
- Chatbot KB sync unchanged

Updated all affected docs and Claude config files:
- `docs/runbooks/New_Video.md` — v2 runbook with corrected architecture diagram, prerequisites list (including YouTube URL), three-phase implementation spec
- `docs/tech/tech-stack.md` — full rewrite reflecting live dual CDK stacks, content pipeline, Tailwind v4
- `docs/ux/site-structure.md` — added `/built-with` and `*` routes; rewrote Content Management section
- `README.md` — updated "What this is"; added knowledge-base subdirs and `tools/` to repo layout
- `.claude/rules/project.md`, `CLAUDE.md`, `.claude/rules/chatbot.md` — updated to reflect new knowledge-base structure and `tools/` directory

### Result

Lint clean, build passes. KB re-ingested cleanly under new `website/` paths — chatbot unaffected. PR #45 merged.

---

## Notes

- `--delete` on the S3 sync means moving files in `knowledge-base/` re-keys them in S3 and triggers a full re-ingestion — existing chatbot knowledge is preserved, just re-indexed under new paths
- The video pipeline v2 approach (build-time static JSON) was chosen over v1 (DynamoDB + Lambda) because the catalog is small, single-author, and changes only on publish — a runtime API adds cost and failure modes for no benefit at this scale
- Claude config files should be reviewed and updated before every ship — now enforced as step 1 of the `/ship` skill
