import json
import logging
from service import process_query

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        message = body.get('message', '')
        history = body.get('history', [])

        if not message:
            return {
                'statusCode': 400,
                'headers': cors_headers(),
                'body': json.dumps({'error': 'message is required'}),
            }

        response = process_query(message, history)

        return {
            'statusCode': 200,
            'headers': cors_headers(),
            'body': json.dumps(response),
        }
    except Exception as e:
        logger.error(f'Error: {str(e)}')
        return {
            'statusCode': 500,
            'headers': cors_headers(),
            'body': json.dumps({'error': 'Internal server error'}),
        }


def cors_headers() -> dict:
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://aieverydaytutor.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    }
