---
name: ship
description: Lint, build, commit, push, and open a PR in one shot using the git-agent
---

Invoke the git-agent to ship the current branch:

1. Run lint and build checks
2. Stage all changes
3. Analyze the diff and generate a meaningful commit message
4. Commit, push, and open a PR for review
5. Report the PR URL

Use the git-agent defined in `.claude/agents/git-agent.md` for all git and GitHub operations.
Follow commit and PR conventions in `.claude/rules/workflow.md`.
Never commit directly to main. Never merge the PR.
