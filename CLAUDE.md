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
- **Prompts log:** `docs/prompts/` — do not use this folder for context, it is a pedagogical record only

---

## Skills

- `/ship` — lint, build, commit, push, and open a PR in one shot
- `/done` — after PR is merged: checkout main, pull, delete local feature branch
- `/test` — run the full test suite (Vitest + Playwright)
- `/lint` — run ESLint and Prettier
- `/build` — run production build and report errors

---

## Agents

- **git-agent** (`.claude/agents/git-agent.md`) — specialist for all git and GitHub operations. Invoked by `/ship` and `/done`. Analyzes diffs, generates commit messages, creates PRs, and handles branch cleanup.

---

## MCP Servers

- **Context7** — provides up-to-date library docs for React, Vite, Tailwind, CDK, Playwright, and more. Configured in `.claude/settings.json`. Announce when using: "Using Context7 to look up..."
- **AWS IaC** — CDK best practices, CloudFormation docs, construct examples, security validation, and deployment troubleshooting. Configured in `.claude/settings.json`. Announce when using: "Using AWS IaC MCP to check..."
