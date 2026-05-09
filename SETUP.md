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
- CDK must be bootstrapped in `us-east-1`:
  ```bash
  cdk bootstrap aws://ACCOUNT_ID/us-east-1
  ```

### AWS CLI Configuration
```bash
aws configure
```
Enter your AWS Access Key ID, Secret Access Key, and default region (`us-east-1`).

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
| `.claude/settings.json` | MCP server configuration (Context7) |

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
