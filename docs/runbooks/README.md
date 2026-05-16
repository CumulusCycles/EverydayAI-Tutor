# Runbooks

Operational guides for common publishing tasks. These are the day-to-day instructions for adding content to the site — no code changes required.

---

| Runbook | When to use |
|---|---|
| [`New_Video.md`](New_Video.md) | After publishing a new video to YouTube — add it to the site and chatbot KB |
| [`New_Blog.md`](New_Blog.md) | After publishing a new blog post externally — add it to the site and chatbot KB |

---

## How the pipeline works

Both pipelines follow the same pattern:

1. Commit an MD file to `knowledge-base/` (frontmatter → site card; prose → chatbot)
2. Commit a thumbnail PNG to `frontend/public/thumbnails/<type>/`
3. Open a PR → merge to `main`
4. CI automatically: generates JSON → builds site → syncs S3 → invalidates CloudFront → syncs KB → triggers Bedrock ingestion

One branch. Two files. No code edits.
