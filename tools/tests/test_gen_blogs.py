"""
Tests for gen-blogs.py

Uses tmp_path fixtures — no AWS, no network.
"""

import json
import sys
from pathlib import Path

import pytest

# Make tools/ importable without a package install
sys.path.insert(0, str(Path(__file__).parent.parent))

import importlib

gen_blogs = importlib.import_module("gen-blogs")

parse_args = gen_blogs.parse_args
run = gen_blogs.run


# ── Helpers ───────────────────────────────────────────────────────────────────


def make_md(
    kb_dir: Path,
    stem: str,
    *,
    post_id: str | None = None,
    title: str = "Test Blog Post",
    description: str = "A short description.",
    publish_date: str = "2026-01-15",
    post_url: str = "https://aieverydaytutor.com/blog/test",
    thumbnail: str | None = "OMIT",
) -> Path:
    """Write a valid (by default) MD file with YAML frontmatter.

    Pass thumbnail=None to include an empty thumbnail field.
    Pass thumbnail="OMIT" to omit the thumbnail field entirely.
    Pass a non-empty string to include that value as the thumbnail.
    """
    actual_post_id = post_id if post_id is not None else stem
    lines = [
        "---\n",
        f"postId: {actual_post_id}\n",
        f"title: {title}\n",
        f"description: {description}\n",
        f"publishDate: '{publish_date}'\n",
    ]
    if thumbnail != "OMIT":
        lines.append(f"thumbnail: {thumbnail}\n")
    lines.append(f"postUrl: {post_url}\n")
    lines.append("---\n\nBody text here.\n")

    path = kb_dir / f"{stem}.md"
    path.write_text("".join(lines), encoding="utf-8")
    return path


def make_args(
    kb_dir: Path,
    output: Path,
    thumbnails_dir: Path,
    dry_run: bool = False,
) -> object:
    """Build a Namespace matching what parse_args() would produce."""
    argv = [
        "--knowledge-base-dir",
        str(kb_dir),
        "--thumbnails-dir",
        str(thumbnails_dir),
        "--output",
        str(output),
    ]
    if dry_run:
        argv.append("--dry-run")
    return parse_args(argv)


# ── Tests ─────────────────────────────────────────────────────────────────────


class TestSingleValidBlogWithThumbnail:
    """Single valid MD file with all fields produces correct JSON structure."""

    def test_output_content(self, tmp_path: Path) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        (thumbs / "my-first-post.png").touch()

        make_md(
            kb,
            "my-first-post",
            title="My First Post",
            description="Learn AI basics.",
            publish_date="2026-03-10",
            post_url="https://aieverydaytutor.com/blog/my-first-post",
            thumbnail="my-first-post.png",
        )

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code == 0
        assert output.exists()
        data = json.loads(output.read_text())
        assert isinstance(data, list)
        assert len(data) == 1

        record = data[0]
        assert record["postId"] == "my-first-post"
        assert record["title"] == "My First Post"
        assert record["description"] == "Learn AI basics."
        assert record["publishDate"] == "2026-03-10"
        assert record["postUrl"] == "https://aieverydaytutor.com/blog/my-first-post"
        assert record["thumbnail"] == "my-first-post.png"


class TestSortByPublishDate:
    """Three MDs with different publishDates are sorted DESC."""

    def test_sorted_desc(self, tmp_path: Path) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        for stem, pd in [
            ("alpha-post", "2026-01-01"),
            ("beta-post", "2026-03-15"),
            ("gamma-post", "2026-02-20"),
        ]:
            (thumbs / f"{stem}.png").touch()
            make_md(
                kb,
                stem,
                post_url=f"https://aieverydaytutor.com/blog/{stem}",
                publish_date=pd,
                thumbnail=f"{stem}.png",
            )

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code == 0
        data = json.loads(output.read_text())
        dates = [r["publishDate"] for r in data]
        assert dates == ["2026-03-15", "2026-02-20", "2026-01-01"]


class TestSortTiebreakByPostId:
    """Two MDs with the same publishDate are sorted by postId ASC."""

    def test_tiebreak_asc(self, tmp_path: Path) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        for stem in ["zebra-post", "apple-post"]:
            (thumbs / f"{stem}.png").touch()
            make_md(
                kb,
                stem,
                post_url=f"https://aieverydaytutor.com/blog/{stem}",
                publish_date="2026-05-01",
                thumbnail=f"{stem}.png",
            )

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code == 0
        data = json.loads(output.read_text())
        assert [r["postId"] for r in data] == ["apple-post", "zebra-post"]


class TestMissingRequiredFields:
    """Missing frontmatter fields produce non-zero exit and stderr output."""

    def _run_missing_field(
        self, tmp_path: Path, field_to_omit: str, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        (thumbs / "test-post.png").touch()

        # Build frontmatter manually without the omitted field
        fields: dict = {
            "postId": "test-post",
            "title": "A Title",
            "description": "A description.",
            "publishDate": "2026-01-01",
            "thumbnail": "test-post.png",
            "postUrl": "https://aieverydaytutor.com/blog/test-post",
        }
        del fields[field_to_omit]

        lines = ["---\n"]
        for k, v in fields.items():
            lines.append(f"{k}: {v}\n")
        lines.append("---\n\nBody.\n")
        (kb / "test-post.md").write_text("".join(lines), encoding="utf-8")

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "test-post.md" in captured.err
        assert field_to_omit in captured.err

    def test_missing_title(self, tmp_path: Path, capsys: pytest.CaptureFixture) -> None:
        self._run_missing_field(tmp_path, "title", capsys)

    def test_missing_description(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "description", capsys)

    def test_missing_post_url(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "postUrl", capsys)

    def test_missing_post_id(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "postId", capsys)

    def test_missing_publish_date(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "publishDate", capsys)

    def test_missing_thumbnail(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "thumbnail", capsys)


class TestPostIdMismatch:
    """postId that doesn't match the filename produces non-zero exit."""

    def test_mismatch(self, tmp_path: Path, capsys: pytest.CaptureFixture) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        (thumbs / "correct-post.png").touch()

        # Filename is correct-post.md but postId says wrong-post
        make_md(
            kb,
            "correct-post",
            post_id="wrong-post",
            post_url="https://aieverydaytutor.com/blog/correct-post",
            thumbnail="correct-post.png",
        )

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "correct-post.md" in captured.err
        assert "postId" in captured.err


class TestInvalidPublishDate:
    """Invalid publishDate formats produce non-zero exit."""

    @pytest.mark.parametrize(
        "bad_date",
        [
            "15-01-2026",  # wrong order
            "2026/01/15",  # wrong separator
            "not-a-date",
            "2026-13-01",  # month 13
            "2026-02-30",  # Feb 30 doesn't exist
            "20260115",  # missing separators
        ],
    )
    def test_bad_date(
        self, bad_date: str, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        (thumbs / "test-post.png").touch()
        make_md(kb, "test-post", publish_date=bad_date, thumbnail="test-post.png")

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "test-post.md" in captured.err
        assert "publishDate" in captured.err


class TestInvalidPostUrl:
    """Bad postUrl patterns produce non-zero exit."""

    @pytest.mark.parametrize(
        "bad_url",
        [
            "ftp://aieverydaytutor.com/blog/post",
            "//aieverydaytutor.com/blog/post",
            "aieverydaytutor.com/blog/post",
            "",
        ],
    )
    def test_bad_url(
        self, bad_url: str, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        (thumbs / "test-post.png").touch()
        make_md(kb, "test-post", post_url=bad_url, thumbnail="test-post.png")

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "test-post.md" in captured.err
        assert "postUrl" in captured.err


class TestThumbnailPresentButEmpty:
    """thumbnail key present but empty string produces non-zero exit."""

    def test_empty_thumbnail(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        # Write MD with an explicit empty thumbnail value
        content = (
            "---\n"
            "postId: test-post\n"
            "title: A Title\n"
            "description: A description.\n"
            "publishDate: '2026-01-01'\n"
            "thumbnail: \n"
            "postUrl: https://aieverydaytutor.com/blog/test-post\n"
            "---\n\nBody.\n"
        )
        (kb / "test-post.md").write_text(content, encoding="utf-8")

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "test-post.md" in captured.err
        assert "thumbnail" in captured.err


class TestMissingThumbnailFile:
    """thumbnail value is non-empty but the file doesn't exist in thumbnails-dir."""

    def test_file_not_found(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        # Do NOT create the thumbnail file in thumbs/
        make_md(
            kb,
            "test-post",
            post_url="https://aieverydaytutor.com/blog/test-post",
            thumbnail="test-post.png",
        )

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "test-post.md" in captured.err
        assert "thumbnail" in captured.err


class TestMissingThumbnailField:
    """thumbnail field entirely absent from frontmatter produces non-zero exit."""

    def test_field_absent(self, tmp_path: Path, capsys: pytest.CaptureFixture) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        # Pass thumbnail="OMIT" to make_md so the field is not written at all
        make_md(
            kb,
            "test-post",
            post_url="https://aieverydaytutor.com/blog/test-post",
            thumbnail="OMIT",
        )

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "test-post.md" in captured.err
        assert "thumbnail" in captured.err


class TestEmptyKnowledgeBaseDir:
    """Empty blogs dir writes [] and exits 0."""

    def test_empty_dir(self, tmp_path: Path) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        args = make_args(kb, output, thumbs)
        exit_code = run(args)

        assert exit_code == 0
        assert output.exists()
        data = json.loads(output.read_text())
        assert data == []


class TestDryRun:
    """--dry-run prints JSON to stdout and does NOT write the output file."""

    def test_dry_run_stdout(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        (thumbs / "my-post.png").touch()
        make_md(
            kb,
            "my-post",
            post_url="https://aieverydaytutor.com/blog/my-post",
            publish_date="2026-04-01",
            thumbnail="my-post.png",
        )

        args = make_args(kb, output, thumbs, dry_run=True)
        exit_code = run(args)

        assert exit_code == 0
        assert not output.exists(), "Output file must NOT be written in dry-run mode"

        captured = capsys.readouterr()
        data = json.loads(captured.out)
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["postId"] == "my-post"

    def test_dry_run_empty_dir(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "blogs"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "blogs.json"

        args = make_args(kb, output, thumbs, dry_run=True)
        exit_code = run(args)

        assert exit_code == 0
        assert not output.exists()
        captured = capsys.readouterr()
        assert json.loads(captured.out) == []
