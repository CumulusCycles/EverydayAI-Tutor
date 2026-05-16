# Chatbot Rules

## Stack

- **Trigger:** API Gateway (POST `/chat`) → Python Lambda
- **AI:** Amazon Bedrock `retrieve_and_generate` — Knowledge Base RAG pattern
- **Model:** Claude Sonnet (cross-region inference profile) — see `MODEL_ARN` in `service.py`
- **Knowledge Base:** Markdown files in `knowledge-base/` synced to Bedrock S3 bucket via CI — organized into `website/`, `videos/`, and `blogs/` subdirectories
- **Infrastructure:** Defined in CDK chatbot stack (`infrastructure/`)

## Directory Structure

```
chatbot/
└── lambda/
    ├── handler.py       # Lambda entry point — request parsing, CORS, error handling
    ├── service.py       # Bedrock KB logic — retrieve_and_generate call
    └── requirements.txt # boto3 is Lambda runtime-provided — list only additional deps
```

## Python Conventions

- Always use the **python-agent** for any changes to `chatbot/lambda/`
- Use `uv` for local dependency management
- `boto3` is provided by the Lambda runtime — do not add it to `requirements.txt`
- Keep `handler.py` thin — request/response parsing and CORS only
- Business logic belongs in `service.py` (or additional service modules)

## Environment Variables

| Variable | Source | Purpose |
|---|---|---|
| `KB_ID` | Lambda env (set by CDK) | Bedrock Knowledge Base ID |

- Do not hardcode KB IDs, model ARNs, or other AWS resource identifiers in code — inject via environment or CDK outputs
- `VITE_CHAT_API_URL` is a **frontend build-time** variable — set in the frontend build job, not in Lambda

## CORS

- Allowed origins are explicitly enumerated in `handler.py` (`ALLOWED_ORIGINS`)
- Production domains: `aieverydaytutor.com` and `www.aieverydaytutor.com`
- When adding or changing allowed origins, update both `handler.py` and the CDK chatbot stack

## Knowledge Base Content

The `knowledge-base/` folder is organized into three subdirectories:

| Subdirectory | Contents |
|---|---|
| `knowledge-base/website/` | General site content — about, FAQ, learning journey, site overview |
| `knowledge-base/videos/` | One MD file per video — frontmatter drives the video card catalog; prose drives chatbot retrieval |
| `knowledge-base/blogs/` | One MD file per blog post (future) |

- CI syncs `knowledge-base/**` on push to `main` → Bedrock S3 bucket → ingestion job (with `--delete`, so S3 mirrors the repo exactly)
- Do not move, rename, or restructure `knowledge-base/` without updating the sync workflow
- Keep content factual and brand-consistent — the system prompt instructs the model to answer only from KB context

## Safety Rules

- Never log full user messages at INFO level in production — truncate or omit
- Do not expand the system prompt to answer questions outside EverydayAI Tutor scope
- Do not store conversation history server-side — history is passed per-request from the client
- Any IAM changes to the Lambda execution role must be reviewed against `docs/tech/iam-policy.json`
