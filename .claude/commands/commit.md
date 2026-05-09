---
name: commit
description: Lint, build, then commit staged changes with a well-formed commit message
---

Commit the current changes following these steps:

1. Run lint check:
   ```bash
   cd frontend && pnpm lint
   ```
   Fix any errors before proceeding. Do not commit with lint errors.

2. Run production build to catch TypeScript errors:
   ```bash
   pnpm build
   ```
   Fix any errors before proceeding. Do not commit with build errors.

3. Stage all relevant changes:
   ```bash
   git add .
   ```

4. Write a clear, descriptive commit message in imperative mood:
   - ✅ `add hero section to homepage`
   - ✅ `fix thumbnail crop on video cards`
   - ❌ `changes`
   - ❌ `WIP`
   - ❌ `updated stuff`

5. Commit:
   ```bash
   git commit -m "<message>"
   ```

6. Report what was committed and confirm the working tree is clean.

Follow commit conventions in `.claude/rules/workflow.md`.
Never push directly to `main`.
