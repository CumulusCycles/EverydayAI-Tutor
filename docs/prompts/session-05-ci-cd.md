# Session 05 — CI/CD

**Branch:** `feature/ci-cd`
**Date:** May 10, 2026

---

## Goal

Create the GitHub Actions workflow for automated deployment — frontend build and S3 sync on frontend changes, CDK deploy on infrastructure changes.

---

## Prompts

### Prompt 1

> Read docs/tech/tech-stack.md, docs/tech/architecture-diagram.md, and .claude/rules/infrastructure.md before starting.

Do the following:

1. Update infrastructure/lib/stack.ts to add:
   - A GitHub Actions OIDC Identity Provider using OidcProviderNative (the modern CDK construct — not the legacy OpenIdConnectProvider)
   - A GitHubActionsDeployRole IAM role with a trust policy scoped to repo CumulusCycles/EverydayAI-Tutor, main branch only
   - The role policy from docs/tech/iam-policy.json — grants permission to assume the CDK bootstrap roles only

2. Create .github/workflows/deploy.yml with two path-filtered jobs:
   - frontend job — triggers on changes to frontend/** — runs pnpm install, pnpm build, syncs /dist to S3, invalidates CloudFront cache /* 
   - infrastructure job — triggers on changes to infrastructure/** — runs cdk deploy --require-approval never
   - Both jobs authenticate with AWS via OIDC using aws-actions/configure-aws-credentials, assuming the GitHubActionsDeployRole
   - GitHub secrets used: AWS_ROLE_ARN and AWS_REGION only — no access keys
   - Node version: 25.2.1
   - Package manager: pnpm

Run tsc --noEmit on the infrastructure to verify no TypeScript errors when done. Report what was created and what the next steps are.

### Result

Everything looks correct. Here's a summary of what was created:

  ---
  infrastructure/lib/stack.ts — two additions:

  1. GitHubOidcProvider (iam.OidcProviderNative) — native CloudFormation AWS::IAM::OIDCProvider, no Lambda custom resource. URL: token.actions.githubusercontent.com, audience:
  sts.amazonaws.com.
  2. GitHubActionsDeployRole — IAM role with a WebIdentityPrincipal trust policy locked to repo:CumulusCycles/EverydayAI-Tutor:ref:refs/heads/main only. Inline policy from
  iam-policy.json: sts:AssumeRole + iam:PassRole on the four CDK bootstrap roles. Role ARN is emitted as a CfnOutput (GitHubActionsDeployRoleArn).

  .github/workflows/deploy.yml — single file, three jobs:

  - changes — runs git diff HEAD^ HEAD, sets outputs frontend=true/false and infrastructure=true/false
  - frontend — runs when frontend/** changed: pnpm install → build → OIDC auth → reads BucketName/DistributionId from CloudFormation stack outputs → aws s3 sync → aws cloudfront
  create-invalidation
  - infrastructure — runs when infrastructure/** changed: pnpm install → OIDC auth → cdk deploy --require-approval never

  Both deploy jobs use only secrets.AWS_ROLE_ARN and secrets.AWS_REGION.

  ---
  Next steps before this CI/CD pipeline is functional:

  1. Commit and PR this branch — the CDK stack update needs to be deployed manually first (cdk deploy) to create the OIDC provider and role in AWS.
  2. Set GitHub secrets — after CDK deploy, copy the GitHubActionsDeployRoleArn output value into GitHub → Settings → Secrets → AWS_ROLE_ARN. Set AWS_REGION to us-east-1.
  3. Note on frontend S3/CloudFront permissions — the GitHubActionsDeployRole's policy only allows assuming CDK bootstrap roles. The "Get stack outputs" step
  (cloudformation:DescribeStacks) and the S3 sync + CloudFront invalidation require direct API permissions that aren't in iam-policy.json. You'll need to add those statements to
  the role's policy before the frontend job will succeed.

---

### Prompt 2

> Update the GitHubActionsDeployRole inline policy in infrastructure/lib/stack.ts to add the following additional permissions needed for the frontend deploy job:

1. cloudformation:DescribeStacks on * — to read S3 bucket name and CloudFront distribution ID from stack outputs
2. s3:PutObject, s3:GetObject, s3:DeleteObject, s3:ListBucket, s3:ListBucketMultipartUploads, s3:AbortMultipartUpload on * — to sync the frontend build to S3
3. cloudfront:CreateInvalidation, cloudfront:GetInvalidation on * — to invalidate the CloudFront cache

Run tsc --noEmit when done to verify no TypeScript errors.

### Result

Already in infrastructure/. TypeScript exits clean.

  The FrontendDeploy policy statement was added to infrastructure/lib/stack.ts with all three permission sets:

  - CloudFormation: cloudformation:DescribeStacks on * — reads BucketName and DistributionId from stack outputs
  - S3: PutObject, GetObject, DeleteObject, ListBucket, ListBucketMultipartUploads, AbortMultipartUpload on * — covers aws s3 sync --delete including multipart cleanup
  - CloudFront: CreateInvalidation, GetInvalidation on * — creates and polls the cache invalidation

  tsc --noEmit exits 0. The role is fully wired for both the infrastructure and frontend deploy jobs.

---