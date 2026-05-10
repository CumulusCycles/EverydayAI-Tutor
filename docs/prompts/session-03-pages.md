# Session 03 — Remaining Pages

**Branch:** `feature/pages`
**Date:** May 9, 2026

---

## Goal

Build the remaining four pages — Videos, Blog, About, and Privacy — using the site structure document as reference and matching the homepage look and feel.

---

## Prompts

### Prompt 1

> Using docs/ux/site-structure.md as reference and matching the look and feel of the existing homepage, build the four remaining pages:

1. src/pages/VideosPage.tsx — page header with title and intro, full card grid of all videos from src/data/videos.ts using ContentCard, ordered by publish date newest first (coming soon items last)

2. src/pages/BlogPage.tsx — page header with title and intro, full card grid of all blog posts from src/data/posts.ts using ContentCard, ordered by publish date newest first

3. src/pages/AboutPage.tsx — page header, mission section explaining what the channel is about and who it's for, host section with brief bio, Subscribe CTA button

4. src/pages/PrivacyPage.tsx — simple, plain English privacy policy stating we do not currently collect any personal information, no analytics or tracking, no cookies beyond technically necessary, policy will be updated when user registration is added

Match the homepage styling — same font, colors, spacing, and card components. Use Tailwind CSS v4 utility classes. Run lint and build checks when done.

### Result

All clean. Here's a summary of what was built:

  ---
  What was created

  src/pages/VideosPage.tsx — Page header with title + intro, then a full 3-column card grid of all videos. Videos are sorted newest-first with coming-soon items (empty publishDate)
  pushed to the end. Includes an empty-state fallback.

  src/pages/BlogPage.tsx — Same pattern as Videos. Blog posts sorted newest-first by ISO date. Includes an empty-state fallback.

  src/pages/AboutPage.tsx — Four sections matching site-structure.md:
  - Page header
  - Mission (beige bg) — two-column: "Our Mission" prose + "Who It's For" checklist with orange ✓ marks
  - Learning Journey (white bg) — numbered 6-card grid of the content pillars from brand.md
  - The Host — prose bio section
  - Subscribe CTA banner (navy bg, matches homepage)

  src/pages/PrivacyPage.tsx — Plain English privacy policy. Six sections (What we collect, Analytics, Cookies, Third-party services, Future changes, Contact). Structured as data so
  adding/editing sections is one array entry. Contact email is aieverydayforyou@gmail.com.

  src/App.tsx — All five routes now fully wired. Also adds a proper NotFound component for the * route (styled headline + back-to-home link).

  All checks passed: TypeScript · ESLint · Prettier · vite build (51 modules, 588ms)

  ---
  Next steps

  1. /commit → /pr to get this branch merged
  2. Fill in the host bio on AboutPage with your real background — the placeholder text is editable at src/pages/AboutPage.tsx:114
  3. Add real video/post data — update src/data/videos.ts and src/data/posts.ts as the channel publishes content
  4. Write tests — ContentCard.test.tsx, Navbar.test.tsx, and E2E smoke tests for all routes in frontend/e2e/
  5. GitHub Actions CI/CD — set up the deployment workflow from docs/tech/architecture-diagram.md

---
