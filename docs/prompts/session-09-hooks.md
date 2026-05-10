# Session 09 — Claude Code Hooks

**Branch:** `setup/hooks`
**Date:** May 10, 2026

---

## Goal

Add PostToolUse hooks to `.claude/settings.json` to auto-format files after every Claude Code edit — TS/TSX via ESLint + Prettier, Python via ruff (check + format) using uv.

---

## Prompts

### Prompt 1

> Add a PostToolUse hooks section to `.claude/settings.json`. After any file edit or write, auto-format TS/TSX files using ESLint + Prettier via pnpm (from the frontend directory), and Python files using ruff check + ruff format via uv. Use a shell script at `.claude/scripts/post-edit-format.sh` and call it from the hook. Don't touch the existing mcpServers config.

### Result

Valid JSON, mcpServers untouched. Here's what was set up:

  .claude/scripts/post-edit-format.sh
  - Reads the PostToolUse JSON payload from stdin and extracts tool_input.file_path
  - TS/TSX: runs eslint --fix then prettier --write via pnpm exec from frontend/ — only triggers for files inside the frontend/ directory (skips infrastructure/*.ts)
  - Python: runs uv run ruff check --fix then uv run ruff format — works from any path
  - All formatter commands use || true so a lint error never blocks the edit

  .claude/settings.json
  - Added PostToolUse hook matching Edit|Write, calling the script via bash .claude/scripts/post-edit-format.sh (relative to the project root)
  - mcpServers block unchanged


---

## Notes

