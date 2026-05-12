# EverydayAI Tutor

![EverydayAI Tutor](docs/branding/images/readme-banner.png)

Monorepo for [AIEverydayTutor.com](https://www.aieverydaytutor.com) — the website for the [EverydayAI Tutor](https://www.youtube.com/@EverydayAITutor) YouTube channel.

> Practical AI for Everyday People — From Curious Beginner to Confident AI User

---

## Overview

AIEverydayTutor.com is a channel hub for the EverydayAI Tutor YouTube channel. It showcases videos, playlists, and blog posts for people learning to use AI in everyday life — no technical background required.

---

## Repo Structure

```
/
├── frontend/          # React + Vite + TypeScript application
├── infrastructure/    # AWS CDK TypeScript stack
└── docs/              # Project documentation
    ├── README.md      # Docs index
    ├── branding/      # Brand identity, color palette, and image assets
    │   └── images/    # Logo, banner, thumbnails, favicon
    ├── tech/          # Technical documentation — stack and architecture
    ├── ux/            # UX documentation — site structure and mockups
    └── prompts/       # Claude Code prompt log — pedagogical record
```

---

## Tech Stack

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
| Package Manager | pnpm |

For full details see [`docs/tech/tech-stack.md`](docs/tech/tech-stack.md).

---

## Getting Started

See [SETUP.md](SETUP.md) for full setup instructions including prerequisites, AWS configuration, GitHub PAT setup, and Claude Code configuration.

### Quick Start
```bash
# Clone the repo
git clone https://github.com/CumulusCycles/EverydayAI-Tutor.git
cd EverydayAI-Tutor

# Copy environment variables
cp .env.example .env
# Add your GITHUB_TOKEN to .env

# Install frontend dependencies
cd frontend
pnpm install
pnpm dev
```

---

## Deployment

Infrastructure is provisioned with AWS CDK and deployed automatically via GitHub Actions on push to `main`. GitHub Actions authenticates with AWS via OIDC — no long-lived credentials are stored anywhere.

- Frontend changes → builds with Vite → syncs to S3 → CloudFront cache invalidation
- Infrastructure changes → `cdk deploy`

For full details see [`docs/tech/architecture-diagram.md`](docs/tech/architecture-diagram.md).

---

## Documentation

All project documentation lives in [`docs/`](docs/README.md).

| Folder | Contents |
|---|---|
| [`docs/branding/`](docs/branding/) | Brand guide, color palette, image assets |
| [`docs/tech/`](docs/tech/) | Tech stack, architecture diagrams, IAM policy |
| [`docs/ux/`](docs/ux/) | Site structure, homepage mockup |
| [`docs/prompts/`](docs/prompts/) | Claude Code prompt log |

---

## License

© 2026 EverydayAI Tutor.
