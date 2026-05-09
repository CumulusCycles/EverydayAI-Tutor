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
│   └── app.ts         # CDK app entry point
├── lib/
│   └── stack.ts       # Main CDK stack
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

## Python & Virtual Environments

- **Always use `uv` and `uvx`** for Python package management and virtual environments — never `pip`, `pipenv`, or `poetry`
- Create virtual environments with `uv venv`
- Install packages with `uv pip install`
- Run tools with `uvx`
- This applies to all Python work including Lambda functions and any scripts

## Safety Rules

- Never run `cdk destroy` unless explicitly instructed
- Always run `cdk diff` before `cdk deploy` to review changes
- Call out any changes to IAM permissions, S3 policies, or CloudFront behaviors before applying
- Never hardcode AWS account IDs, ARNs, or secrets in CDK code — use SSM Parameter Store or CDK context
