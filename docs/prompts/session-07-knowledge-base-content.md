# Session 07 — Knowledge Base Content

**Branch:** `feature/knowledge-base-content`
**Date:** May 10, 2026

---

## Goal

Create the initial knowledge base markdown files for the Bedrock Knowledge Base. These files contain clean, plain English content about the site, channel, and creator — optimized for semantic search.

---

## Prompts

### Prompt 1

> Create a knowledge-base/ folder at the repo root with the following markdown files. Each file should contain clean, plain English content optimized for semantic search — no JSX, no code, no markdown headers beyond what's needed for readability. Base the content on the actual site content in src/pages/ and src/data/.
>
> 1. knowledge-base/site-overview.md
>    - What AIEverydayTutor.com is
>    - Its mission and tagline
>    - Who it's for
>    - What visitors can find here (videos, blog posts)
>    - The YouTube channel link
>
> 2. knowledge-base/about-rob.md
>    - Rob Frenette's background
>    - Full-stack developer, cloud engineer, educator
>    - AWS Community Builder in AI Engineering
>    - Builds full-stack applications deployed on AWS cloud infrastructure
>    - Runs Cumulus Cycles YouTube channel (AWS cloud development and AI engineering tutorials)
>    - Why he created EverydayAI Tutor
>    - LinkedIn: https://www.linkedin.com/in/robertmfrenette
>    - Cumulus Cycles: https://www.youtube.com/@CumulusCycles
>
> 3. knowledge-base/learning-journey.md
>    - What visitors will learn on the channel
>    - The four content pillars: Understand AI, Use AI Tools, Master Prompting, Build with AI
>    - The journey from curious beginner to confident AI user
>    - No technical background required
>
> 4. knowledge-base/built-with-claude.md
>    - The site was built entirely using Claude Code
>    - No human developer wrote code directly
>    - What Claude Code is
>    - The tech stack that was built (React, Vite, TypeScript, Tailwind, AWS CDK, CI/CD)
>    - The workflow used (prompts → feature branches → PRs → deployed to AWS)
>    - GitHub repo: https://github.com/CumulusCycles/EverydayAI-Tutor
>    - This is also a demo for an upcoming Claude Code tutorial series on the channel
>
> 5. knowledge-base/faq.md
>    - What is EverydayAI Tutor?
>    - Who is this channel for?
>    - Do I need a technical background?
>    - Who created this site and channel?
>    - How was this site built?
>    - Where can I find the videos?
>    - Where can I find the blog posts?
>    - How can I stay updated on new content?
>    - What is Claude Code?
>    - Where is the source code for this site?
>
> Do not run lint or build checks — these are markdown content files only, not code.

### Result

⏺ All five files created: 

  knowledge-base/
  ├── site-overview.md
  ├── about-rob.md
  ├── learning-journey.md
  ├── built-with-claude.md
  └── faq.md

  Content is grounded directly in the page source — all six content pillars, the exact host bio, the tech stack list, the four-step workflow, and the correct URLs throughout.
  Ready to /ship when you are.

---

### Prompt 2

> Make two updates:

1. knowledge-base/built-with-claude.md — add a section at the end covering:
   - An AI-powered chat feature is being built
   - Powered by AWS Bedrock Knowledge Base and S3 Vectors
   - Users will be able to ask plain English questions about the site, channel, and content
   - The chatbot uses RAG (Retrieval Augmented Generation) to ground responses in actual site content
   - This is part of the same tutorial series — the chatbot build will be documented and open source

2. src/pages/BuiltWithAIPage.tsx — add a "Coming Soon" section before the CTA banner:
   - Section title: "Coming Soon: AI-Powered Chat"
   - Description: "We're adding an AI chatbot powered by AWS Bedrock Knowledge Base and S3 Vectors. Ask plain English questions about the site, the channel, and the content — and get grounded, accurate answers."
   - Style consistently with the rest of the page

Run lint and build checks when done.

### Result

⏺ Both done. Lint clean, build passes.

  - knowledge-base/built-with-claude.md — new closing paragraph covering the Bedrock Knowledge Base + S3 Vectors chatbot, RAG explained in plain English, and the open-source
  tutorial series commitment.
  - BuiltWithAIPage.tsx — new bg-brand-beige section inserted before the CTA banner, styled consistently with the rest of the page (matching badge pill, heading weight, and body
  text treatment). Ready to /ship.

---