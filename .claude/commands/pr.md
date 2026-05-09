---
name: pr
description: Create a pull request for the current feature branch
---

Create a pull request for the current branch following these steps:

1. Run `git status` to confirm all changes are committed
2. Run `git push` to ensure the branch is pushed to remote
3. Create a PR using the GitHub CLI:
```bash
   gh pr create --base main --title "<title>" --body "<body>"
```
   Body should include:
   - **What changed** — summary of the changes made
   - **Why** — reason for the change
   - **How to verify** — steps to confirm it works correctly
   - **Notes** — any gotchas, follow-up items, or decisions made
4. Set base branch to `main`
5. Report the PR URL when done

Follow the branch naming and PR conventions in `.claude/rules/workflow.md`.
Never merge the PR — leave it open for review.
