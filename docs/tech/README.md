# EverydayAI Tutor — Tech

This folder contains all technical documentation for the AIEverydayTutor.com website project.

---

## Files

| File | Description |
|---|---|
| `tech-stack.md` | Full technology stack — frontend, infrastructure, CI/CD, testing, and versioning |
| `architecture-diagram.md` | Full system architecture diagrams — launch infrastructure, future state, CI/CD pipeline, and agentic search flow |
| `iam-policy.json` | IAM policy for the GitHub Actions OIDC deploy role — grants permission to assume CDK bootstrap roles + S3 sync + CloudFront invalidation |
| `iam-policy-local-dev.json` | IAM policy for local development IAM user — broader permissions needed for manual `cdk deploy` from dev machine |
