# EverydayAI Tutor — Tech Stack
# For Development Use

---

## Overview

React site hosted on AWS with an AI chat assistant backed by Amazon Bedrock. Content (videos, blog posts) is authored in Markdown and synced automatically to the site and chatbot via CI — no code edits required to publish.

---

## Repository Structure

```
/
├── frontend/          # React + Vite + TypeScript application
├── infrastructure/    # AWS CDK TypeScript stack (site stack + chatbot stack)
├── chatbot/
│   └── lambda/        # Python Lambda — handler.py, service.py, requirements.txt
├── knowledge-base/    # Markdown synced to Bedrock S3 bucket via CI
│   ├── website/       # General site content (about, FAQ, learning journey, etc.)
│   ├── videos/        # One MD file per video — frontmatter drives cards, prose drives chatbot
│   └── blogs/         # One MD file per blog post — frontmatter drives cards, prose drives chatbot
├── tools/             # CI scripts — gen-videos.py and gen-blogs.py generate static JSON at build time
├── docs/              # Brand, UX, tech docs, Claude Code prompt log
├── .github/workflows/ # CI/CD — frontend, infrastructure, KB sync
└── SETUP.md           # Full local + AWS + GitHub setup
```

---

## Frontend

| Technology | Choice | Notes |
|---|---|---|
| Framework | React | Client-side rendering |
| Build Tool | Vite | Fast builds, outputs to `/dist` |
| Language | TypeScript | Strict mode, no `any` |
| Styling | Tailwind CSS v4 | `@theme` in `index.css` — no `tailwind.config.ts` |
| Routing | React Router | Client-side routing with clean URLs |
| Package Manager | pnpm | Never npm or yarn |
| Node Version | v25.2.1 | Homebrew-managed; pinned in GHA workflow to match dev machine |

---

## Testing

| Layer | Library | Notes |
|---|---|---|
| Unit & Component | Vitest + React Testing Library | Vite-native, Jest-compatible API |
| End-to-End / Functional | Playwright | Real browser simulation; tests in `frontend/e2e/` |
| Generator script | pytest | Tests in `tools/tests/` |

---

## Code Quality

| Tool | Purpose |
|---|---|
| ESLint | Linting |
| Prettier | Code formatting |
| ruff | Python linting (`tools/`) |

---

## Infrastructure (AWS CDK — TypeScript)

Two CDK stacks, both in `infrastructure/lib/`:

### Site Stack (`stack.ts`)

| Service | Purpose |
|---|---|
| S3 | Static site hosting — private bucket, CloudFront OAC |
| CloudFront | CDN + HTTPS + 403/404 → `index.html` redirect for React Router |
| ACM | SSL certificate in `us-east-1` (CloudFront requirement) — covers apex + www |
| Route 53 | DNS — hosted zone already exists, use `HostedZone.fromLookup()` |
| Bedrock Knowledge Base | S3 Vectors store + Titan Embeddings v2 — chatbot semantic search |
| OIDC Provider | GitHub Actions auth — no long-lived AWS credentials |
| GitHubActionsDeployRole | IAM role assumed per CI run via OIDC |

### Chatbot Stack (`chatbot-stack.ts`)

| Service | Purpose |
|---|---|
| API Gateway (HTTP API) | `POST /chat` endpoint — public, CORS-controlled |
| Lambda (Python 3.13) | Thin handler + Bedrock `retrieve_and_generate` service |
| IAM | `bedrock:RetrieveAndGenerate`, `bedrock:InvokeModel`, `bedrock:GetInferenceProfile`, `s3:GetObject` on KB bucket |

### Domain & Routing
- `aieverydaytutor.com` — canonical, serves the site
- `www.aieverydaytutor.com` — redirects to non-www canonical
- CloudFront redirects 403/404 → `index.html` for React Router

### S3 Security
- Site S3 bucket is **private** — CloudFront accesses via Origin Access Control (OAC)
- Direct S3 URL access is blocked

### IAM & Authentication
- GitHub Actions authenticates with AWS via **OIDC** — no long-lived credentials stored anywhere
- OIDC provider and `GitHubActionsDeployRole` provisioned in the CDK site stack
- GitHub secrets required: `AWS_ROLE_ARN`, `AWS_REGION`, `BEDROCK_KB_ID`, `KB_BUCKET_NAME`, `BEDROCK_DS_ID`, `VITE_CHAT_API_URL`
- Never store `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY`

### CDK Bootstrap
AWS account is already bootstrapped in `us-east-1`. Do not run `cdk bootstrap` again.

---

## Chatbot

| Component | Detail |
|---|---|
| Trigger | API Gateway `POST /chat` |
| Runtime | Python 3.13 Lambda |
| AI | Amazon Bedrock `retrieve_and_generate` — RAG pattern |
| Model | `global.anthropic.claude-sonnet-4-5-20250929-v1:0` (cross-region inference profile) |
| Knowledge Base | S3 Vectors + Titan Embeddings v2 — content from `knowledge-base/` |
| CORS | Enumerated `ALLOWED_ORIGINS` in `handler.py` — aieverydaytutor.com, www, localhost |

---

## Content Publishing Pipeline

Video and blog content is authored as Markdown. CI handles the rest. Both pipelines follow the same pattern.

### Videos

| Step | What happens |
|---|---|
| Author commits MD + thumbnail | `knowledge-base/videos/<videoId>.md` + `frontend/public/thumbnails/video/<videoId>.png` |
| Frontend CI job | `tools/gen-videos.py` parses all `knowledge-base/videos/*.md` → writes `frontend/src/data/videos.json` → `pnpm build` bundles it → S3 sync + CloudFront invalidation |
| Knowledge-base CI job | `aws s3 sync --delete` → Bedrock ingestion job → chatbot KB updated |

### Blog Posts

| Step | What happens |
|---|---|
| Author commits MD + thumbnail | `knowledge-base/blogs/<postId>.md` + `frontend/public/thumbnails/blog/<postId>.png` |
| Frontend CI job | `tools/gen-blogs.py` parses all `knowledge-base/blogs/*.md` → writes `frontend/src/data/blogs.json` → `pnpm build` bundles it → S3 sync + CloudFront invalidation |
| Knowledge-base CI job | `aws s3 sync --delete` → Bedrock ingestion job → chatbot KB updated |

No DynamoDB. No runtime API. Both catalogs are static JSON files bundled at build time.

---

## CI/CD

| Job | Trigger | Steps |
|---|---|---|
| Frontend | `frontend/**` or `knowledge-base/videos/**` or `knowledge-base/blogs/**` or `tools/**` changed | Generate `videos.json` + `blogs.json` → `pnpm build` → S3 sync → CloudFront invalidation |
| Infrastructure | `infrastructure/**` or `chatbot/**` changed | `cdk deploy --all` |
| Knowledge-base | `knowledge-base/**` changed | S3 sync → Bedrock ingestion |

All jobs authenticate via OIDC. No staging environment — production only.

---

## Environment Variables

| Variable | Where used | Notes |
|---|---|---|
| `VITE_CHAT_API_URL` | Frontend build-time | Baked into bundle by Vite; set in GitHub secrets |
| `KB_ID` | Lambda runtime | Bedrock KB ID — set by CDK from `BEDROCK_KB_ID` secret |
| `BEDROCK_KB_ID` | CI / CDK synth | Injected at `cdk deploy` time |
| `KB_BUCKET_NAME` | CI / CDK synth | Injected at `cdk deploy` time |
| `BEDROCK_DS_ID` | CI | Used by KB sync job to start ingestion |

---

## Repository

| | |
|---|---|
| URL | `https://github.com/CumulusCycles/EverydayAI-Tutor` |
| Visibility | Public |
| Structure | Monorepo — frontend, infrastructure, chatbot, tools, docs |

---

## GitHub Access (Claude Code)

Claude Code uses a Fine-Grained Personal Access Token (PAT) to create feature branches, push to remote, and open PRs.

**PAT Permissions:** `Contents` R/W, `Pull requests` R/W, `Workflows` R/W, `Commit statuses` R, `Metadata` R

**Local configuration:** PAT stored in `.env` at repo root as `GITHUB_TOKEN=your_pat_here` — gitignored, never committed.

---

## Development Machine

| | |
|---|---|
| Hardware | Apple M1 Mac Studio |
| Node | v25.2.1 (Homebrew-managed) |
| pnpm | v11.0.9 |
| Python | 3.13 (uv for venv management) |
