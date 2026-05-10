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

Done. Both issues fixed in .github/workflows/deploy.yml:

  1. pnpm cache path — both cache-dependency-path entries now point to pnpm-lock.yaml at the repo root (where the single monorepo lockfile actually lives).
  2. Action versions — all three updated to Node.js 24-compatible v6 releases, verified against the live GitHub tags pages:
    - actions/checkout@v4 → @v6.0.2 (Jan 2026)
    - actions/setup-node@v4 → @v6.4.0 (Apr 2026)
    - pnpm/action-setup@v4 → @v6.0.6 (May 2026)

---
