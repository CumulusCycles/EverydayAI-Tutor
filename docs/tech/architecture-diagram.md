# EverydayAI Tutor — Architecture Diagrams

---

## 1. Launch Architecture

Current infrastructure as deployed at launch.

```mermaid
flowchart TD
    A([User]) --> B[Route 53\nDNS]
    B --> C[CloudFront\nCDN + HTTPS]
    C --> D[S3 Bucket\nStatic Site]
    C --> E[ACM\nSSL Certificate]

    subgraph AWS [AWS — us-east-1]
        B
        C
        D
        E
    end

    style A fill:#F97316,color:#fff
    style B fill:#5B6EF5,color:#fff
    style C fill:#5B6EF5,color:#fff
    style D fill:#5B6EF5,color:#fff
    style E fill:#0F172A,color:#fff
```

### Notes
- `aieverydaytutor.com` — canonical, serves the site
- `www.aieverydaytutor.com` — redirects to non-www
- ACM certificate covers both domains (SANs)
- S3 bucket is private — CloudFront accesses via Origin Access Control (OAC)
- CloudFront redirects 403/404 → `index.html` for React Router client-side routing
- All infrastructure in `us-east-1`

---

## 2. CI/CD Pipeline

GitHub Actions workflow triggered on push to `main`. Three independent path-filtered jobs.

```mermaid
flowchart LR
    A([Push to main]) --> B{Path Filter}

    B -->|frontend or\nknowledge-base/videos\nor tools changed| C[OIDC Auth]
    C --> C1[gen-videos.py]
    C1 --> C2[pnpm build]
    C2 --> C3[Sync /dist to S3]
    C3 --> C4[CloudFront\nInvalidation]

    B -->|infrastructure or\nchatbot changed| D[OIDC Auth]
    D --> D1[cdk deploy --all]

    B -->|knowledge-base\nchanged| E[OIDC Auth]
    E --> E1[S3 sync\nknowledge-base/]
    E1 --> E2[Bedrock\nIngestion Job]

    style A fill:#F97316,color:#fff
    style B fill:#0F172A,color:#fff
    style C fill:#22C55E,color:#fff
    style C1 fill:#5B6EF5,color:#fff
    style C2 fill:#5B6EF5,color:#fff
    style C3 fill:#5B6EF5,color:#fff
    style C4 fill:#5B6EF5,color:#fff
    style D fill:#22C55E,color:#fff
    style D1 fill:#5B6EF5,color:#fff
    style E fill:#22C55E,color:#fff
    style E1 fill:#5B6EF5,color:#fff
    style E2 fill:#0F172A,color:#fff
```

### Notes
- Three independent jobs — frontend, infrastructure, knowledge-base — each triggered by separate path filters
- **Authentication:** OIDC — GitHub Actions assumes `GitHubActionsDeployRole` — no long-lived credentials stored
- GitHub secrets: `AWS_ROLE_ARN`, `AWS_REGION`, `BEDROCK_KB_ID`, `KB_BUCKET_NAME`, `BEDROCK_DS_ID`, `VITE_CHAT_API_URL`
- Cache invalidation uses `/*` — counts as 1 path (first 1,000/month free)
- No staging environment — deploys directly to production
- Claude Code creates feature branches and opens PRs; merges to `main` trigger CI

---

## 3. Current Architecture — Full Stack

Full system architecture including the chatbot backend and knowledge base.

```mermaid
flowchart TD
    A([User]) --> B[Route 53]
    B --> C[CloudFront]
    C --> D[S3\nStatic Site]
    C --> E[API Gateway]
    E --> F[Lambda\nPython]
    F --> H[Bedrock\nKnowledge Base]
    H --> I[(Vector Store\nS3 Vectors)]

    subgraph AWS [AWS — us-east-1]
        B
        C
        D
        E
        F
        H
        I
    end

    style A fill:#F97316,color:#fff
    style B fill:#5B6EF5,color:#fff
    style C fill:#5B6EF5,color:#fff
    style D fill:#5B6EF5,color:#fff
    style E fill:#5B6EF5,color:#fff
    style F fill:#F97316,color:#fff
    style H fill:#0F172A,color:#fff
    style I fill:#0F172A,color:#fff
```

---

## 4. Content Ingestion Flow

How Markdown content gets indexed in the Bedrock Knowledge Base for chatbot retrieval.

```mermaid
flowchart LR
    A([MD file committed\nto knowledge-base/]) --> B[GitHub Actions\nKB sync job]
    B --> C[aws s3 sync\nknowledge-base/ to S3]
    C --> D[start-ingestion-job]
    D --> E[Bedrock\nKnowledge Base]
    E --> F[(Vector Store\nS3 Vectors)]

    style A fill:#F97316,color:#fff
    style B fill:#22C55E,color:#fff
    style C fill:#5B6EF5,color:#fff
    style D fill:#5B6EF5,color:#fff
    style E fill:#0F172A,color:#fff
    style F fill:#0F172A,color:#fff
```

### Flow Description
1. A Markdown file is committed to `knowledge-base/` (videos or website content) and merged to `main`
2. **GitHub Actions** knowledge-base job runs: `aws s3 sync knowledge-base/ → KB S3 bucket` (with `--delete` so S3 mirrors the repo exactly)
3. **Bedrock ingestion job** is triggered via `bedrock-agent start-ingestion-job`
4. **Bedrock Knowledge Base** chunks the Markdown content, creates vector embeddings, and stores them in the Vector Store
5. Content is now indexed and available for chatbot semantic retrieval

---

## 5. Agentic Search — Query Flow

How a user search query returns semantically relevant results.

```mermaid
flowchart LR
    A([User Search\nQuery]) --> B[React Frontend]
    B --> C[API Gateway]
    C --> D[Lambda\nPython]
    D --> E[Bedrock\nKnowledge Base]
    E --> F[(Vector Store)]
    F --> E
    E --> D
    D --> C
    C --> B
    B --> G([Results\nReturned])

    style A fill:#F97316,color:#fff
    style B fill:#5B6EF5,color:#fff
    style C fill:#5B6EF5,color:#fff
    style D fill:#F97316,color:#fff
    style E fill:#0F172A,color:#fff
    style F fill:#0F172A,color:#fff
    style G fill:#22C55E,color:#fff
```

### Flow Description
1. User enters a natural language search query in the **React frontend**
2. Frontend calls **API Gateway**
3. **Lambda (Python)** receives the query and calls Bedrock Knowledge Base
4. **Bedrock Knowledge Base** performs semantic vector search against the **Vector Store**
5. Relevant results are returned back through Lambda → API Gateway → Frontend
6. User sees semantically matched results — video content and site information

---

## Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Content source of truth | Markdown files in `knowledge-base/` | Single file per video, git-versioned, drives both frontend cards and chatbot KB |
| Frontend content catalog | Static JSON (videos.json) | Build-time generation — no runtime API, no failure modes, free at any scale |
| Chatbot search index | Bedrock Knowledge Base | Semantic search, natural language queries, managed embeddings |
| Vector store | S3 Vectors | Native AWS vector store — no separate service to manage |
| Lambda runtime | Python | Best Bedrock SDK support |
| KB sync mechanism | GitHub Actions CI (`aws s3 sync` + `start-ingestion-job`) | Simple, event-driven on merge to main, no additional infrastructure |

---

## Notes

- Markdown files are the **source of truth** — frontmatter drives the site, prose drives the chatbot
- No DynamoDB — content pipeline is fully static (build-time JSON generation)
- All Lambdas written in **Python**
- Vector store: S3 Vectors — implemented and deployed
- Chatbot is live — powered by **AWS Bedrock Knowledge Base** with **S3 Vectors**
