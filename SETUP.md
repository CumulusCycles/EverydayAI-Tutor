# EverydayAI Tutor — Setup Guide

This guide covers everything needed to get the project running locally from scratch.

---

## Prerequisites

Ensure the following are installed on your machine before proceeding.

| Tool | Version | Install |
|---|---|---|
| Node.js | v25.2.1 | [nodejs.org](https://nodejs.org) or via Homebrew: `brew install node` |
| npm | v11.14.1 | Included with Node |
| pnpm | v11.0.9 | `npm install -g pnpm` |
| uv | 0.9.17+ | `brew install uv` |
| Git | Latest | `brew install git` |
| GitHub CLI | v2.92.0+ | `brew install gh` |
| AWS CLI | Latest | [aws.amazon.com/cli](https://aws.amazon.com/cli) |
| AWS CDK | Latest | `npm install -g aws-cdk` |
| Claude Code | Latest | `npm install -g @anthropic-ai/claude-code` |

### Verify installations
```bash
node --version
npm --version
pnpm --version
uv --version
git --version
gh --version
aws --version
cdk --version
claude --version
```

---

## AWS Setup

### AWS Account
- An AWS account is required
- All infrastructure deploys to `us-east-1`

### AWS CLI Configuration (Local Development Only)
For local development, configure the AWS CLI with a scoped IAM user — not your root account.

**Create a local dev IAM user:**
1. Go to AWS Console → IAM → Users → Create User
2. Name it something like `everydayai-tutor-local-dev`
3. Go to IAM → Policies → Create Policy
4. Switch to JSON editor and paste the contents of `docs/tech/iam-policy-local-dev.json`
5. Name the policy `EverydayAITutorLocalDevPolicy`
6. Attach the policy to your IAM user
7. Go to the user → Security Credentials → Create Access Key
8. Select **Local code** as the use case
9. Copy the Access Key ID and Secret Access Key

```bash
aws configure
```
Enter your Access Key ID, Secret Access Key, and default region (`us-east-1`).

Verify:
```bash
aws sts get-caller-identity
```

### CDK Bootstrap
CDK must be bootstrapped in `us-east-1` before the first deploy. This is a one-time operation per AWS account/region:

```bash
cdk bootstrap aws://ACCOUNT_ID/us-east-1
```

### GitHub Actions — OIDC Authentication (No Credentials Required)
This project uses **OpenID Connect (OIDC)** for GitHub Actions to authenticate with AWS. No AWS Access Keys or Secrets are stored in GitHub — ever.

OIDC is configured directly in the CDK stack (`infrastructure/lib/stack.ts`). On first CDK deploy, it creates:
- An IAM OIDC Identity Provider for GitHub Actions
- An IAM Role (`GitHubActionsDeployRole`) that GitHub Actions assumes per-run
- A trust policy scoped to only this repository and `main` branch

The GitHub Actions role policy is documented in `docs/tech/iam-policy.json`.

After the first CDK deploy, add these two secrets to GitHub:

Go to repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|---|---|
| `AWS_ROLE_ARN` | ARN of `GitHubActionsDeployRole` — available after first CDK deploy |
| `AWS_REGION` | `us-east-1` |

⚠️ Never store `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` in GitHub secrets — use OIDC instead.

---

## GitHub Setup

### Fine-Grained Personal Access Token (PAT)
Claude Code requires a Fine-Grained PAT to create branches, push, and open PRs.

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
2. Click **Generate new token**
3. Set **Repository access** to only `EverydayAI-Tutor`
4. Set the following **Permissions:**
   - `Contents` — Read and Write
   - `Pull requests` — Read and Write
   - `Workflows` — Read and Write
   - `Commit statuses` — Read
   - `Metadata` — Read (auto-selected)
5. Generate and copy the token

### GitHub CLI Authentication
```bash
gh auth login
gh auth status
```

---

## Repository Setup

### Clone the repo
```bash
git clone https://github.com/CumulusCycles/EverydayAI-Tutor.git
cd EverydayAI-Tutor
```

### Create your .env file
```bash
cp .env.example .env
```

Open `.env` and add your values:
```
GITHUB_TOKEN=your_fine_grained_pat_here
```

⚠️ Never commit `.env` — it is gitignored.

---

## Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

The site will be available at `http://localhost:5173`.

---

## Infrastructure Setup

```bash
cd infrastructure
pnpm install
cdk diff
```

---

## Claude Code Setup

Claude Code is configured via `.claude/` at the repo root:

| Location | Purpose |
|---|---|
| `CLAUDE.md` | Project-level guidance for Claude Code |
| `.claude/rules/` | Detailed rules — frontend, infrastructure, workflow, testing, project |
| `.claude/commands/` | Slash commands — `/pr`, `/commit`, `/test`, `/lint`, `/build` |
| `.claude/settings.json` | MCP server configuration (Context7 + AWS IaC) |

### Launch Claude Code
```bash
claude
```

---

## Branch Workflow

Never commit directly to `main`. Always:

```bash
git checkout -b feature/your-feature-name
# make changes
/commit
/pr
```

See `.claude/rules/workflow.md` for full branching conventions.
