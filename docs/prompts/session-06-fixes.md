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

Two files changed:

  pnpm-workspace.yaml — replaced onlyBuiltDependencies (pnpm ≤10 syntax) with allowBuilds (pnpm 11 syntax). The old key was silently ignored by pnpm 11, leaving strictDepBuilds: 
  true (the new default) blocking esbuild's postinstall on every clean CI install.

  .npmrc — removed allow-build=esbuild, which was never a valid pnpm config key.

  The workflow itself (deploy.yml) needed no changes — the install command and flags were correct. The failure was entirely in the config files. pnpm install exits clean locally
  with the new config; CI will now find allowBuilds: esbuild: true, permit the postinstall script, and proceed.

