#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"

# Parse file_path from the PostToolUse JSON payload (stdin)
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    print(json.load(sys.stdin).get('tool_input', {}).get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

EXT="${FILE_PATH##*.}"

case "$EXT" in
  ts|tsx)
    # Only format files that live inside the frontend directory
    if [[ "$FILE_PATH" == "$FRONTEND_DIR"/* ]]; then
      cd "$FRONTEND_DIR"
      pnpm exec eslint --fix "$FILE_PATH" 2>/dev/null || true
      pnpm exec prettier --write "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  py)
    uv run ruff check --fix "$FILE_PATH" 2>/dev/null || true
    uv run ruff format "$FILE_PATH" 2>/dev/null || true
    ;;
esac
