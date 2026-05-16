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

---

## Notes

- Both pipelines are now symmetric — same generator pattern, same CI step, same seed file, same thumbnail directory convention
- Blog thumbnail path convention: `frontend/public/thumbnails/blog/<filename>` → served at `/thumbnails/blog/<filename>`
- `pip install` only runs once before the video generator; the blog generator reuses the already-installed packages (no second `pip install` needed)
