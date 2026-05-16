# EverydayAI Tutor

![EverydayAI Tutor](docs/branding/images/readme-banner.png)

Monorepo for [AIEverydayTutor.com](https://www.aieverydaytutor.com) — the site for the [EverydayAI Tutor](https://www.youtube.com/@EverydayAITutor) YouTube channel.

> Practical AI for Everyday People — From Curious Beginner to Confident AI User

---

## What this is

A React site (videos, blog, about) with an **AI chat assistant** backed by API Gateway, a Python Lambda, and **Amazon Bedrock Knowledge Base**. Video and blog content is authored in Markdown and synced automatically to the site and chatbot via CI — no code edits required to publish.

---

## Repository layout

```
/
├── frontend/           # React + Vite + TypeScript + Tailwind
├── infrastructure/     # AWS CDK (site stack + chatbot stack)
├── chatbot/lambda/     # Python Lambda — Bedrock KB + converse API
├── knowledge-base/     # Markdown for Bedrock ingestion (synced via CI)
│   ├── website/        #   General site content (about, FAQ, etc.)
│   ├── videos/         #   One MD file per video — drives cards + chatbot
│   └── blogs/          #   One MD file per blog post — drives cards + chatbot
├── tools/              # CI scripts — gen-videos.py and gen-blogs.py generate static JSON
├── docs/               # Brand, UX, tech docs, Claude Code prompt log
├── .github/workflows/  # CI/CD — frontend, infrastructure, KB sync
└── SETUP.md            # Full local + AWS + GitHub setup
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Infrastructure | AWS CDK (TypeScript) |
| Hosting | AWS S3 + CloudFront |
| DNS | AWS Route 53 |
| SSL | AWS ACM |
| CI/CD | GitHub Actions (OIDC — no stored AWS credentials) |
| Package manager | pnpm |

---

## Quick start (frontend only)

Prerequisites: **Node.js** and **pnpm** — versions in [SETUP.md](SETUP.md).

```bash
git clone https://github.com/CumulusCycles/EverydayAI-Tutor.git
cd EverydayAI-Tutor

# Root PAT for tooling (e.g. Claude Code) — see SETUP.md
cp .env.example .env

cd frontend
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).  
Chat widget needs `VITE_CHAT_API_URL` in **`frontend/.env`** — see [SETUP.md](SETUP.md).

---

## Where to read next

| Topic | Location |
|---|---|
| Prerequisites, AWS CLI, CDK, Bedrock secrets, PAT | [SETUP.md](SETUP.md) |
| Stack, testing, CI/CD overview | [docs/tech/tech-stack.md](docs/tech/tech-stack.md) |
| Architecture diagrams | [docs/tech/architecture-diagram.md](docs/tech/architecture-diagram.md) |
| Brand & UI | [docs/branding/brand.md](docs/branding/brand.md), [docs/ux/site-structure.md](docs/ux/site-structure.md) |
| Docs index | [docs/README.md](docs/README.md) |
| Project rules (Claude Code, PRs, conventions) | [CLAUDE.md](CLAUDE.md), [.claude/rules/](.claude/rules/) |

---

## Contributing

- Default branch: **`main`**. Do not commit directly to `main` — use a feature branch and a PR (see [.claude/rules/workflow.md](.claude/rules/workflow.md)).
- **Package manager:** `pnpm` only — no npm or yarn.

---

## Deployment

Pushes to **`main`** trigger GitHub Actions. AWS access uses **OIDC** — no long-lived AWS keys stored in GitHub. Frontend artifacts go to **S3** with **CloudFront** invalidation; infrastructure via **`cdk deploy`**.

Details: [SETUP.md](SETUP.md), [docs/tech/architecture-diagram.md](docs/tech/architecture-diagram.md).

---

<p align="right">© 2026 EverydayAI Tutor.</p>
