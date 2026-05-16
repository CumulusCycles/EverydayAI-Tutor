# Session 16 — Blog Publishing Pipeline

**Branch:** `feature/blog-publishing-pipeline`
**PR:** #49
**Date:** May 16, 2026

---

## Goal

Apply the same content publishing pipeline pattern built for videos to blog posts. Publishing a new blog post should require only committing an MD file + thumbnail — no code changes, no manual JSON edits.

---

## Prompts

### Prompt 1

> before that, i want to add a new feature to apply the same funct to Blogs that we did for Videos. Make sense to do that?

Confirmed the approach: same pipeline end-to-end — `knowledge-base/blogs/*.md` frontmatter → `tools/gen-blogs.py` → `frontend/src/data/blogs.json` → Vite bundles statically. `deploy.yml` adds `knowledge-base/blogs/**` to the frontend trigger and runs `gen-blogs.py` pre-build.

Proposed `BlogPost` schema: `postId`, `title`, `description`, `publishDate` (required), `postUrl`, `thumbnail` (optional).

### Prompt 2

> i think we should include all of those for a Blog post.

Confirmed all fields. `thumbnail` initially proposed as optional.

### Prompt 3

> i will always create a thumbnail for a blog post

Changed `thumbnail` from optional to required. Added `--thumbnails-dir` argument to `gen-blogs.py` and file-existence validation — same as `gen-videos.py`.

---

## What was built

### `tools/gen-blogs.py`

Mirrors `gen-videos.py` exactly. Required fields: `postId` (must match filename stem), `title`, `description`, `publishDate` (ISO YYYY-MM-DD), `postUrl` (must match `^https?://`), `thumbnail` (filename, file must exist in `--thumbnails-dir`). Collects all errors before exiting. Sorts by `publishDate` DESC, `postId` ASC tiebreak. Writes `[]` and exits 0 if no MD files found.

### `tools/tests/test_gen_blogs.py`

26 pytest tests — same coverage pattern as `test_gen_videos.py`: sort order, tiebreak, all required fields, postId mismatch, invalid publishDate, invalid postUrl, missing thumbnail file, empty blog dir, dry-run.

### `frontend/src/types/content.ts`

`BlogPost` interface replaced (old: `id`, `publishDate?`, `thumbnailUrl?`, `postUrl` → new: `postId`, `title`, `description`, `publishDate`, `postUrl`, `thumbnail` — all required):

```typescript
export interface BlogPost {
  postId: string
  title: string
  description: string
  publishDate: string   // ISO YYYY-MM-DD
  postUrl: string
  thumbnail: string     // filename only, e.g. "b_my-first-post.png"
}
```

### `frontend/src/data/blogs.json`

New seed file committed as `[]`. CI overwrites before each build.

### `frontend/src/data/posts.ts`

Deleted — replaced by `blogs.json`.

### `frontend/src/pages/BlogPage.tsx`

Rewired to import from `blogs.json`; removed `sortPosts()` (generator sorts); updated field names; empty state is now an inline text message (no ContentCard placeholder).

### `frontend/src/pages/HomePage.tsx`

Blog section updated: imports `blogs.json`, uses `BlogPost` type, updated field names (`id`→`postId`, `thumbnailUrl`→`` `/thumbnails/blog/${post.thumbnail}` ``), added empty-state "Coming Soon" ContentCard when `blogs.json` is `[]`.

### `frontend/public/thumbnails/blog/`

New directory created with `.gitkeep`. Blog thumbnails stored here.

### `.github/workflows/deploy.yml`

- Frontend path trigger expanded: `knowledge-base/blogs/**` added alongside `knowledge-base/videos/**` and `tools/**`
- Added "Generate blogs.json" step after "Generate videos.json" (reuses the already-installed `pip install`)

### `.claude/rules/frontend.md`

Content Data section updated: documents both `Video` and `BlogPost` interfaces, both JSON imports pattern, both thumbnail URL constructions.

### `frontend/src/pages/BlogPage.test.tsx`

9 tests: empty state (heading, description, empty state message, no cards), populated state (title, description, Read post link with correct href + target + rel, thumbnail src, no empty state message). Uses `vi.doMock` + `vi.resetModules` to control `blogs.json` content per describe block.

### `frontend/src/pages/HomePage.test.tsx`

12 tests across 3 describe blocks (both empty, videos populated, blogs populated): heading, Subscribe CTA links, video empty state, blog empty state, video card rendering, blog card rendering, thumbnail src for both, cross-state empty state preservation.

### `docs/runbooks/New_Blog.md`

New operational runbook mirroring `New_Video.md`: step-by-step publish workflow, full frontmatter field reference, thumbnail spec, local validation commands, CI flow description, error modes table, summary.

### `docs/runbooks/README.md`

New index file: table of runbooks with when-to-use descriptions, pipeline summary.

### `docs/tech/tech-stack.md`

Updated: `blogs/` no longer marked "future"; `tools/` comment mentions both generators; Content Publishing Pipeline section split into Videos + Blog Posts subsections; CI/CD table frontend row updated to include `knowledge-base/blogs/**` and both generators.

### `docs/ux/site-structure.md`

Updated: blog pipeline no longer marked "future"; Content Management table updated; publish instructions updated to reference both runbooks.

### `.claude/rules/project.md`

Updated: `blogs/` no longer marked "future"; `tools/` comment mentions both generators; `runbooks/` added to `docs/` tree.

### `.claude/rules/frontend.md`

Updated: `data/` tree comment changed from "Static TypeScript data files" to "Generated JSON data files"; `src/test/` and `public/thumbnails/` added to project structure tree.

### `.claude/rules/chatbot.md`

Updated: `knowledge-base/blogs/` no longer marked "future".

### `.claude/agents/python-agent.md`

Updated: project structure section now includes `tools/` directory alongside `chatbot/lambda/`.

### `docs/tech/architecture-diagram.md`

Major update: CI/CD diagram (section 2) rewritten to show all 3 jobs with generator steps and KB sync; section 3 DynamoDB node removed (never existed); section 4 rewritten from DynamoDB Streams → actual S3 sync + Bedrock ingestion flow; Key Design Decisions table rewritten to remove DynamoDB and reflect actual architecture; Notes updated.

### `README.md`

Updated: `blogs/` no longer marked "future"; `tools/` comment mentions both generators.

---

## Notes

- Both pipelines are now symmetric — same generator pattern, same CI step, same seed file, same thumbnail directory convention
- Blog thumbnail path convention: `frontend/public/thumbnails/blog/<filename>` → served at `/thumbnails/blog/<filename>`
- `pip install` only runs once before the video generator; the blog generator reuses the already-installed packages (no second `pip install` needed)
- `vi.doMock` + `vi.resetModules` pattern required for testing components that import JSON at module level — same pattern works for both BlogPage and HomePage
- Architecture diagram DynamoDB references were from the original v1 design spec (never built) — now correctly reflects the actual MD → S3 → Bedrock pipeline
