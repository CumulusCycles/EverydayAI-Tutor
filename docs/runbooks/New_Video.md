# Publishing Runbook — Videos and Playlists

> **Approach:** Build-time static generation. MD files are the source of truth. A CI script
> parses frontmatter and generates a static JSON file that Vite bundles into the site.
> No DynamoDB, no new Lambda, no new CDK stack, no runtime API.
>
> Videos and playlists share the same pipeline and JSON schema. The `type` field
> distinguishes them. Video IDs use the `v_` prefix; playlist IDs use the `p_` prefix.

---

## 1. Publishing a video or playlist

### Video

After publishing on YouTube:
1. Create a feature branch: `git checkout -b feat/video-<videoId>`
2. Add the thumbnail: `frontend/public/thumbnails/video/<videoId>.png`
3. Add the MD file: `knowledge-base/videos/<videoId>.md` with `type: video` (or omit — defaults to video)
4. Open a PR with `/ship` → merge to `main`

### Playlist

After creating the playlist on YouTube:
1. Create a feature branch: `git checkout -b feat/playlist-<playlistId>`
2. Add the thumbnail: `frontend/public/thumbnails/video/<playlistId>.png`
3. Add the MD file: `knowledge-base/videos/<playlistId>.md` with `type: playlist`
4. Open a PR with `/ship` → merge to `main`

One branch. Two files. No code edits. No TypeScript to touch.

---

## 2. Architecture

```
knowledge-base/videos/<videoId>.md   frontend/public/thumbnails/video/<videoId>.png
           │                                          │
           └─────────────────┬────────────────────────┘
                             │ merged to main → CI runs
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
       knowledge-base job           frontend job
       (unchanged)                       │
                 │                  ├── tools/gen-videos.py
  aws s3 sync →  │                  │   reads knowledge-base/videos/*.md
  KB S3 bucket   │                  │   writes frontend/src/data/videos.json
                 │                  │
  bedrock start- │                  ├── pnpm build
  ingestion-job →│                  │   (videos.json bundled into site)
  chatbot KB     │                  │
  updated        │                  ├── aws s3 sync → site S3
                 │                  └── CloudFront invalidation
```

**Key difference from v1:** `GET /videos` at runtime is replaced by a static `videos.json`
bundled into the Vite build. No API call at page load. No new AWS resources.

---

## 3. The MD file — format and content

### 3.1 Template

**Video:**
```markdown
---
videoId:     v_what_ai_actually_is
title:       "What AI Actually Is — Explained for Beginners"
description: "Traditional AI, Generative AI, and Agentic AI — explained simply, without the tech jargon."
publishDate: 2026-05-15
thumbnail:   v_what_ai_actually_is.png
youtubeUrl:  https://www.youtube.com/watch?v=AbC123XyZ
type:        video
---
```

**Playlist:**
```markdown
---
videoId:     p_beginner_series
title:       "Beginner AI Series"
description: "Start here — everything you need to go from curious to confident with AI."
publishDate: 2026-05-15
thumbnail:   p_beginner_series.png
youtubeUrl:  https://www.youtube.com/playlist?list=PLAbC123XyZ
type:        playlist
---

Watch this video at https://www.youtube.com/watch?v=AbC123XyZ.

## Summary

Traditional AI, Generative AI, and Agentic AI — explained simply, without the tech
jargon. This video walks through the three main categories of AI, how they differ,
and which ones everyday people encounter in their daily lives.

## What this video covers

- The difference between Traditional AI, Generative AI, and Agentic AI
- Real-world examples of each type
- Why the distinction matters for everyday users
- What to expect from each kind of tool

## Tools and concepts mentioned

- ChatGPT
- Claude
- Generative AI
- Agentic AI
- Large Language Models
```

### 3.2 Frontmatter fields

All fields are required. The CI script fails the build on any missing or malformed field.

| Field         | Type   | Constraints                                                                                          |
|---------------|--------|------------------------------------------------------------------------------------------------------|
| `videoId`     | string | Lowercase snake_case. **Videos:** `v_` prefix. **Playlists:** `p_` prefix. Must match filename. Stable forever — used as React `key` and thumbnail filename. |
| `title`       | string | Plain text. Quote if it contains `:` followed by a space.                                           |
| `description` | string | 1–2 sentence marketing blurb. Plain text.                                                            |
| `publishDate` | string | ISO date `YYYY-MM-DD`.                                                                               |
| `thumbnail`   | string | Filename only (no path). Must equal `<videoId>.png` and exist at `frontend/public/thumbnails/video/`. |
| `youtubeUrl`  | string | **Videos:** `https://www.youtube.com/watch?v=<11-char-id>`. **Playlists:** `https://www.youtube.com/playlist?list=<id>`. No short URLs. |
| `type`        | string | `video` or `playlist`. Optional — defaults to `video` if omitted.                                   |

**YAML quoting:** wrap any value containing `: ` (colon-space), `#`, or leading special
characters in double quotes. When in doubt, quote it — harmless if unnecessary.

### 3.3 The prose body

Everything below the closing `---` is used only by the Bedrock KB — not by the frontend.
The richer the prose, the better the chatbot answers. Include:

1. A one-line URL restatement at the top (`Watch this video at <url>`) — Bedrock embeds
   the body text, not the frontmatter, so restating the URL makes it retrievable.
2. `## Summary` — a fuller version of the description with searchable keywords.
3. `## What this video covers` — bulleted topics (strong retrieval signals).
4. `## Tools and concepts mentioned` — named tools and concepts (best for "do you have a video about X?" queries).

---

## 4. Thumbnail spec

PNG, 16:9, 1280 × 720 px (YouTube native). Filename `<videoId>.png`.

- Prod URL: `https://aieverydaytutor.com/thumbnails/video/<videoId>.png`
- Local dev URL: `http://localhost:5173/thumbnails/video/<videoId>.png` (Vite serves `public/` at root)

---

## 5. What CI does automatically after merge

### 5.1 Frontend job (extended)

Triggered by changes under `frontend/` or `knowledge-base/videos/` (path filter update
required — see §7.2).

```
1. tools/gen-videos.py
   → reads all knowledge-base/videos/*.md
   → validates frontmatter
   → writes frontend/src/data/videos.json (sorted by publishDate DESC, videoId ASC tiebreak)
   → fails the build on any validation error

2. pnpm build
   → Vite bundles videos.json into the static site

3. aws s3 sync ./dist → site S3 bucket
4. aws cloudfront create-invalidation /*
```

### 5.2 Knowledge-base job (unchanged)

Triggered by changes under `knowledge-base/`.

```
1. aws s3 sync knowledge-base/ → KB source S3 bucket
2. aws bedrock-agent start-ingestion-job → chatbot KB updated
```

No new steps needed here — the chatbot sync already works.

---

## 6. Implementation

### Phase 1 — Generator script

**Goal:** `tools/gen-videos.py` produces a valid `videos.json` from MD files.

1. Create `tools/gen-videos.py`:
   - Walk all `knowledge-base/videos/*.md`
   - Parse YAML frontmatter with `python-frontmatter`
   - Validate each field per §3.2; exit non-zero with a clear error message (filename + field) on any violation
   - Validate that `frontend/public/thumbnails/video/<thumbnail>` exists
   - Sort valid rows by `publishDate` DESC, `videoId` ASC as tiebreak
   - Write the sorted array to `frontend/src/data/videos.json`
   - If `knowledge-base/videos/` has no `*.md` files, write `[]` and exit 0
   - Support `--dry-run` flag: validate and print intended output without writing the file

2. Create `tools/requirements.txt`:
   ```
   python-frontmatter==1.1.0
   PyYAML>=6.0
   ```

3. Tests — `tools/tests/test_gen_videos.py` (pytest + tmp_path fixtures, no AWS needed):
   - Valid single MD → correct `videos.json` content and sort order
   - Three MDs with different dates → sorted correctly
   - Two MDs with same `publishDate` → sorted by `videoId` ASC as tiebreak
   - Missing required frontmatter field → non-zero exit, stderr names file and field
   - `youtubeUrl` fails regex → non-zero exit
   - Thumbnail file missing → non-zero exit
   - Empty `knowledge-base/videos/` → writes `[]`, exits 0
   - `--dry-run` → prints output, does not write file

### Phase 2 — Frontend wiring

**Goal:** pages render cards from `videos.json` instead of the hardcoded `videos.ts`.

1. Update `frontend/src/types/content.ts` — replace the `Video` interface with the
   shape that matches `videos.json` exactly:

   ```typescript
   export interface Video {
     videoId:     string
     title:       string
     description: string
     publishDate: string   // ISO YYYY-MM-DD
     thumbnail:   string   // filename only, e.g. "v_what_ai_actually_is.png"
     youtubeUrl:  string
   }
   ```

2. Delete `frontend/src/data/videos.ts` (replaced by generated `videos.json`).

3. Delete `frontend/public/thumbnail.png` (placeholder image, orphaned once `videos.ts` is gone).

4. Add `frontend/src/data/videos.json` to `.gitignore` — it is generated by CI and
   locally by running `gen-videos.py`; it should not be committed.

5. Update `frontend/src/pages/HomePage.tsx` and `frontend/src/pages/VideosPage.tsx`:
   - Replace `import { videos } from '../data/videos'` with
     `import videos from '../data/videos.json'`
   - Map `Video` → `ContentCard` props, constructing `thumbnailUrl` in the parent:
     ```tsx
     thumbnailUrl={`/thumbnails/video/${v.thumbnail}`}
     ```
   - When `videos.json` contains `[]`, pages render the existing "Coming Soon" empty
     state — preserve that markup.
   - No loading state needed (static import, synchronous).

6. No changes to `ContentCard.tsx` — its prop API is unchanged.

7. Tests — update `frontend/src/pages/*.test.tsx` to import from `videos.json`
   (mock the JSON module in Vitest) and confirm cards render with the new field names.

### Phase 3 — CI integration

**Goal:** committing two files to `main` triggers the generator and deploys the updated site.

1. Update `.github/workflows/deploy.yml`:

   a. **Path filters** — the frontend job must also trigger when `knowledge-base/videos/**`
      changes (a new MD file must rebuild the site). Add `knowledge-base/videos/**` to
      the frontend job's path filter, or extend the `changes` job output so `knowledge-base/videos/**`
      triggers the frontend job.

   b. **Pre-build step** — in the frontend job, before `pnpm build`, add:
      ```yaml
      - name: Generate videos.json
        run: |
          pip install -r tools/requirements.txt
          python tools/gen-videos.py \
            --knowledge-base-dir knowledge-base/videos \
            --thumbnails-dir frontend/public/thumbnails/video \
            --output frontend/src/data/videos.json
      ```

   c. **`tools/**` path filter** — a commit that only changes `gen-videos.py` must also
      trigger the frontend job (the generator runs there). Add `tools/**` to the frontend
      job's path filter.

2. No new GitHub secrets required. No new CDK stacks. No new IAM changes.

---

## 7. What does NOT change

- `ChatbotStack` — untouched
- `stack.ts` — untouched
- Bedrock KB sync workflow — untouched
- `ContentCard.tsx` — untouched
- No new AWS resources of any kind

---

## 8. Local development

### Running the generator locally

```bash
# from repo root
pip install -r tools/requirements.txt

python tools/gen-videos.py \
  --knowledge-base-dir knowledge-base/videos \
  --thumbnails-dir frontend/public/thumbnails/video \
  --output frontend/src/data/videos.json

# then run the dev server as normal
cd frontend && pnpm dev
```

Run this once after cloning, or after adding/editing an MD file locally, to regenerate
`videos.json` before the dev server picks it up.

### Dry run (validation only)

```bash
python tools/gen-videos.py --dry-run \
  --knowledge-base-dir knowledge-base/videos \
  --thumbnails-dir frontend/public/thumbnails/video \
  --output frontend/src/data/videos.json
```

Useful for catching frontmatter mistakes before opening a PR.

---

## 9. Acceptance criteria

After the implementation is complete, publishing the first real video must work end-to-end:

1. **Card renders** — visit `/videos` and `/`; the new card appears with the correct title,
   description, date, thumbnail, and "Watch on YouTube →" link.
2. **Thumbnail loads** — `curl -I https://aieverydaytutor.com/thumbnails/video/<videoId>.png`
   returns HTTP 200.
3. **YouTube link works** — clicking the card opens the correct URL in a new tab.
4. **Chatbot answers** — ask the chat widget about a topic from the video; it responds with
   a relevant summary including the YouTube URL.
5. **Empty state preserved** — with no MD files committed, the site renders the "Coming Soon"
   state on both pages.
6. **CI validation catches bad input** — commit an MD file with a missing field or malformed
   `youtubeUrl`; the CI job must fail with a clear error message before `pnpm build` runs.

---

## 10. Error modes

| Symptom | Likely cause | Fix |
|---|---|---|
| CI fails at "Generate videos.json" step | Malformed frontmatter | Read the CI log — script names the file and field. Fix in branch and re-push. |
| Card appears with broken image | Thumbnail not committed, or CloudFront cache | Confirm `frontend/public/thumbnails/video/<videoId>.png` is in the PR. If deployed but missing, run a manual CloudFront invalidation. |
| Chatbot doesn't know about the video | Bedrock ingestion not complete yet | Wait 1–2 min after the knowledge-base CI job finishes. Check ingestion status in AWS Console → Bedrock → Knowledge bases. |
| Videos page shows "Coming Soon" after deploy | `videos.json` not generated or not picked up by Vite | Confirm the "Generate videos.json" step ran and succeeded in the frontend CI job. Check that `videos.json` is not committed (it should be gitignored and generated fresh each build). |

---

## 11. Summary

> **For each new video, after publishing to YouTube:**
> 1. `git checkout -b feat/video-<videoId>`
> 2. Add `frontend/public/thumbnails/video/<videoId>.png`
> 3. Add `knowledge-base/videos/<videoId>.md` with frontmatter + prose
> 4. `/ship` → merge
> 5. CI generates `videos.json`, builds, deploys, syncs the KB
> 6. Verify the card renders and the chatbot answers
>
> One branch. Two files. No code edits.
