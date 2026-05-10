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

GitHub Actions workflow triggered on push to `main`.

```mermaid
flowchart LR
    A([Push to main]) --> B{Path Filter}
    B -->|/frontend changed| C[pnpm install]
    C --> D[pnpm build]
    D --> E[OIDC Auth\nAssume GitHubActionsDeployRole]
    E --> F[Sync /dist\nto S3]
    F --> G[CloudFront\nCache Invalidation]
    B -->|/infrastructure or\n/chatbot changed| H[OIDC Auth\nAssume GitHubActionsDeployRole]
    H --> I[cdk deploy]

    style A fill:#F97316,color:#fff
    style B fill:#0F172A,color:#fff
    style C fill:#5B6EF5,color:#fff
    style D fill:#5B6EF5,color:#fff
    style E fill:#22C55E,color:#fff
    style F fill:#5B6EF5,color:#fff
    style G fill:#5B6EF5,color:#fff
    style H fill:#22C55E,color:#fff
    style I fill:#5B6EF5,color:#fff
```

### Notes
- Frontend and infrastructure jobs run independently via path filtering
- **Authentication:** OIDC — GitHub Actions assumes `GitHubActionsDeployRole` via `aws-actions/configure-aws-credentials`
- **No AWS credentials stored in GitHub** — OIDC issues temporary credentials per run
- GitHub secrets required: `AWS_ROLE_ARN` and `AWS_REGION` only
- Cache invalidation uses `/*` — counts as 1 path (first 1,000/month free)
- No staging environment at launch — deploys directly to production
- Claude Code creates feature branches, pushes, and opens PRs for review before merging to `main`

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
    F --> G[(DynamoDB)]
    F --> H[Bedrock\nKnowledge Base]
    H --> I[(Vector Store\nS3 Vectors)]

    subgraph AWS [AWS — us-east-1]
        B
        C
        D
        E
        F
        G
        H
        I
    end

    style A fill:#F97316,color:#fff
    style B fill:#5B6EF5,color:#fff
    style C fill:#5B6EF5,color:#fff
    style D fill:#5B6EF5,color:#fff
    style E fill:#5B6EF5,color:#fff
    style F fill:#F97316,color:#fff
    style G fill:#0F172A,color:#fff
    style H fill:#0F172A,color:#fff
    style I fill:#0F172A,color:#fff
```

---

## 4. Agentic Search — Content Ingestion Flow

How content gets indexed for semantic search.

```mermaid
flowchart LR
    A([Content Added\nor Updated]) --> B[(DynamoDB\nSource of Truth)]
    B --> C[DynamoDB Streams]
    C --> D[Lambda\nPython]
    D --> E[Bedrock\nKnowledge Base]
    E --> F[(Vector Store\nS3 Vectors)]

    style A fill:#F97316,color:#fff
    style B fill:#5B6EF5,color:#fff
    style C fill:#5B6EF5,color:#fff
    style D fill:#F97316,color:#fff
    style E fill:#0F172A,color:#fff
    style F fill:#0F172A,color:#fff
```

### Flow Description
1. A blog post or YouTube video description is added or updated in **DynamoDB**
2. **DynamoDB Streams** detects the change and triggers a Lambda function
3. **Lambda (Python)** processes the content and sends it to Bedrock
4. **Bedrock Knowledge Base** chunks the content, creates vector embeddings, and stores them in the Vector Store
5. Content is now indexed and available for semantic search

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
6. User sees semantically matched results — blog posts and video content

---

## Agentic Search — Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Content storage | DynamoDB | Structured data, fast reads, powers site content pages |
| Search index | Bedrock Knowledge Base | Semantic search, natural language queries, managed embeddings |
| Vector store | S3 Vectors | Native AWS vector store — no separate service to manage, cost-effective at any query volume |
| Lambda runtime | Python | Dominant language in AI/ML ecosystem; best Bedrock SDK support |
| Sync mechanism | DynamoDB Streams | Event-driven, no polling, automatic on content change |

---

## Notes

- DynamoDB is the **source of truth** — Bedrock indexes a copy of the content
- All Lambdas written in **Python**
- Vector store: S3 Vectors — implemented and deployed
- Chatbot is live — powered by **AWS Bedrock Knowledge Base** with **S3 Vectors**
