# Session 01 — Project Scaffold

**Branch:** `feature/project-scaffold`
**Date:** May 9, 2026

---

## Goal

Scaffold the full monorepo structure — frontend (React + Vite + TypeScript + Tailwind + React Router) and infrastructure (AWS CDK TypeScript) folders, install dependencies, and configure all tooling.

---

## Prompts

### Prompt 1

> Please read all files in the docs/ folder, including all subfolders, before doing anything else. Pay particular attention to docs/branding/brand.md, docs/tech/tech-stack.md, docs/ux/site-structure.md, docs/ux/mockup-homepage.html, and .claude/rules/. Once you have read everything, scaffold the monorepo structure as defined in the tech stack — create the frontend/ folder with React + Vite + TypeScript + Tailwind CSS + React Router, and the infrastructure/ folder with AWS CDK TypeScript. Install all dependencies with pnpm. Configure ESLint, Prettier, Vitest, and Playwright. Do not build any pages yet — just get the project structure, tooling, and configuration correct. When done, summarize what was created and what the next steps are.

### Result

Everything is scaffolded and verified. Here's the summary:

  ---
  What was created

  frontend/ — React + Vite + TypeScript application

  ┌───────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────┐
  │                File / Dir                 │                                        Purpose                                         │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/main.tsx                              │ App entry — BrowserRouter wraps App                                                    │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/App.tsx                               │ All 5 routes stubbed (/, /videos, /blog, /about, /privacy, *)                          │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/index.css                             │ Tailwind v4 import + @theme block with all brand colors (navy, orange, charcoal, etc.) │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/vite-env.d.ts                         │ Vite client types (makes CSS imports type-safe)                                        │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/{components,data,pages,types,assets}/ │ Empty dirs per project rules                                                           │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ src/test/setup.ts                         │ @testing-library/jest-dom import for all Vitest tests                                  │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ e2e/                                      │ Empty dir — Playwright E2E tests go here                                               │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ vite.config.ts                            │ @vitejs/plugin-react + @tailwindcss/vite                                               │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ vitest.config.ts                          │ jsdom environment, setup file wired                                                    │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ playwright.config.ts                      │ Chromium, baseURL localhost:5173, web server auto-starts                               │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ eslint.config.js                          │ ESLint v9 flat config + react-hooks + react-refresh + Prettier compat                  │
  ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
  │ .prettierrc                               │ Single quotes, no semi, 100 print width                                                │
  └───────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────┘

  infrastructure/ — AWS CDK TypeScript

  ┌──────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │     File     │                                                  Purpose                                                   │
  ├──────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ bin/app.ts   │ CDK app entry, us-east-1                                                                                   │
  ├──────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ lib/stack.ts │ Full launch stack: private S3 + CloudFront OAC + ACM (both SANs) + Route 53 A + CNAME + 403/404→index.html │
  ├──────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ cdk.json     │ CDK app config with all modern feature flags                                                               │
  └──────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Root
  - pnpm-workspace.yaml — workspaces: frontend, infrastructure
  - .npmrc — allow-build=esbuild (pnpm 11 security gate)
  
  All checks passed:
  - tsc --noEmit — clean (frontend + infrastructure)
  - eslint . — clean
  - prettier --check . — clean
  - vitest run --passWithNoTests — exits 0
  - vite build — production bundle builds in 582ms

  ---
  Next steps
  
  1. Build the homepage — use docs/ux/mockup-homepage.html as the visual reference; create src/pages/HomePage.tsx, shared Navbar and Footer components, and the ContentCard component
  2. Add static data — create src/data/videos.ts and src/data/posts.ts with the TypeScript types from src/types/
  3. Build remaining pages — Videos, Blog, About, Privacy
  4. Write first tests — unit tests for components + E2E smoke tests for all routes
  5. Open PR — run /commit then /pr to merge into main

---
