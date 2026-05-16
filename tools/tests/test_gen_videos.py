"""
Tests for gen-videos.py

Uses tmp_path fixtures — no AWS, no network.
"""

import json
import sys
from pathlib import Path

import pytest

# Make tools/ importable without a package install
sys.path.insert(0, str(Path(__file__).parent.parent))

import importlib

gen_videos = importlib.import_module("gen-videos")

parse_args = gen_videos.parse_args
run = gen_videos.run


# ── Helpers ───────────────────────────────────────────────────────────────────


def make_md(
    kb_dir: Path,
    stem: str,
    *,
    video_id: str | None = None,
    title: str = "Test Video Title",
    description: str = "A short description.",
    publish_date: str = "2026-01-15",
    thumbnail: str | None = None,
    youtube_url: str = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
) -> Path:
    """Write a valid (by default) MD file with YAML frontmatter."""
    actual_video_id = video_id if video_id is not None else stem
    actual_thumbnail = thumbnail if thumbnail is not None else f"{actual_video_id}.png"
    content = (
        "---\n"
        f"videoId: {actual_video_id}\n"
        f"title: {title}\n"
        f"description: {description}\n"
        f"publishDate: '{publish_date}'\n"
        f"thumbnail: {actual_thumbnail}\n"
        f"youtubeUrl: {youtube_url}\n"
        "---\n\n"
        "Body text here.\n"
    )
    path = kb_dir / f"{stem}.md"
    path.write_text(content, encoding="utf-8")
    return path


def make_thumbnail(thumbs_dir: Path, video_id: str) -> Path:
    """Create a stub PNG file for the given videoId."""
    path = thumbs_dir / f"{video_id}.png"
    path.write_bytes(b"\x89PNG\r\n\x1a\n")  # minimal PNG header stub
    return path


def make_args(
    kb_dir: Path,
    thumbs_dir: Path,
    output: Path,
    dry_run: bool = False,
) -> object:
    """Build a Namespace matching what parse_args() would produce."""
    argv = [
        "--knowledge-base-dir",
        str(kb_dir),
        "--thumbnails-dir",
        str(thumbs_dir),
        "--output",
        str(output),
    ]
    if dry_run:
        argv.append("--dry-run")
    return parse_args(argv)


# ── Tests ─────────────────────────────────────────────────────────────────────


class TestSingleValidVideo:
    """Single valid MD file produces correct JSON structure."""

    def test_output_content(self, tmp_path: Path) -> None:
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        make_thumbnail(thumbs, "v_intro")
        make_md(
            kb,
            "v_intro",
            title="Intro to AI",
            description="Learn AI basics.",
            publish_date="2026-03-10",
            youtube_url="https://www.youtube.com/watch?v=abcdefghijk",
        )

        args = make_args(kb, thumbs, output)
        exit_code = run(args)

        assert exit_code == 0
        assert output.exists()
        data = json.loads(output.read_text())
        assert isinstance(data, list)
        assert len(data) == 1

        record = data[0]
        assert record["videoId"] == "v_intro"
        assert record["title"] == "Intro to AI"
        assert record["description"] == "Learn AI basics."
        assert record["publishDate"] == "2026-03-10"
        assert record["thumbnail"] == "v_intro.png"
        assert record["youtubeUrl"] == "https://www.youtube.com/watch?v=abcdefghijk"


class TestSortByPublishDate:
    """Three MDs with different publishDates are sorted DESC."""

    def test_sorted_desc(self, tmp_path: Path) -> None:
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        for vid, pd in [
            ("v_alpha", "2026-01-01"),
            ("v_beta", "2026-03-15"),
            ("v_gamma", "2026-02-20"),
        ]:
            make_thumbnail(thumbs, vid)
            make_md(kb, vid, publish_date=pd)

        args = make_args(kb, thumbs, output)
        exit_code = run(args)

        assert exit_code == 0
        data = json.loads(output.read_text())
        dates = [r["publishDate"] for r in data]
        assert dates == ["2026-03-15", "2026-02-20", "2026-01-01"]


class TestSortTiebreakByVideoId:
    """Two MDs with the same publishDate are sorted by videoId ASC."""

    def test_tiebreak_asc(self, tmp_path: Path) -> None:
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        for vid in ["v_zebra", "v_apple"]:
            make_thumbnail(thumbs, vid)
            make_md(kb, vid, publish_date="2026-05-01")

        args = make_args(kb, thumbs, output)
        exit_code = run(args)

        assert exit_code == 0
        data = json.loads(output.read_text())
        assert [r["videoId"] for r in data] == ["v_apple", "v_zebra"]


class TestMissingRequiredFields:
    """Missing frontmatter fields produce non-zero exit and stderr output."""

    def _run_missing_field(
        self, tmp_path: Path, field_to_omit: str, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        make_thumbnail(thumbs, "v_test")

        # Build frontmatter manually without the omitted field
        fields = {
            "videoId": "v_test",
            "title": "A Title",
            "description": "A description.",
            "publishDate": "2026-01-01",
            "thumbnail": "v_test.png",
            "youtubeUrl": "https://www.youtube.com/watch?v=abcdefghijk",
        }
        del fields[field_to_omit]

        lines = ["---\n"]
        for k, v in fields.items():
            lines.append(f"{k}: {v}\n")
        lines.append("---\n\nBody.\n")
        (kb / "v_test.md").write_text("".join(lines), encoding="utf-8")

        args = make_args(kb, thumbs, output)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "v_test.md" in captured.err
        assert field_to_omit in captured.err

    def test_missing_title(self, tmp_path: Path, capsys: pytest.CaptureFixture) -> None:
        self._run_missing_field(tmp_path, "title", capsys)

    def test_missing_description(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "description", capsys)

    def test_missing_youtube_url(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "youtubeUrl", capsys)

    def test_missing_video_id(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "videoId", capsys)

    def test_missing_publish_date(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "publishDate", capsys)

    def test_missing_thumbnail(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        self._run_missing_field(tmp_path, "thumbnail", capsys)


class TestVideoIdMismatch:
    """videoId that doesn't match the filename produces non-zero exit."""

    def test_mismatch(self, tmp_path: Path, capsys: pytest.CaptureFixture) -> None:
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        make_thumbnail(thumbs, "v_correct")
        # Filename is v_correct.md but videoId says v_wrong
        make_md(kb, "v_correct", video_id="v_wrong", thumbnail="v_wrong.png")

        args = make_args(kb, thumbs, output)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "v_correct.md" in captured.err
        assert "videoId" in captured.err


class TestInvalidYoutubeUrl:
    """Bad youtubeUrl patterns produce non-zero exit."""

    @pytest.mark.parametrize(
        "bad_url",
        [
            "https://youtu.be/dQw4w9WgXcQ",
            "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=short",
            "https://www.youtube.com/watch?v=toolongIDhere12",
            "https://www.youtube.com/watch?v=invalid!chars",
            "",
        ],
    )
    def test_bad_url(
        self, bad_url: str, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        make_thumbnail(thumbs, "v_test")
        make_md(kb, "v_test", youtube_url=bad_url)

        args = make_args(kb, thumbs, output)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "v_test.md" in captured.err
        assert "youtubeUrl" in captured.err


class TestMissingThumbnailFile:
    """Thumbnail field value is correct but the file is absent → non-zero exit."""

    def test_missing_file(self, tmp_path: Path, capsys: pytest.CaptureFixture) -> None:
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        # No make_thumbnail call — file intentionally absent
        make_md(kb, "v_test")

        args = make_args(kb, thumbs, output)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "v_test.md" in captured.err
        assert "thumbnail" in captured.err


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
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        make_thumbnail(thumbs, "v_test")
        make_md(kb, "v_test", publish_date=bad_date)

        args = make_args(kb, thumbs, output)
        exit_code = run(args)

        assert exit_code != 0
        captured = capsys.readouterr()
        assert "v_test.md" in captured.err
        assert "publishDate" in captured.err


class TestEmptyKnowledgeBaseDir:
    """Empty videos dir writes [] and exits 0."""

    def test_empty_dir(self, tmp_path: Path) -> None:
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        args = make_args(kb, thumbs, output)
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
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        make_thumbnail(thumbs, "v_intro")
        make_md(kb, "v_intro", publish_date="2026-04-01")

        args = make_args(kb, thumbs, output, dry_run=True)
        exit_code = run(args)

        assert exit_code == 0
        assert not output.exists(), "Output file must NOT be written in dry-run mode"

        captured = capsys.readouterr()
        data = json.loads(captured.out)
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["videoId"] == "v_intro"

    def test_dry_run_empty_dir(
        self, tmp_path: Path, capsys: pytest.CaptureFixture
    ) -> None:
        kb = tmp_path / "videos"
        kb.mkdir()
        thumbs = tmp_path / "thumbnails"
        thumbs.mkdir()
        output = tmp_path / "videos.json"

        args = make_args(kb, thumbs, output, dry_run=True)
        exit_code = run(args)

        assert exit_code == 0
        assert not output.exists()
        captured = capsys.readouterr()
        assert json.loads(captured.out) == []
