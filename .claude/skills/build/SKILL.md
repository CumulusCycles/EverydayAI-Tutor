---
name: build
description: Run a production build and report any errors
---

Run a production build of the frontend:

1. Navigate to the `frontend/` directory
2. Run the build:
   ```bash
   pnpm build
   ```
3. Report results:
   - Confirm build succeeded with output size summary
   - List any TypeScript errors with file and line number
   - List any build warnings worth addressing
   - Confirm the `/dist` output is clean

A successful build is required before opening any PR.
Fix all TypeScript errors before declaring done.
Follow frontend conventions in `.claude/rules/frontend.md`.
