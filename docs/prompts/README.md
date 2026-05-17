# EverydayAI Tutor — Claude Code Prompts

A running log of prompts used to build AIEverydayTutor.com with Claude Code.

This folder serves as both a pedagogical resource for the EverydayAI Tutor Claude Code tutorial series and a practical record of how the site was built — prompt by prompt.

**These prompts are here intentionally.** This repository is open source specifically so that learners can see exactly how a real production website was built using Claude Code — every prompt, every fix, every decision. Nothing is hidden. That transparency is the point.

If you're following along with the EverydayAI Tutor Claude Code tutorial series, these session files are your reference — the exact prompts used at each stage of the build.

---

## Structure

Each session gets its own file, named by session number and feature:

```
prompts/
├── README.md
├── session-01-project-scaffold.md
├── session-02-frontend-setup.md
└── ...
```

---

## Sessions

## Sessions

| Session | File | Branch | Description |
|---|---|---|---|
| 01 | `session-01-project-scaffold.md` | `feature/project-scaffold` | Initial monorepo scaffold — frontend and infrastructure setup |
| 02 | `session-02-homepage.md` | `feature/homepage` | Homepage, Navbar, Footer, ContentCard, static data files |
| 03 | `session-03-pages.md` | `feature/pages` | Videos, Blog, About, and Privacy pages |
| 04 | `session-04-tests.md` | `feature/tests` | Unit tests for components and E2E smoke tests for all routes |
| 05 | `session-05-ci-cd.md` | `feature/ci-cd` | GitHub Actions workflow for frontend deploy and CDK deploy |
| 06 | `session-06-fixes.md` | various | Bug fixes and workflow corrections |
| 07 | `session-07-knowledge-base-content.md` | `feature/knowledge-base-content` | Initial knowledge base markdown files for Bedrock Knowledge Base |
| 08 | `session-08-chatbot-infrastructure.md` | `feature/chatbot-infrastructure` | KB S3 bucket, Bedrock Knowledge Base, S3 Vectors CDK infrastructure and GHA workflow updates |
| 09 | `session-09-hooks.md` | `setup/hooks` | PostToolUse hooks for auto-formatting TS/TSX and Python on every file edit |
| 10 | `session-10-chatbot-lambda.md` | `feature/chatbot-lambda` | Python Lambda + API Gateway querying Bedrock Knowledge Base with S3 Vectors |
| 11 | `session-11-chatbot-ui.md` | `feature/chatbot-ui` | React floating chat widget connecting to API Gateway + Bedrock KB |
| 12 | `session-12-docs-config-video-pipeline.md` | various (#41–45) | Chat URL fix, README/Claude config refresh, knowledge-base reorganization, video pipeline v2 runbook |
| 13 | `session-13-gen-videos-script.md` | `feature/gen-videos-script` | Phase 1: `tools/gen-videos.py` — MD frontmatter parser and static JSON generator (26 tests) |
| 14 | `session-14-frontend-videos-json.md` | `feature/frontend-videos-json` | Phase 2: replace `videos.ts` with `videos.json` import; update Video interface; wire HomePage + VideosPage |
| 15 | `session-15-ci-video-pipeline.md` | `feature/ci-video-pipeline` | Phase 3: wire generator into deploy.yml; expand frontend path trigger; add memory + prompts rules to /ship |
| 16 | `session-16-blog-publishing-pipeline.md` | `feature/blog-publishing-pipeline` | Blog pipeline mirroring video pipeline: gen-blogs.py, blogs.json, BlogPost interface, BlogPage + HomePage wired |
| 17 | `session-17-creator-identity-kb.md` | `knowledge-base/creator-identity-details` | Fix chatbot hallucination: chatbot was attributing site creation to "Matthew Berman"; added creator attribution to site-overview.md and created details.md with comprehensive creator identity content |
| 18 | `session-18-fix-built-with-chatbot-live.md` | `fix/built-with-ai-chatbot-live` | Fix stale "Coming Soon" content on BuiltWithAIPage and knowledge-base/website/built-with-claude.md — chatbot has been live for weeks; replaced badge, updated copy, added 4 missing tech stack entries |
| 19 | `session-19-remove-blog.md` | `refactor/remove-blog` | Remove blog functionality from every layer — pages, routes, nav, types, generator, CI, docs, KB content, Claude config |