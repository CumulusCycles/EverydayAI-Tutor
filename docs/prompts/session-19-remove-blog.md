# Session 19 — Remove Blog Functionality

**Branch:** `refactor/remove-blog`
**PR:** TBD

---

## Prompts

> Refresh yourself with this project

> What would it take to remove the Blog functionality from the site? This includes all blog-specific wording in req docs, react code, lambda(s), cdk, AWS blog-specific infra, docs/website, and any other content regarding blogs in the project?

> yes

---

## What Was Built

Removed blog functionality from every layer of the project — no blog-specific AWS infrastructure existed so no teardown was required.

### Deleted files
- `frontend/src/pages/BlogPage.tsx`
- `frontend/src/pages/BlogPage.test.tsx`
- `frontend/src/data/blogs.json`
- `tools/gen-blogs.py`
- `tools/tests/test_gen_blogs.py`
- `docs/runbooks/New_Blog.md`
- `knowledge-base/blogs/` (directory)
- `frontend/public/thumbnails/blog/` (directory)

### Frontend code changes
- `App.tsx` — removed BlogPage import and `/blog` route
- `Navbar.tsx` — removed Blog nav link
- `Footer.tsx` — removed Blog nav link
- `HomePage.tsx` — removed blogs.json import, BlogPost type, `latestPosts`, and "Latest Blog Posts" section
- `types/content.ts` — removed `BlogPost` interface

### Test updates
- `HomePage.test.tsx` — removed blog mock, blog empty state test, and "blogs populated" describe block; renamed describe blocks to reflect video-only focus
- `Navbar.test.tsx` — updated "five navigation links" → "four navigation links"; removed Blog assertion
- `Footer.test.tsx` — updated nav links test to assert Blog link is NOT present
- `e2e/smoke.spec.ts` — removed `/blog loads page heading` test; removed `/blog` from nav link route list

### CI/CD
- `deploy.yml` — removed `knowledge-base/blogs` from frontend path trigger grep; removed `Generate blogs.json` step

### Knowledge base content
- `knowledge-base/website/faq.md` — removed "Where can I find the blog posts?" Q&A
- `knowledge-base/website/site-overview.md` — removed "read blog posts on AI topics" reference
- `knowledge-base/website/details.md` — updated Content Structure to four sections (no Blog)

### Docs
- `docs/runbooks/README.md` — removed New_Blog.md row; simplified pipeline description to videos only
- `docs/ux/site-structure.md` — removed Blog page row, Blog nav link, Blog ContentCard references, "Latest Blog Posts" section, and Blog `/blog` page detail; updated Content Management table
- `docs/tech/tech-stack.md` — removed blogs/ from repo tree; removed blog from content pipeline and CI/CD table
- `docs/tech/architecture-diagram.md` — removed blog references from CI/CD diagram and flow descriptions
- `README.md` — removed blogs/ from repo tree; updated description

### Claude config
- `CLAUDE.md` — updated knowledge-base subdirectory description
- `.claude/rules/project.md` — removed Blog from overview, repo tree, and current scope
- `.claude/rules/chatbot.md` — removed blogs/ from KB subdirectory table
- `.claude/rules/frontend.md` — removed BlogPost interface, blogs.json, blog route, blog thumbnail path
- `.claude/rules/testing.md` — updated "Video and blog cards" → "Video cards"

---

## Verification

- 33 unit tests passing (down from 48 — blog-specific tests removed)
- 12 E2E tests (down from 13 — `/blog` smoke test removed)
- Production build clean, no TypeScript errors
- ESLint clean
