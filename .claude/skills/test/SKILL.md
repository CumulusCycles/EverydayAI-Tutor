---
name: test
description: Run the full test suite — unit tests and E2E tests
---

Run the full test suite for the project:

1. Navigate to the `frontend/` directory
2. Run unit and component tests:
   ```bash
   pnpm test
   ```
3. Run E2E tests with Playwright:
   ```bash
   pnpm exec playwright test
   ```
4. Report results:
   - Number of tests passed / failed
   - Any failures with file name, test name, and error message
   - Whether the suite is clean and ready for PR

If any tests fail, do not open a PR until they are fixed.
Follow testing conventions in `.claude/rules/testing.md`.
