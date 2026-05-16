# Session 14 — Frontend Videos JSON Wiring (Phase 2)

**Branch:** `feature/frontend-videos-json`
**PR:** #47
**Date:** May 16, 2026

---

## Goal

Phase 2 of the video publishing pipeline: replace the static `videos.ts` data file with a generated `videos.json` import, update the `Video` interface to match the generator output schema, and wire both `HomePage` and `VideosPage` to the new data shape.

---

## Prompts

### Prompt 1

> yes

*(In context of: "ready to start Phase 2?" — frontend wiring)*

Made the following changes:

1. **`frontend/src/types/content.ts`** — Updated `Video` interface:
   - `id` → `videoId` (matches MD filename / generator output key)
   - `thumbnailUrl?: string` → `thumbnail: string` (filename only, e.g. `v_what_ai_actually_is.png`; parent page constructs full path)
   - `publishDate` made required (was optional)
   - `youtubeUrl` already existed, kept as-is

2. **`frontend/src/data/videos.json`** — New seed file committed as `[]`; TypeScript compiler requires the file to exist at build time in a fresh checkout; CI overwrites it with real data before building

3. **`frontend/src/data/videos.ts`** — Deleted (replaced by JSON import)

4. **`frontend/src/pages/VideosPage.tsx`** — Updated imports to use `videos.json`; removed `sortVideos()` call (generator sorts); updated field references (`id`→`videoId`, `thumbnailUrl`→`` `/thumbnails/video/${video.thumbnail}` ``, `youtubeUrl` for link)

5. **`frontend/src/pages/HomePage.tsx`** — Same import update; updated field references; empty state: renders a "Coming Soon" placeholder `ContentCard` when `videos.json` is `[]`

6. **`frontend/tsconfig.app.json`** — Added `"resolveJsonModule": true` (required for TypeScript JSON imports with `moduleResolution: bundler`)

### Result

`pnpm build` passes cleanly. TypeScript strict-mode happy. `videos.json` seed file (`[]`) committed so CI and fresh checkouts both work without running the generator first.

---

## Notes

- Thumbnail URL construction is intentionally in the page, not the data file — keeps the JSON schema free of path assumptions and lets the public folder structure change without touching the generator
- `resolveJsonModule: true` is a compiler option, not a Vite plugin — Vite handles JSON natively, but TypeScript's type checker also needs it for `.json` imports to resolve correctly in `moduleResolution: bundler` mode
- Phase 3 (CI integration) is next: add generator as a pre-build step in `deploy.yml` and expand the frontend path trigger to cover `knowledge-base/videos/**` and `tools/**`
