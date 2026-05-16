---
name: ship
description: Lint, build, commit, push, and open a PR in one shot using the git-agent
---

Invoke the git-agent to ship the current branch:

1. Check whether `CLAUDE.md` or any `.claude/` files need updating based on what changed (new routes, new stacks, new env vars, model changes, tooling changes) — update them before committing if so
2. Update project memory at `/Users/rob/.claude/projects/-Users-rob-Development-EverydayAI-Tutor/memory/` — update `project_scaffold.md` with new PRs, state changes, and "What's next"; update `MEMORY.md` index entry
3. Run lint and build checks
4. Stage all changes
5. Analyze the diff and generate a meaningful commit message
6. Commit, push, and open a PR for review
7. Report the PR URL

Use the git-agent defined in `.claude/agents/git-agent.md` for all git and GitHub operations.
Follow commit and PR conventions in `.claude/rules/workflow.md`.
Never commit directly to main. Never merge the PR.
