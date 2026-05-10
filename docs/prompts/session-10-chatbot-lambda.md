# Session 10 — Chatbot Lambda

**Branch:** `feature/chatbot-lambda`
**Date:** May 10, 2026

---

## Goal

Build the Python Lambda function and API Gateway that powers the chatbot — querying the Bedrock Knowledge Base with S3 Vectors and returning grounded responses to the frontend.

---

## Prompts

### Prompt 1

> Using the python-agent, build the chatbot Lambda and API Gateway infrastructure for this branch.

1. chatbot/lambda/handler.py — Python Lambda function that:
   - Receives a user query via API Gateway POST /chat
   - Calls Bedrock Knowledge Base (KB_ID from env) to retrieve relevant chunks using S3 Vectors
   - Passes retrieved context + user query to Claude (claude-sonnet-4-20250514) via Bedrock converse API
   - Returns a grounded response as JSON
   - Handles errors gracefully with appropriate HTTP status codes

2. chatbot/lambda/requirements.txt — boto3 only (available in Lambda runtime)

3. infrastructure/lib/chatbot-stack.ts — CDK stack adding:
   - Python Lambda (from chatbot/lambda/, runtime Python 3.13)
   - Environment vars: KB_ID, KB_BUCKET_NAME, BEDROCK_REGION (all from existing GitHub secrets)
   - IAM role with permissions: bedrock:RetrieveAndGenerate, bedrock:Retrieve, s3:GetObject on KB bucket
   - API Gateway HTTP API with POST /chat route → Lambda integration
   - CORS enabled for the CloudFront domain
   - Stack output: API Gateway URL

4. infrastructure/bin/app.ts — instantiate ChatbotStack alongside existing stack

5. docs/tech/architecture-diagram.md — update any references from "S3 or OpenSearch Serverless" to "S3 Vectors"

Use environment variables for all resource IDs — never hardcode ARNs or IDs.
Run lint and type checks when done.

### Result

Everything looks correct. Here's what was built across 6 files, all checks passing:

  Python Lambda (chatbot/lambda/)
  - handler.py — thin entry point: parses body, validates message, delegates to service, CORS headers on every response
  - service.py — retrieve_and_generate against the KB, brand-aligned system prompt, returns { response, citations }
  - requirements.txt — comment-only (boto3 is in the Lambda runtime)

  CDK Infrastructure (infrastructure/lib/chatbot-stack.ts)
  - Python 3.13 Lambda with 30s timeout
  - IAM: AWSLambdaBasicExecutionRole + bedrock:RetrieveAndGenerate/Retrieve + s3:GetObject on KB bucket
  - HTTP API Gateway with CORS locked to https://aieverydaytutor.com
  - POST /chat → Lambda via HttpLambdaIntegration
  - CfnOutput: ChatApiUrl

  bin/app.ts — ChatbotStack instantiated alongside the existing EverydayAiTutorStack

  docs/tech/architecture-diagram.md — all "S3 or OpenSearch Serverless" references replaced with "S3 Vectors"

  All three checks clean: tsc --noEmit, pnpm lint, pnpm build. Ready to /ship.

---

### Prompt 2

> The CDK deploy GitHub Actions job is failing because there are now two stacks (EverydayAiTutorStack and ChatbotStack). Update the deploy command in .github/workflows/deploy.yml to use `pnpm exec cdk deploy --all --require-approval never` instead of `pnpm exec cdk deploy --require-approval never`.

### Result

 Done. Ready to /ship.

---

## Notes

