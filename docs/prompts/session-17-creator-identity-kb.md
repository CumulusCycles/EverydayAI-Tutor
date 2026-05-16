# Session 17 — Fix Chatbot Hallucination: Creator Identity KB Content

**Branch:** `knowledge-base/creator-identity-details`
**PR:** #50
**Date:** 2026-05-16

---

## Problem

The chatbot was hallucinating "Matthew Berman" as the creator of the site instead of Rob Frenette. This was a Bedrock Knowledge Base retrieval issue — none of the existing KB files had strong, unambiguous creator attribution that the RAG system could reliably retrieve.

---

## Prompts Used

**Prompt 1 (problem report):**
> The chatbot said "Matthew Berman" created the site. Update KB files and create a details.md to fix this.

---

## What Was Built

### 1. `knowledge-base/website/site-overview.md` — updated
Added one sentence at the start of the file explicitly naming Rob Frenette as creator and Claude Code as the builder. The existing file had no creator attribution at all, which was the primary gap the retrieval system was hitting.

### 2. `knowledge-base/website/details.md` — new file
Created a comprehensive creator identity document designed for high retrieval precision. Key design decisions:
- Phrased the creator attribution multiple ways ("who created", "who made", "who is behind", "who built") to match common chatbot query patterns
- Explicit disambiguation: Rob Frenette = human creator and director; Claude Code = AI tool that built the code
- Rob's background, links, and professional context
- Quick-reference table at the bottom covering the most common factual questions
- Content structure, site purpose, and tech stack summary for broader chatbot context

---

## Implementation Notes

- No code changes — this is a knowledge-base-only PR
- CI syncs `knowledge-base/**` to Bedrock S3 on push to main via the KB sync job in `deploy.yml`
- After merge, the Bedrock ingestion job will pick up both files and rebuild the vector index
- No need to restart the Lambda or redeploy CDK — KB content is retrieved at query time

---

## How to Verify

1. Merge PR #50 to main
2. Wait for the KB sync GitHub Actions job to complete (ingests new/updated MD files into Bedrock)
3. Ask the chatbot: "Who created this site?" or "Who built aieverydaytutor.com?"
4. Expected answer: Rob Frenette (with Claude Code mentioned as the build tool)
