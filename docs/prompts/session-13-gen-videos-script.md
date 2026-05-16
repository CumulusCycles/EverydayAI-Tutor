# Session 13 — Video Generator Script (Phase 1)

**Branch:** `feature/gen-videos-script`
**PR:** pending
**Date:** May 16, 2026

---

## Goal

Build Phase 1 of the video publishing pipeline: a Python CLI script (`tools/gen-videos.py`) that parses Markdown frontmatter from `knowledge-base/videos/*.md` and generates a static `frontend/src/data/videos.json` file for Vite to bundle at build time.

---

## Prompts

### Prompt 1

> do it

*(In context of: "what are the steps for this feature?" — Phase 1: generator script + tests)*

Built three files using the python-agent:

1. `tools/gen-videos.py` — CLI script accepting `--knowledge-base-dir`, `--thumbnails-dir`, `--output`, and `--dry-run` arguments:
   - Walks all `*.md` files in the videos dir
   - Parses YAML frontmatter with `python-frontmatter`
   - Validates all 6 required fields (`videoId`, `title`, `description`, `publishDate`, `thumbnail`, `youtubeUrl`) with explicit per-field rules
   - Validates thumbnail file exists on disk
   - Collects all validation errors across all files before exiting — surfaces everything in one run
   - Sorts output by `publishDate` DESC, `videoId` ASC as tiebreak
   - Writes sorted JSON array to `--output`, or prints to stdout in `--dry-run` mode
   - If no MD files found: writes `[]` and exits 0

2. `tools/requirements.txt` — `python-frontmatter==1.1.0`, `PyYAML>=6.0`

3. `tools/requirements-dev.txt` — adds `pytest>=8` for local test runs

4. `tools/tests/test_gen_videos.py` — 26 pytest tests using `tmp_path` fixtures (no AWS needed):
   - Single valid MD → correct JSON output
   - Three MDs with different dates → sorted DESC
   - Same `publishDate` → sorted by `videoId` ASC tiebreak
   - Missing required fields (multiple field cases) → non-zero exit, stderr names file and field
   - `videoId` doesn't match filename → non-zero exit
   - `youtubeUrl` fails regex → non-zero exit
   - Thumbnail file missing → non-zero exit
   - Invalid `publishDate` format → non-zero exit
   - Empty videos dir → writes `[]`, exits 0
   - `--dry-run` → prints JSON, does not write file

Also added `.venv-tools/` to `.gitignore` (local Python venv used during development).

### Result

26/26 tests passing. Notable implementation detail: PyYAML silently parses bare `YYYY-MM-DD` values as Python `date` objects. The validator handles both: native `date` objects (already valid, serialised with `.isoformat()`) and string dates (validated via `date.fromisoformat()`). Test fixtures quote `publishDate` values in YAML to ensure the validator's string-path guard is exercised for invalid date cases.

---

## Notes

- Phase 2 (frontend wiring — replace `videos.ts` with `videos.json` import) and Phase 3 (CI integration — add generator as pre-build step in `deploy.yml`) are next
- The script is intentionally dependency-light — no logging framework, just `print(..., file=sys.stderr)` for errors
- `boto3` is absent — no AWS calls in the generator; it's a pure file I/O + validation tool
