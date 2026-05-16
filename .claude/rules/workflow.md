# Workflow Rules

## Branching

- Never commit directly to `main`
- Always create a feature branch for every change
- Push the branch and open a PR for review before merging

## Branch Naming Convention

```
type/short-description
```

| Type | When to Use |
|---|---|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `setup/` | Project setup, configuration, tooling |
| `docs/` | Documentation changes only |
| `refactor/` | Code restructuring, no behavior change |
| `style/` | UI/CSS changes only |
| `test/` | Adding or updating tests only |
| `infra/` | AWS CDK / infrastructure changes |

### Examples
```
feature/homepage-hero
fix/card-thumbnail-crop
setup/claude-md
docs/update-site-structure
infra/cloudfront-distribution
```

## Keeping Claude Config Current

Before shipping any branch that touches project architecture, stack, tooling, or new features:

- Review `CLAUDE.md` and all files under `.claude/` for stale content
- Update repo structure trees, routing tables, env var names, model IDs, and scope descriptions to match reality
- This applies to: new routes, new Lambda functions, new stacks, new secrets, dependency changes, and tooling changes

## Keeping Memory Current

Before every ship, update project memory at `/Users/rob/.claude/projects/-Users-rob-Development-EverydayAI-Tutor/memory/`:

- Update `project_scaffold.md` — add merged PRs, update current state sections, refresh "What's next"
- Update `MEMORY.md` index entry to reflect the new PR count and state summary

## Shipping Work

Use the `/ship` command to lint, build, commit, push, and open a PR in one shot:

```
/ship
```

After your PR is reviewed and merged, use `/done` to clean up:

```
/done
```

The git-agent (`.claude/agents/git-agent.md`) handles all git and GitHub operations for both commands.
