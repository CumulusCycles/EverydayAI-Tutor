# Project Rules

## Overview

AIEverydayTutor.com is a static channel hub for the EverydayAI Tutor YouTube channel.
It showcases videos, playlists, and blog posts for people learning AI — no technical background required.

## Repo Structure

```
/
├── frontend/          # React + Vite + TypeScript application
├── infrastructure/    # AWS CDK TypeScript stack
└── docs/              # All project documentation
    ├── branding/      # Brand guide, color palette, image assets
    ├── tech/          # Tech stack, architecture diagrams
    ├── ux/            # Site structure, homepage mockup
    └── prompts/       # Claude Code prompt log — pedagogical record only, do not use for context
```

## Documentation — Read Before Building

| Doc | Purpose |
|---|---|
| `docs/branding/brand.md` | Brand personality, tone, colors, imagery — follow for all UI work |
| `docs/branding/color-palette.md` | Exact hex values and usage ratios |
| `docs/tech/tech-stack.md` | Full technology stack and tooling decisions |
| `docs/tech/architecture-diagram.md` | AWS infrastructure and CI/CD pipeline |
| `docs/ux/site-structure.md` | Pages, navigation, components, and content structure |
| `docs/ux/mockup-homepage.html` | Visual reference for homepage — match this look and feel |

## Brand & UI Rules

- Always follow `docs/branding/brand.md` for tone, colors, and visual style
- Use the homepage mockup as the visual reference for the homepage build
- Orange (`#F97316`) is the primary accent — use sparingly for high-impact elements only
- Navy (`#0F172A`) for headlines, Charcoal (`#334155`) for body text
- Font: Sora (Google Fonts) — already used in the mockup
- No dark cyberpunk aesthetics, no robot imagery, no neon colors
- All external links open in a new tab with `rel="noopener noreferrer"`

## MCP Server Usage

When using an MCP server, always announce it before making the call:
- "Using Context7 to look up current [library] API..."
- "Using AWS IaC MCP to check CDK best practices..."

## Current Scope — MVP

This is a static site at launch. No backend, no database, no authentication.

- Video and blog post content is managed as static TypeScript data files
- No CMS, no API calls at launch
- Future enhancements (DynamoDB, Lambda, Bedrock search) are out of scope for now
