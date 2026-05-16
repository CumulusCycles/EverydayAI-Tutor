# Session 15 — CI Video Pipeline Integration (Phase 3) + Ship/Memory Rules

**Branch:** `feature/ci-video-pipeline`
**PR:** #48
**Date:** May 16, 2026

---

## Goal

Phase 3 of the video publishing pipeline: wire `tools/gen-videos.py` into the GitHub Actions deploy workflow so that committing a new video MD file + thumbnail automatically triggers a frontend rebuild with the updated `videos.json`. Also enforce prompts and memory updates as part of the `/ship` process.

---

## Prompts

### Prompt 1

> ALSO: we need to ensure the prompts/* files are up-to-date! Do we need to add that to a rule?

Identified that sessions 14 and 15 were missing from `docs/prompts/`. Also confirmed that the prompts update step had no enforcement in the workflow — only memory had an explicit "before every ship" rule.

### Prompt 2

> do it

*(In context of: "start Phase 3 and add the memory rule")*

**`deploy.yml` changes:**

1. Top-level `paths:` trigger — added `tools/**` (ensures changes to the generator script itself trigger a deploy)

2. `changes` job, `detect` step — updated frontend grep from:
   ```bash
   grep -q '^frontend/'
   ```
   to:
   ```bash
   grep -qE '^(frontend|knowledge-base/videos|tools)/'
   ```
   So adding/editing a video MD or thumbnail triggers the frontend job (generator re-runs → updated `videos.json` → Vite rebuilds → S3 sync + CloudFront invalidation)

3. `frontend` job — added "Generate videos.json" step before `pnpm build`:
   ```yaml
   - name: Generate videos.json
     run: |
       pip install -r tools/requirements.txt
       python tools/gen-videos.py \
         --knowledge-base-dir knowledge-base/videos \
         --thumbnails-dir frontend/public/thumbnails/video \
         --output frontend/src/data/videos.json
   ```

**`.claude/rules/workflow.md` changes:**

- Added "Keeping Memory Current" section: before every ship, update `project_scaffold.md` and `MEMORY.md` index

**`.claude/skills/ship/SKILL.md` changes:**

- Added step 2: "Update project memory (`project_scaffold.md` + `MEMORY.md`) before committing"
- Steps renumbered accordingly

**`docs/prompts/` changes:**

- Created `session-14-frontend-videos-json.md`
- Created `session-15-ci-video-pipeline.md` (this file)
- Updated `docs/prompts/README.md` sessions table (rows 14–15)
- Added prompts update to `.claude/rules/workflow.md` "Before every ship" section and `.claude/skills/ship/SKILL.md`

### Result

`pnpm lint` and `pnpm build` both pass. PR #48 open. Full video publishing pipeline is now wired end-to-end: commit MD + thumbnail → PR → merge → CI generates JSON, builds, deploys frontend, syncs KB, triggers Bedrock ingestion.

---

## Notes

- The generator runs on the CI runner (no Docker, just `pip install` + `python`) — fast and dependency-light
- `knowledge-base/videos/**` in the frontend grep is intentional even though that path also triggers the `knowledge-base` job — the two jobs are independent and both should fire (KB sync for Bedrock, frontend rebuild for the card catalog)
- Prompts log enforcement: added to both workflow rules and /ship skill so it's checked every time before committing
