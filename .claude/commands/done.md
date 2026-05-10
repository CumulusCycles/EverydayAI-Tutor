---
name: done
description: After a PR is merged — checkout main, pull, and delete the local feature branch
---

The PR has been merged. Invoke the git-agent to clean up:

1. Store the current branch name
2. Checkout main
3. Pull latest from remote
4. Delete the local feature branch
5. Confirm clean state and report

Use the git-agent defined in `.claude/agents/git-agent.md` for all git operations.
