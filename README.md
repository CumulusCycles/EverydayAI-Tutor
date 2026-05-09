# EverydayAI Tutor

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
├── docs/              # Project documentation
│   ├── README.md      # Docs index
│   ├── branding/      # Brand identity, color palette, and image assets
│   ├── tech/          # Technical documentation — stack and architecture
│   └── ux/            # UX documentation — site structure and mockups
└── img/               # Favicon and root-level image assets
    └── logo.ico
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router |
| Infrastructure | AWS CDK (TypeScript) |
| Hosting | AWS S3 + CloudFront |
| DNS | AWS Route 53 |
| SSL | AWS ACM |
| CI/CD | GitHub Actions |
| Package Manager | pnpm |

For full details see [`docs/tech/tech-stack.md`](docs/tech/tech-stack.md).

---

## Getting Started

### Prerequisites
- Node v25.2.1
- pnpm v11.0.9

### Install dependencies
```bash
cd frontend
pnpm install
```

### Run locally
```bash
pnpm dev
```

### Run tests
```bash
pnpm test
```

### Build for production
```bash
pnpm build
```

---

## Deployment

Infrastructure is provisioned with AWS CDK and deployed automatically via GitHub Actions on push to `main`.

- Frontend changes → builds with Vite → syncs to S3 → CloudFront cache invalidation
- Infrastructure changes → `cdk deploy`

For full details see [`docs/tech/architecture-diagram.md`](docs/tech/architecture-diagram.md).

---

## Documentation

All project documentation lives in [`docs/`](docs/README.md).

| Folder | Contents |
|---|---|
| [`docs/branding/`](docs/branding/) | Brand guide, color palette, image assets |
| [`docs/tech/`](docs/tech/) | Tech stack, architecture diagrams |
| [`docs/ux/`](docs/ux/) | Site structure, homepage mockup |

---

## License

Private — all rights reserved. © 2026 EverydayAI Tutor.
