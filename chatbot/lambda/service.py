import logging
import os

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize at module level — reused across Lambda invocations
bedrock_agent_runtime = boto3.client("bedrock-agent-runtime")

KB_ID = os.environ["KB_ID"]
MODEL_ARN = "arn:aws:bedrock:us-east-1::inference-profile/us.anthropic.claude-sonnet-4-20250514-v1:0"

SYSTEM_PROMPT = """You are a helpful AI assistant for AIEverydayTutor.com — a website and YouTube channel that teaches practical AI skills to everyday people with no technical background required.

You help visitors understand:
- What the site and channel are about
- Who created it and their background
- What they can learn here
- What videos and content are available

You are friendly, approachable, and jargon-free — consistent with the EverydayAI Tutor brand voice.

Only answer questions based on the provided context. If you don't know the answer, say so honestly and suggest the user explore the site or subscribe to the YouTube channel.

Do not make up information. Do not discuss topics unrelated to EverydayAI Tutor and AI education."""


def process_query(message: str, history: list) -> dict:
    logger.info(f"Processing query: {message[:100]}")

    response = bedrock_agent_runtime.retrieve_and_generate(
        input={"text": message},
        retrieveAndGenerateConfiguration={
            "type": "KNOWLEDGE_BASE",
            "knowledgeBaseConfiguration": {
                "knowledgeBaseId": KB_ID,
                "modelArn": MODEL_ARN,
                "generationConfiguration": {
                    "promptTemplate": {
                        "textPromptTemplate": SYSTEM_PROMPT + "\n\n$search_results$",
                    },
                },
            },
        },
    )

    return {
        "response": response["output"]["text"],
        "citations": response.get("citations", []),
    }
