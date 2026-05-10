# Session 06 — Fixes

**Branch:** various
**Date:** May 10, 2026

---

## Goal

Track bug fixes and workflow corrections as they arise during the build.

---

## Fix 01 — GitHub Actions Workflow

**Branch:** `fix/gha-workflow`

### Problem
1. pnpm dependency cache failing — "Some specified paths were not resolved" — pnpm-lock.yaml is at repo root, not in frontend/
2. GitHub Actions running on deprecated Node.js 20 runners — will be forced to Node.js 24 by June 2nd, 2026

### Prompt 1

> Fix two issues in .github/workflows/deploy.yml:
>
> 1. The pnpm dependency cache is failing with "Some specified paths were not resolved". Fix the pnpm cache configuration — the pnpm-lock.yaml is at the repo root, not in frontend/.
>
> 2. Update all GitHub Actions to versions that support Node.js 24 — actions/checkout, actions/setup-node, and pnpm/action-setup are all running on deprecated Node.js 20 runners. Update to the latest versions that support Node.js 24.
>
> Run no tests — this is a workflow-only fix.

### Result


---

## Fix 02 — pnpm esbuild Build Scripts Blocked in CI

**Branch:** `fix/pnpm-esbuild`

### Problem
GitHub Actions frontend deploy failing with `[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@0.25.12`. The GHA pnpm environment is blocking esbuild's build scripts despite `.npmrc` having `allow-build=esbuild` locally.

### Prompt 1

> The GitHub Actions frontend deploy job is failing with [ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@0.25.12. Fix this in the most appropriate way — check .npmrc at the repo root and .github/workflows/deploy.yml and ensure esbuild build scripts are allowed in the CI environment. Do not use pnpm approve-builds interactively.

### Result



---

## Fix 03 — Add workflow_dispatch to deploy.yml

**Branch:** `fix/add-workflow-dispatch`

### Problem
No "Run workflow" button in GitHub Actions UI — deploy.yml is missing `workflow_dispatch` trigger, preventing manual workflow runs.

### Prompt 1

> Add workflow_dispatch trigger to .github/workflows/deploy.yml so the workflow can be manually triggered from the GitHub Actions UI. Keep the existing push trigger. No other changes.

### Result

Done. workflow_dispatch: added — the workflow can now be triggered manually from the GitHub Actions UI in addition to push-to-main. Note that a manual trigger bypasses the
  paths filter, so both jobs will run their changes detection step; if no relevant files changed since the last commit, the frontend and infrastructure jobs will still evaluate
  correctly via the git diff HEAD^ HEAD check.
  
---
