# Runbook — Publishing a New Blog Post

> **Pipeline:** Build-time static generation. MD files are the source of truth.
> `tools/gen-blogs.py` parses frontmatter and generates `frontend/src/data/blogs.json`,
> which Vite bundles into the site. The same MD file feeds the Bedrock chatbot KB.
> No code edits required to publish.

---

## 1. Before you start — have these ready

- Blog post title
- Description (1–2 sentence blurb for the card)
- Publish date (the date the post goes live on the external platform)
- Thumbnail image (PNG, 1280×720)
- Post URL (full `https://...` link to the published post — Medium, Substack, etc.)

---

## 2. Steps to publish

1. Create a feature branch: `git checkout -b feat/blog-<postId>`
2. Add the thumbnail: `frontend/public/thumbnails/blog/<postId>.png`
3. Add the MD file: `knowledge-base/blogs/<postId>.md` (see §3 for format)
4. Run the generator locally to validate before opening a PR (see §5)
5. Ask Claude to open a PR → merge to `main`
6. CI generates the blog catalog, builds the site, and syncs the chatbot KB — done

One branch. Two files. No code edits. No TypeScript to touch.

---

## 3. The MD file — format and content

### 3.1 Template

```markdown
---
postId:      b_my-first-post
title:       "My First Post — Getting Started with AI"
description: "A beginner's guide to picking your first AI tool and getting real results from it."
publishDate: 2026-05-16
thumbnail:   b_my-first-post.png
postUrl:     https://medium.com/@yourusername/my-first-post
---

Read this post at https://medium.com/@yourusername/my-first-post.

## Summary

A beginner's guide to picking your first AI tool and getting real results from it.
This post covers the three most accessible AI tools for everyday people, how to
choose the right one for your goals, and the one prompting mistake beginners always make.

## What this post covers

- How to choose between ChatGPT, Claude, and Gemini as a beginner
- The prompting mistake that makes AI responses feel useless
- Three real-world tasks you can hand off to AI today

## Tools and concepts mentioned

- ChatGPT
- Claude
- Gemini
- Prompt engineering
- AI for productivity
```

### 3.2 Frontmatter fields

All fields are required. The CI script fails the build on any missing or malformed field.

| Field         | Type   | Constraints |
|---------------|--------|-------------|
| `postId`      | string | Lowercase, hyphenated, prefixed `b_`. Must match the filename without `.md`. Stable forever — it becomes the React `key` and the thumbnail filename. Example: `b_my-first-post` |
| `title`       | string | Plain text. Quote if it contains `:` followed by a space. |
| `description` | string | 1–2 sentence marketing blurb for the card. Plain text. |
| `publishDate` | string | ISO date `YYYY-MM-DD`. |
| `thumbnail`   | string | Filename only (no path). Must equal `<postId>.png` and exist at `frontend/public/thumbnails/blog/`. |
| `postUrl`     | string | Must match `^https?://`. Full URL to the published post. |

**YAML quoting:** wrap any value containing `: ` (colon-space), `#`, or leading special characters in double quotes. When in doubt, quote it — harmless if unnecessary.

### 3.3 The prose body

Everything below the closing `---` is used only by the Bedrock chatbot KB — not by the frontend. The richer the prose, the better the chatbot answers. Include:

1. A one-line URL restatement at the top (`Read this post at <url>`) — Bedrock embeds the body text, not the frontmatter, so restating the URL makes it retrievable.
2. `## Summary` — a fuller version of the description with searchable keywords.
3. `## What this post covers` — bulleted topics (strong retrieval signals).
4. `## Tools and concepts mentioned` — named tools and concepts (best for "do you have a post about X?" queries).

---

## 4. Thumbnail spec

PNG, 16:9, 1280×720 px. Filename must be `<postId>.png`.

- Prod URL: `https://aieverydaytutor.com/thumbnails/blog/<postId>.png`
- Local dev URL: `http://localhost:5173/thumbnails/blog/<postId>.png` (Vite serves `public/` at root)

---

## 5. Local validation before opening a PR

Run the generator from the repo root to catch frontmatter errors before CI does:

```bash
pip install -r tools/requirements.txt

python tools/gen-blogs.py \
  --knowledge-base-dir knowledge-base/blogs \
  --thumbnails-dir frontend/public/thumbnails/blog \
  --output frontend/src/data/blogs.json
```

The script exits non-zero and names the file + field if anything is invalid. Fix the error and re-run before pushing.

**Dry run (validation only, no file written):**

```bash
python tools/gen-blogs.py --dry-run \
  --knowledge-base-dir knowledge-base/blogs \
  --thumbnails-dir frontend/public/thumbnails/blog \
  --output frontend/src/data/blogs.json
```

---

## 6. What CI does automatically after merge

### Frontend job

Triggered by changes under `frontend/**`, `knowledge-base/blogs/**`, or `tools/**`.

```
1. tools/gen-blogs.py
   → reads all knowledge-base/blogs/*.md
   → validates frontmatter
   → writes frontend/src/data/blogs.json (sorted by publishDate DESC, postId ASC tiebreak)
   → fails the build on any validation error

2. pnpm build
   → Vite bundles blogs.json into the static site

3. aws s3 sync ./dist → site S3 bucket
4. aws cloudfront create-invalidation /*
```

### Knowledge-base job

Triggered by any change under `knowledge-base/**`.

```
1. aws s3 sync knowledge-base/ → KB source S3 bucket
2. aws bedrock-agent start-ingestion-job → chatbot KB updated
```

---

## 7. Error modes

| Symptom | Likely cause | Fix |
|---|---|---|
| CI fails at "Generate blogs.json" step | Malformed frontmatter | Read the CI log — script names the file and field. Fix in branch and re-push. |
| Card appears with broken image | Thumbnail not committed, or CloudFront cache | Confirm `frontend/public/thumbnails/blog/<postId>.png` is in the PR. |
| Chatbot doesn't know about the post | Bedrock ingestion not complete | Wait 1–2 min after the knowledge-base CI job finishes. Check ingestion status in AWS Console → Bedrock → Knowledge bases. |
| Blog page shows "No posts yet" after deploy | `blogs.json` not generated or empty | Confirm the "Generate blogs.json" step ran and succeeded in the frontend CI job. |
| `postId` validation error | `postId` in frontmatter doesn't match the filename stem | Rename one to match the other. They must be identical. |

---

## 8. Summary

> **For each new blog post, after publishing externally:**
> 1. `git checkout -b feat/blog-<postId>`
> 2. Add `frontend/public/thumbnails/blog/<postId>.png`
> 3. Add `knowledge-base/blogs/<postId>.md` with frontmatter + prose
> 4. Validate locally with `tools/gen-blogs.py --dry-run`
> 5. Ask Claude to open a PR → merge
> 6. CI generates `blogs.json`, builds, deploys, syncs the KB
> 7. Verify the card renders and the chatbot answers
>
> One branch. Two files. No code edits.
