# Session 09 — Chatbot Infrastructure

**Branch:** `feature/chatbot-infrastructure`
**Date:** May 10, 2026

---

## Goal

Add AWS infrastructure for the AI-powered chatbot — KB S3 bucket, Bedrock Knowledge Base, S3 Vectors vector store — all provisioned via CDK. Update GHA workflow to sync knowledge-base/ content to S3 and trigger Bedrock KB ingestion. Update IAM policies to include Bedrock permissions for the GHA OIDC role.

---

## Prompts

### Prompt 1

> Read docs/tech/tech-stack.md, docs/tech/architecture-diagram.md, docs/tech/iam-policy.json, and .claude/rules/infrastructure.md before starting.

Do the following:

1. infrastructure/lib/stack.ts — add the following resources:
   - A private S3 bucket for Knowledge Base content named 'aieverydaytutor-knowledge-base' — versioning enabled, blocked public access, encrypted with S3 managed keys
   - A Bedrock Knowledge Base service IAM role with trust policy for bedrock.amazonaws.com, with permissions to read from the KB S3 bucket and use Amazon Titan Text Embeddings v2
   - A Bedrock Knowledge Base using:
     - The KB S3 bucket as the data source
     - Amazon Titan Text Embeddings v2 as the embedding model (model ID: amazon.titan-embed-text-v2:0)
     - S3 Vectors as the vector store — use Quick Create to let Bedrock create the S3 vector bucket and index automatically
   - CfnOutputs for: KBBucketName, KnowledgeBaseId, DataSourceId
   - All resources in us-east-1

2. docs/tech/iam-policy.json — add the following permissions for the GitHub Actions OIDC role:
   - s3:PutObject, s3:DeleteObject, s3:ListBucket on the KB S3 bucket (for syncing knowledge-base/ content)
   - bedrock:StartIngestionJob, bedrock:GetIngestionJob on the Knowledge Base (for triggering KB sync after content upload)

3. .github/workflows/deploy.yml — add a third job:
   - Triggered when knowledge-base/** files change
   - Uses OIDC auth (same AWS_ROLE_ARN and AWS_REGION secrets)
   - Syncs knowledge-base/ folder to s3://${{ secrets.KB_BUCKET_NAME }}
   - Triggers Bedrock KB ingestion job using AWS CLI:
     aws bedrock-agent start-ingestion-job --knowledge-base-id ${{ secrets.BEDROCK_KB_ID }} --data-source-id ${{ secrets.BEDROCK_DS_ID }}
   - Job name: Sync Knowledge Base

4. SETUP.md — add a section "After First Bedrock Infrastructure Deploy" explaining the manual step of copying CloudFormation outputs to GitHub secrets:
   - KBBucketName → KB_BUCKET_NAME
   - KnowledgeBaseId → BEDROCK_KB_ID
   - DataSourceId → BEDROCK_DS_ID

Run tsc --noEmit on infrastructure when done to verify no TypeScript errors.

### Result

tsc --noEmit exits 0. Everything is clean. Here's a summary of what changed across the four files:
 
  infrastructure/lib/stack.ts
  - Import aws-cdk-lib/aws-bedrock
  - Private, versioned S3 bucket aieverydaytutor-knowledge-base (S3_MANAGED encryption, RETAIN)
  - KnowledgeBaseRole — Bedrock service principal with source account/ARN conditions; grants S3 read + bedrock:InvokeModel on Titan Embeddings v2
  - CfnKnowledgeBase — VECTOR type, Titan Text Embeddings v2, S3_VECTORS storage with empty Quick Create config
  - CfnDataSource — S3 type pointing at the KB bucket
  - Two new deployRole policy statements: KnowledgeBaseSync (S3 write to KB bucket) and BedrockIngestion (bedrock:StartIngestionJob / GetIngestionJob)
  - CfnOutput for KBBucketName, KnowledgeBaseId, DataSourceId

  docs/tech/iam-policy.json
  - KnowledgeBaseSync statement — S3 put/delete/list on the KB bucket
  - BedrockIngestion statement — start/get ingestion job

  .github/workflows/deploy.yml
  - knowledge-base/** added to path trigger
  - knowledge_base output added to the changes detection job
  - New Sync Knowledge Base job — OIDC auth → aws s3 sync → bedrock-agent start-ingestion-job

  SETUP.md
  - New section "After First Bedrock Infrastructure Deploy" — table mapping CloudFormation outputs to the three new GitHub secrets (KB_BUCKET_NAME, BEDROCK_KB_ID, BEDROCK_DS_ID)

  Ready to /ship.

---

## Notes

- After GHA deploys the CDK stack, manually copy CloudFormation outputs to GitHub secrets:
  - `KBBucketName` → `KB_BUCKET_NAME`
  - `KnowledgeBaseId` → `BEDROCK_KB_ID`
  - `DataSourceId` → `BEDROCK_DS_ID`
