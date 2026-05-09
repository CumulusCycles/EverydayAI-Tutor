# CLAUDE.md
# EverydayAI Tutor — Project Guidance for Claude Code

This file provides project-specific guidance for Claude Code.
Global behavior is defined in the global `CLAUDE.md`.

---

## Project Rules

Detailed rules are in `.claude/rules/`:

| File | Coverage |
|---|---|
| `.claude/rules/project.md` | Repo structure, docs references, brand and UX guidance |
| `.claude/rules/workflow.md` | Git branching, PRs, commit conventions |
| `.claude/rules/frontend.md` | React, Vite, TypeScript, Tailwind conventions |
| `.claude/rules/infrastructure.md` | AWS CDK, deployment, infrastructure conventions |
| `.claude/rules/testing.md` | Vitest, Playwright, testing conventions |

---

## Quick Reference

- **Package manager:** pnpm — never npm or yarn
- **Language:** TypeScript everywhere — frontend and infrastructure
- **Branching:** Never commit directly to `main` — always feature branch + PR
- **Docs:** All project documentation is in `docs/` — read before building
- **Brand:** Follow `docs/branding/brand.md` for all UI decisions
- **Mockup:** Use `docs/ux/mockup-homepage.html` as visual reference for the homepage

## Commands
- `/pr` — create a pull request for the current branch
- `/test` — run the full test suite (Vitest + Playwright)
- `/lint` — run ESLint and Prettier
- `/build` — run production build and report errors
- `/commit` — lint, build, then commit with a well-formed commit message

## MCP Servers
- **Context7** — provides up-to-date library docs for React, Vite, Tailwind, CDK, Playwright, and more. Configured in `.claude/settings.json`.
- **AWS IaC** — CDK best practices, CloudFormation docs, construct examples, security validation, and deployment troubleshooting. Configured in `.claude/settings.json`.
