import json
import logging
from service import process_query

logger = logging.getLogger()
logger.setLevel(logging.INFO)


ALLOWED_ORIGINS = {
    "https://aieverydaytutor.com",
    "https://www.aieverydaytutor.com",
}


def handler(event, context):
    origin = (event.get("headers") or {}).get("origin", "")

    try:
        body = json.loads(event.get("body", "{}"))
        message = body.get("message", "")
        history = body.get("history", [])

        if not message:
            return {
                "statusCode": 400,
                "headers": cors_headers(origin),
                "body": json.dumps({"error": "message is required"}),
            }

        response = process_query(message, history)

        return {
            "statusCode": 200,
            "headers": cors_headers(origin),
            "body": json.dumps(response),
        }
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": cors_headers(origin),
            "body": json.dumps({"error": "Internal server error"}),
        }


def cors_headers(origin: str) -> dict:
    allowed_origin = (
        origin if origin in ALLOWED_ORIGINS else "https://aieverydaytutor.com"
    )
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": allowed_origin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    }
