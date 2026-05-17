# Runbooks

Operational guides for common publishing tasks. These are the day-to-day instructions for adding content to the site — no code changes required.

---

| Runbook | When to use |
|---|---|
| [`New_Video.md`](New_Video.md) | After publishing a new video or playlist — add it to the site and chatbot KB |

---

## How the pipeline works

Videos and playlists share the same pipeline:

1. Commit an MD file to `knowledge-base/videos/` (frontmatter → site card; prose → chatbot)
2. Commit a thumbnail PNG to `frontend/public/thumbnails/video/`
3. Open a PR → merge to `main`
4. CI automatically: generates `videos.json` → builds site → syncs S3 → invalidates CloudFront → syncs KB → triggers Bedrock ingestion

One branch. Two files. No code edits.
