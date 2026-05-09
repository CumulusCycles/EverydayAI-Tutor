---
name: lint
description: Run ESLint and Prettier across the frontend
---

Run code quality checks across the frontend:

1. Navigate to the `frontend/` directory
2. Run ESLint:
   ```bash
   pnpm lint
   ```
3. Run Prettier format check:
   ```bash
   pnpm format
   ```
4. Report results:
   - List any lint errors or warnings with file and line number
   - List any formatting issues
   - Confirm whether the codebase is clean

Fix all errors before declaring done.
Warnings should be addressed unless there is a clear reason to suppress them.
Follow code quality conventions in `.claude/rules/frontend.md`.
