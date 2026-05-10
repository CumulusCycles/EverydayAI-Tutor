# Session 04 — Tests

**Branch:** `feature/tests`
**Date:** May 9, 2026

---

## Goal

Write unit tests for shared components and E2E smoke tests for all routes using Vitest, React Testing Library, and Playwright.

---

## Prompts

### Prompt 1

> Write tests for the frontend following the conventions in .claude/rules/testing.md.

1. src/components/ContentCard.test.tsx — unit tests covering:
   - Renders title, description, and publish date correctly
   - Renders thumbnail image when thumbnailUrl is provided
   - Renders placeholder when no thumbnailUrl
   - Shows "Coming soon" when publishDate is empty
   - External link has correct href, target="_blank", and rel="noopener noreferrer"

2. src/components/Navbar.test.tsx — unit tests covering:
   - Logo renders and links to /
   - All nav links render (Home, Videos, Blog, About)
   - Subscribe button renders with correct href to https://www.youtube.com/@EverydayAITutor
   - Subscribe button opens in new tab

3. src/components/Footer.test.tsx — unit tests covering:
   - Logo and tagline render
   - Nav links render
   - YouTube link renders with correct href
   - Copyright text renders
   - Privacy Policy link renders and points to /privacy

4. frontend/e2e/smoke.spec.ts — Playwright E2E smoke tests covering:
   - / loads and shows homepage content
   - /videos loads without errors
   - /blog loads without errors
   - /about loads without errors
   - /privacy loads without errors
   - Unknown route shows NotFound page
   - Also fix the favicon — ensure favicon.ico is correctly referenced in index.html as /favicon.ico

Run all tests when done and report results. Fix any failures before finishing.

### Result

Everything is green. Here's the full results summary:

  ---
  Test results
  
  Unit tests (Vitest) — 15/15 passed

  ┌──────────────────────┬───────┬────────┐
  │        Suite         │ Tests │ Result │
  ├──────────────────────┼───────┼────────┤
  │ ContentCard.test.tsx │ 6     │ ✓      │
  ├──────────────────────┼───────┼────────┤
  │ Navbar.test.tsx      │ 4     │ ✓      │
  ├──────────────────────┼───────┼────────┤
  │ Footer.test.tsx      │ 5     │ ✓      │
  └──────────────────────┴───────┴────────┘

  E2E tests (Playwright Chromium) — 6/6 passed

  ┌─────────────────────────────────┬────────┐
  │              Test               │ Result │
  ├─────────────────────────────────┼────────┤
  │ homepage loads with key content │ ✓      │
  ├─────────────────────────────────┼────────┤
  │ /videos loads page heading      │ ✓      │
  ├─────────────────────────────────┼────────┤
  │ /blog loads page heading        │ ✓      │
  ├─────────────────────────────────┼────────┤
  │ /about loads page heading       │ ✓      │
  ├─────────────────────────────────┼────────┤
  │ /privacy loads page heading     │ ✓      │
  ├─────────────────────────────────┼────────┤
  │ unknown route shows 404 page    │ ✓      │
  └─────────────────────────────────┴────────┘

  Lint + build — all clean

  ---
  What was created / fixed
  
  - src/components/ContentCard.test.tsx — 6 tests: title/description, date formatting, "Coming soon" on empty date, thumbnail image, placeholder when no thumbnail, external link
  attributes
  - src/components/Navbar.test.tsx — 4 tests: logo links to /, all nav links present, subscribe URL, new-tab attributes
  - src/components/Footer.test.tsx — 5 tests: logo + tagline, nav links, YouTube URL + new-tab, copyright text, Privacy Policy link to /privacy
  - e2e/smoke.spec.ts — 6 Playwright tests covering all 5 routes plus the 404 case; dev server starts automatically
  - vitest.config.ts — added exclude: ['**/e2e/**'] so Vitest doesn't try to run Playwright spec files as unit tests
  - Favicon — already correct (/favicon.ico in index.html, file at public/favicon.ico)

  Next steps

  1. /commit then /pr to ship this branch
  2. GitHub Actions CI/CD — create the deploy workflow from docs/tech/architecture-diagram.md (frontend build → S3 sync → CloudFront invalidation, plus CDK deploy on infra changes)
  3. Expand test coverage as pages are built out — add component tests for HomePage sections and E2E tests for interactive behaviors (hamburger menu, card hover states)

---
