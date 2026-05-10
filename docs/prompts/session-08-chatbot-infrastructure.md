# Session 08 — Chatbot Infrastructure

**Branch:** `feature/chatbot-infrastructure`
**Date:** May 10, 2026

---

## Goal

Add AWS infrastructure for the AI-powered chatbot — KB S3 bucket, Bedrock Knowledge Base, S3 Vectors vector store — all provisioned via CDK. Update GHA workflow to sync knowledge-base/ content to S3 and trigger Bedrock KB ingestion. Update IAM policies to include Bedrock permissions for the GHA OIDC role.

---

## Prompts

### Prompt 1

> Read docs/tech/tech-stack.md, docs/tech/architecture-diagram.md, docs/tech/iam-policy.json, and .claude/rules/infrastructure.md before starting.
>
> Do the following:
>
> 1. infrastructure/lib/stack.ts — add the following resources:
>    - A private S3 bucket for Knowledge Base content named 'aieverydaytutor-knowledge-base' — versioning enabled, blocked public access, encrypted with S3 managed keys
>    - A Bedrock Knowledge Base service IAM role with trust policy for bedrock.amazonaws.com, with permissions to read from the KB S3 bucket and use Amazon Titan Text Embeddings v2
>    - A Bedrock Knowledge Base using:
>      - The KB S3 bucket as the data source
>      - Amazon Titan Text Embeddings v2 as the embedding model (model ID: amazon.titan-embed-text-v2:0)
>      - S3 Vectors as the vector store — use Quick Create to let Bedrock create the S3 vector bucket and index automatically
>    - CfnOutputs for: KBBucketName, KnowledgeBaseId, DataSourceId
>    - All resources in us-east-1
>
> 2. docs/tech/iam-policy.json — add the following permissions for the GitHub Actions OIDC role:
>    - s3:PutObject, s3:DeleteObject, s3:ListBucket on the KB S3 bucket (for syncing knowledge-base/ content)
>    - bedrock:StartIngestionJob, bedrock:GetIngestionJob on the Knowledge Base (for triggering KB sync after content upload)
>
> 3. .github/workflows/deploy.yml — add a third job:
>    - Triggered when knowledge-base/** files change
>    - Uses OIDC auth (same AWS_ROLE_ARN and AWS_REGION secrets)
>    - Syncs knowledge-base/ folder to s3://${{ secrets.KB_BUCKET_NAME }}
>    - Triggers Bedrock KB ingestion job using AWS CLI:
>      aws bedrock-agent start-ingestion-job --knowledge-base-id ${{ secrets.BEDROCK_KB_ID }} --data-source-id ${{ secrets.BEDROCK_DS_ID }}
>    - Job name: Sync Knowledge Base
>
> 4. SETUP.md — add a section "After First Bedrock Infrastructure Deploy" explaining the manual step of copying CloudFormation outputs to GitHub secrets:
>    - KBBucketName → KB_BUCKET_NAME
>    - KnowledgeBaseId → BEDROCK_KB_ID
>    - DataSourceId → BEDROCK_DS_ID
>
> Run tsc --noEmit on infrastructure when done to verify no TypeScript errors.

### Result

tsc --noEmit exits 0. Everything is clean. Here's a summary of what changed across the four files:

- infrastructure/lib/stack.ts — private S3 bucket, KnowledgeBaseRole, CfnKnowledgeBase (S3_VECTORS Quick Create), CfnDataSource, CfnOutputs for KBBucketName/KnowledgeBaseId/DataSourceId
- docs/tech/iam-policy.json — KnowledgeBaseSync (S3) and BedrockIngestion statements added
- .github/workflows/deploy.yml — knowledge-base/** path filter, Sync Knowledge Base job added
- SETUP.md — "After First Bedrock Infrastructure Deploy" section added

---

## Fixes

### Fix 01 — S3 Vectors Quick Create Not Supported by CloudFormation

**Branch:** `fix/kb-s3-vectors-config`

**Problem:**
CDK deployment failed — S3 Vectors Quick Create not supported by CloudFormation — required IndexArn, VectorBucketArn, IndexName not found.

### Prompt

> The CDK deployment failed with this error on the Bedrock Knowledge Base resource:
>
> "required key [IndexArn] not found"
> "required key [VectorBucketArn] not found"
> "required key [IndexName] not found"
>
> The S3 Vectors Quick Create approach doesn't work via CloudFormation. Fix infrastructure/lib/stack.ts to:
>
> 1. Create an S3 vector bucket explicitly using aws_s3vectors (or CfnVectorBucket if L2 not available)
> 2. Create a vector index on that bucket explicitly
> 3. Reference the VectorBucketArn, IndexArn, and IndexName in the KnowledgeBase StorageConfiguration
>
> Use the AWS IaC MCP server to check the correct CDK constructs for S3 Vectors and Bedrock Knowledge Base with S3 Vectors storage configuration.
>
> Run tsc --noEmit when done to verify no TypeScript errors.

### Result

tsc --noEmit exits 0. Added CfnVectorBucket, CfnIndex (float32, 1024 dimensions, cosine), explicit s3vectors:* permissions on kbRole, and updated S3VectorsConfigurationProperty with vectorBucketArn, indexArn, and indexName.

---

### Fix 02 — S3 Vectors Schema Mismatch + Orphaned S3 Bucket

**Branch:** `fix/kb-deploy-errors`

**Problems:**
1. S3VectorsConfiguration failing — "2 subschemas matched instead of one" — IndexName must not be passed, only indexArn and vectorBucketArn
2. KnowledgeBaseBucket `aieverydaytutor-knowledge-base` already exists in AWS from failed prior deploy — must import with Bucket.fromBucketName()

### Prompt

> Fix two issues in infrastructure/lib/stack.ts:
>
> 1. The Bedrock KnowledgeBase S3VectorsConfiguration is failing with "2 subschemas matched instead of one". Remove IndexName from the S3VectorsConfigurationProperty — only pass indexArn and vectorBucketArn. Do not pass indexName.
>
> 2. The KnowledgeBaseBucket S3 bucket named 'aieverydaytutor-knowledge-base' already exists in AWS from a failed prior deploy. Import it using Bucket.fromBucketName() instead of creating a new bucket. Replace the new Bucket() construct with:
>    const kbBucket = s3.Bucket.fromBucketName(this, 'KnowledgeBaseBucket', 'aieverydaytutor-knowledge-base');
>
> Also add node.addDependency(kbRole) to the KnowledgeBase resource to ensure the IAM role is created before the Knowledge Base.
>
> Run tsc --noEmit when done.

### Result

tsc --noEmit exits 0. Three changes made:

  1. kbBucket — replaced new s3.Bucket(...) with s3.Bucket.fromBucketName(...) to import the existing bucket instead of creating a new one.
  2. s3VectorsConfiguration — removed indexName, leaving only vectorBucketArn and indexArn.
  3. knowledgeBase.node.addDependency(kbRole) — added before the data source to guarantee the IAM role is created first.

---

## Notes

- After GHA deploys the CDK stack, manually copy CloudFormation outputs to GitHub secrets:
  - `KBBucketName` → `KB_BUCKET_NAME`
  - `KnowledgeBaseId` → `BEDROCK_KB_ID`
  - `DataSourceId` → `BEDROCK_DS_ID`
