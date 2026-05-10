# EverydayAI Tutor — Tech Stack
# For Development Use

---

## Overview

Static React website hosted on AWS, provisioned with CDK (TypeScript), with CI/CD via GitHub Actions.

---

## Repository Structure

```
/
├── frontend/          # React + Vite + TypeScript application
├── infrastructure/    # AWS CDK TypeScript stack
├── docs/              # Brand, design, and reference documentation
│   ├── images/        # Brand image assets
│   ├── brand.md       # Brand guide
│   └── color-palette.md  # Brand color palette
└── img/               # Favicon and root-level image assets
    └── logo.ico
```

---

## Frontend

| Technology | Choice | Notes |
|---|---|---|
| Framework | React | Static site, no SSR required |
| Build Tool | Vite | Fast builds, outputs to `/dist` |
| Language | TypeScript | Consistent with CDK infrastructure |
| Styling | Tailwind CSS | Utility-first, consistent with modern React patterns |
| Routing | React Router | Client-side routing with clean URLs |
| Package Manager | pnpm | Faster and more efficient than npm/yarn |
| Node Version | v25.2.1 | Homebrew-managed; pinned in GHA workflow to match dev machine |

---

## Testing

| Layer | Library | Notes |
|---|---|---|
| Unit & Component | Vitest + React Testing Library | Vite-native, Jest-compatible API |
| End-to-End / Functional | Playwright | Real browser simulation |

---

## Code Quality

| Tool | Purpose |
|---|---|
| ESLint | Linting |
| Prettier | Code formatting |

---

## Infrastructure (AWS CDK — TypeScript)

| Service | Purpose | Notes |
|---|---|---|
| S3 | Static site hosting | Hosts compiled `/dist` output |
| CloudFront | CDN + HTTPS termination | Custom domain, caching, 403/404 → index.html redirect for React Router |
| ACM | SSL Certificate | Provisioned in `us-east-1` (CloudFront requirement) |
| Route 53 | DNS | Domain already registered via Route 53; hosted zone already exists — use `HostedZone.fromLookup()` |
| SSM Parameter Store | Environment variables | Pattern established for future use; no frontend env vars required at launch |

### Domain & Routing
- `aieverydaytutor.com` — canonical URL, serves the site
- `www.aieverydaytutor.com` — redirects to non-www canonical
- ACM certificate covers both `aieverydaytutor.com` and `www.aieverydaytutor.com` (both as SANs)
- CloudFront configured to redirect 403/404 → `index.html` for React Router client-side routing

### S3 Security
- S3 bucket is **private** — no public access
- CloudFront accesses S3 via **Origin Access Control (OAC)**
- Direct S3 URL access is blocked

### CORS
- CORS policy configured on S3/CloudFront for future API calls

### Cache Invalidation
- GHA invalidates `/*` on every frontend deploy
- Counts as 1 path — first 1,000 invalidation paths per month are free


### IAM & Authentication
- GitHub Actions authenticates with AWS via **OpenID Connect (OIDC)** — no long-lived credentials stored anywhere
- OIDC provider and `GitHubActionsDeployRole` are provisioned in the CDK stack
- GitHub Actions assumes the role per-run via `aws-actions/configure-aws-credentials`
- Role policy is documented in `docs/tech/iam-policy.json` — grants permission to assume CDK bootstrap roles only
- GitHub secrets required: `AWS_ROLE_ARN` and `AWS_REGION` only — never `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY`

### CDK Bootstrap
AWS account is already bootstrapped in `us-east-1` via existing `CDKToolkit` CloudFormation stack.

### Domain
`aieverydaytutor.com` — registered through Route 53. Hosted zone exists, no creation required.

---

## Repository

| | |
|---|---|
| URL | `https://github.com/CumulusCycles/EverydayAI-Tutor` |
| Visibility | Private (will be made public at launch) |
| Structure | Monorepo — frontend, infrastructure, and docs in one repo |

---

## GitHub Access (Claude Code)

Claude Code uses a Fine-Grained Personal Access Token (PAT) to create feature branches, push to remote, and open PRs for review before merging to `main`.

**PAT Permissions:**
- `Contents` — Read and Write
- `Pull requests` — Read and Write
- `Workflows` — Read and Write
- `Commit statuses` — Read
- `Metadata` — Read (auto-selected)

**Local configuration:**
- PAT stored in `.env` at repo root as `GITHUB_TOKEN=your_pat_here`
- `.env` is gitignored — never committed to the repo

---



## CI/CD

| Tool | GitHub Actions |
|---|---|
| Trigger | Push to `main` branch |
| Authentication | OIDC — GitHub Actions assumes `GitHubActionsDeployRole` via `aws-actions/configure-aws-credentials` |
| Frontend job | `pnpm install` → `pnpm build` → sync `/dist` to S3 → CloudFront cache invalidation |
| Infrastructure job | `cdk deploy` (path-filtered — only runs if files in `/infrastructure` changed) |
| Path filtering | Frontend and infrastructure jobs run independently based on changed paths |
| Environments | Production only (no staging environment at launch) |

---

## Environment Variables

- Vite environment variables use the `VITE_` prefix and are baked into the build at compile time
- Sensitive values must never be included in the frontend bundle
- AWS SSM Parameter Store is the established pattern for secrets and configuration — to be used when backend functionality (Lambda, etc.) is added

---

## Future Considerations (Out of Scope at Launch)

The following are intentionally excluded from the initial build but are natural next steps as the site grows:

- User authentication
- Email capture / newsletter integration
- Course or membership content

### Backend & Data Layer
- **DynamoDB** — structured content storage (blog posts, YouTube video titles, descriptions, publish dates, URLs, tags)
- **Lambda functions / API Gateway** — all Lambdas to be written in Python

### Agentic Search
Semantic natural language search across blog posts and YouTube video content.

See `agentic-search-flow.md` for architecture diagram.

**Components:**
- **DynamoDB** — source of truth for all content metadata
- **DynamoDB Streams** — triggers on new/updated content
- **Lambda (Python)** — syncs new/updated content to Bedrock Knowledge Base
- **AWS Bedrock Knowledge Base** — semantic search index (vector embeddings)
- **S3 or OpenSearch Serverless** — vector store
- **Lambda (Python)** — handles search queries, calls Bedrock Knowledge Base, returns results to frontend

---

## Development Machine

| | |
|---|---|
| Hardware | Apple M1 Mac Studio |
| Node | v25.2.1 (Homebrew-managed) |
| npm | v11.14.1 |
| pnpm | v11.0.9 |
