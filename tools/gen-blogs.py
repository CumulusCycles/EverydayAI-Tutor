"""
gen-blogs.py — Generate blogs.json from Markdown frontmatter.

Walks all *.md files in --knowledge-base-dir, validates YAML frontmatter,
sorts by publishDate DESC (postId ASC as tiebreak), and writes a JSON array
to --output (or prints to stdout in --dry-run mode).
"""

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

import frontmatter


# ── Required fields and their validators ──────────────────────────────────────

HTTP_URL_RE = re.compile(r"^https?://")
ISO_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
REQUIRED_FIELDS = [
    "postId",
    "title",
    "description",
    "publishDate",
    "thumbnail",
    "postUrl",
]


# ── Validation ────────────────────────────────────────────────────────────────


def validate_post_id(post_id: object, filename_stem: str) -> str | None:
    """Return an error message if postId is invalid, else None."""
    if not isinstance(post_id, str):
        return "must be a string"
    if post_id != filename_stem:
        return f"must match filename (expected '{filename_stem}', got '{post_id}')"
    return None


def validate_publish_date(publish_date: object) -> str | None:
    """Return an error message if publishDate is invalid, else None."""
    if not isinstance(publish_date, str):
        # PyYAML may parse YYYY-MM-DD as a date object
        if isinstance(publish_date, date):
            return None  # valid — will be serialised below
        return "must be a string in YYYY-MM-DD format"
    if not ISO_DATE_RE.match(publish_date):
        return "must be a valid ISO date in YYYY-MM-DD format"
    try:
        date.fromisoformat(publish_date)
    except ValueError:
        return "must be a valid calendar date (YYYY-MM-DD)"
    return None


def validate_post_url(post_url: object) -> str | None:
    """Return an error message if postUrl is invalid, else None."""
    if not isinstance(post_url, str):
        return "must be a string"
    if not HTTP_URL_RE.match(post_url):
        return "must match https?://"
    return None


def validate_thumbnail(thumbnail: object, thumbnails_dir: Path) -> str | None:
    """Return an error message if thumbnail field or file is invalid, else None."""
    if not isinstance(thumbnail, str) or not thumbnail:
        return "must be a non-empty string"
    thumb_path = thumbnails_dir / thumbnail
    if not thumb_path.exists():
        return f"file not found at '{thumb_path}'"
    return None


def validate_post(
    post: frontmatter.Post, md_file: Path, thumbnails_dir: Path
) -> list[str]:
    """
    Validate a parsed frontmatter post.

    Returns a list of error strings (empty list means valid).
    Each error is prefixed with the file name and field name.
    """
    errors: list[str] = []
    filename_stem = md_file.stem
    meta = post.metadata

    # Check all required fields are present
    for field in REQUIRED_FIELDS:
        if field not in meta:
            errors.append(f"{md_file.name}: field '{field}' is missing")

    if errors:
        # No point validating field values when fields are absent
        return errors

    # Validate individual fields
    err = validate_post_id(meta["postId"], filename_stem)
    if err:
        errors.append(f"{md_file.name}: field 'postId' — {err}")

    err = validate_publish_date(meta["publishDate"])
    if err:
        errors.append(f"{md_file.name}: field 'publishDate' — {err}")

    err = validate_thumbnail(meta["thumbnail"], thumbnails_dir)
    if err:
        errors.append(f"{md_file.name}: field 'thumbnail' — {err}")

    err = validate_post_url(meta["postUrl"])
    if err:
        errors.append(f"{md_file.name}: field 'postUrl' — {err}")

    return errors


# ── Serialisation ─────────────────────────────────────────────────────────────


def publish_date_str(raw: object) -> str:
    """Normalise a publishDate value (str or date) to an ISO string."""
    if isinstance(raw, date):
        return raw.isoformat()
    return str(raw)


def post_to_record(post: frontmatter.Post) -> dict:
    """Convert a validated frontmatter post to the output JSON record."""
    meta = post.metadata
    return {
        "postId": meta["postId"],
        "title": meta["title"],
        "description": meta["description"],
        "publishDate": publish_date_str(meta["publishDate"]),
        "thumbnail": meta["thumbnail"],
        "postUrl": meta["postUrl"],
    }


# ── Sorting ───────────────────────────────────────────────────────────────────


def sort_key(record: dict) -> tuple:
    """Sort by publishDate DESC, postId ASC."""
    return (-ord_date(record["publishDate"]), record["postId"])


def ord_date(iso: str) -> int:
    """Convert YYYY-MM-DD to an integer for comparison (higher = more recent)."""
    return int(iso.replace("-", ""))


# ── Entry point ───────────────────────────────────────────────────────────────


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate blogs.json from Markdown frontmatter."
    )
    parser.add_argument(
        "--knowledge-base-dir",
        required=True,
        type=Path,
        help="Path to the folder containing blog post *.md files.",
    )
    parser.add_argument(
        "--thumbnails-dir",
        required=True,
        type=Path,
        help="Path to the folder containing thumbnail image files.",
    )
    parser.add_argument(
        "--output",
        required=True,
        type=Path,
        help="Path to write the output blogs.json.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate and print intended output without writing the file.",
    )
    return parser.parse_args(argv)


def run(args: argparse.Namespace) -> int:
    """
    Main logic. Returns an exit code (0 = success, 1 = error).
    """
    kb_dir: Path = args.knowledge_base_dir
    thumbnails_dir: Path = args.thumbnails_dir
    output: Path = args.output
    dry_run: bool = args.dry_run

    md_files = sorted(kb_dir.glob("*.md"))

    if not md_files:
        result_json = json.dumps([], indent=2)
        if dry_run:
            print(result_json)
        else:
            output.write_text(result_json + "\n", encoding="utf-8")
        return 0

    records: list[dict] = []
    all_errors: list[str] = []

    for md_file in md_files:
        try:
            post = frontmatter.load(str(md_file))
        except Exception as exc:
            all_errors.append(f"{md_file.name}: failed to parse — {exc}")
            continue

        errors = validate_post(post, md_file, thumbnails_dir)
        if errors:
            all_errors.extend(errors)
        else:
            records.append(post_to_record(post))

    if all_errors:
        for err in all_errors:
            print(err, file=sys.stderr)
        return 1

    records.sort(key=sort_key)
    result_json = json.dumps(records, indent=2)

    if dry_run:
        print(result_json)
    else:
        output.write_text(result_json + "\n", encoding="utf-8")

    return 0


def main() -> None:
    args = parse_args()
    sys.exit(run(args))


if __name__ == "__main__":
    main()
