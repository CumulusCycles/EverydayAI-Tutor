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

## Commits

- Keep commits small and focused — one logical change per commit
- Write clear, descriptive commit messages in imperative mood:
  - ✅ `add hero section to homepage`
  - ✅ `fix thumbnail crop on video cards`
  - ❌ `changes`
  - ❌ `WIP`

## Pull Requests

- Open a PR for every feature branch before merging to `main`
- PR title should match the branch description
- Summarize what changed, why, and how it was verified
- Do not merge your own PRs — wait for review

## GitHub Access

Claude Code uses a Fine-Grained PAT stored in `.env` as `GITHUB_TOKEN`.
This token has permissions to create branches, push, and open PRs.
Never expose or commit this token.
