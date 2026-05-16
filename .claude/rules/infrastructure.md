# Infrastructure Rules

## Stack

- **IaC:** AWS CDK (TypeScript)
- **Region:** us-east-1 (all resources)
- **Hosting:** S3 (static site) + CloudFront (CDN + HTTPS)
- **DNS:** Route 53 — hosted zone already exists, use `HostedZone.fromLookup()`
- **SSL:** ACM — certificate must be in us-east-1 (CloudFront requirement)
- **Secrets:** AWS SSM Parameter Store

## Project Structure (infrastructure/)

```
infrastructure/
├── bin/
│   └── app.ts              # CDK app entry point — instantiates both stacks
├── lib/
│   ├── stack.ts            # Site stack — S3, CloudFront, Route 53, ACM, OIDC, Bedrock KB
│   └── chatbot-stack.ts    # Chatbot stack — Python Lambda, HTTP API Gateway, IAM
├── cdk.json
├── package.json
└── tsconfig.json
```

## Key Conventions

- S3 bucket is **private** — never public
- CloudFront accesses S3 via **Origin Access Control (OAC)**
- CloudFront must redirect 403/404 → `index.html` for React Router
- ACM certificate covers both `aieverydaytutor.com` AND `www.aieverydaytutor.com`
- `www.aieverydaytutor.com` redirects to `aieverydaytutor.com` (non-www is canonical)
- Use `HostedZone.fromLookup()` — do NOT create a new hosted zone

## CDK Bootstrap

AWS account is already bootstrapped in `us-east-1`.
Do not run `cdk bootstrap` again.

## Deployment

Infrastructure deploys automatically via GitHub Actions on push to `main`
when files in `/infrastructure` change.

To deploy manually:
```bash
cd infrastructure
pnpm install
cdk deploy
```

## GitHub Actions Authentication — OIDC

- GitHub Actions authenticates with AWS via **OpenID Connect (OIDC)** — no long-lived credentials ever
- The OIDC provider and `GitHubActionsDeployRole` are provisioned in the CDK stack (`lib/stack.ts`)
- GitHub Actions assumes the role per-run via `aws-actions/configure-aws-credentials`
- **Never** store `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` in GitHub secrets
- Role policy is documented in `docs/tech/iam-policy.json`

### Required GitHub Secrets

| Secret | Purpose |
|---|---|
| `AWS_ROLE_ARN` | OIDC role ARN for GitHub Actions |
| `AWS_REGION` | `us-east-1` |
| `BEDROCK_KB_ID` | Bedrock Knowledge Base ID — injected at CDK synth time |
| `KB_BUCKET_NAME` | S3 bucket name for Bedrock KB source — injected at CDK synth time |
| `BEDROCK_DS_ID` | Bedrock Data Source ID — used by KB sync workflow |
| `VITE_CHAT_API_URL` | Chat API Gateway URL — baked into frontend at Vite build time |

## Safety Rules

- Never run `cdk destroy` unless explicitly instructed
- Always run `cdk diff` before `cdk deploy` to review changes
- Call out any changes to IAM permissions, S3 policies, or CloudFront behaviors before applying
- Never hardcode AWS account IDs, ARNs, or secrets in CDK code — use SSM Parameter Store or CDK context
- Never store AWS credentials in GitHub secrets — use OIDC
