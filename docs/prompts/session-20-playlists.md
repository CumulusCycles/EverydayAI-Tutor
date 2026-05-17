# Session 20 — Playlists

**Branch:** `feature/playlists`
**PR:** TBD

---

## Prompts

> What if we add Playlists to the site? We can add a Playlists section under the Videos section on the Homepage and Videos pages. We do not need a Playlists page. When someone clicks on a video card, it brings them to the video page on YT, and the same when they click a Playlist card. Videos and Playlists will prob have the same props when creating them in the Repo, but we should prob add an isPlaylist prop which defaults to False. Does that make sense? Do you think adding the Playlists is a good idea? If so, how would you implement it?

> yes, and make implementation decisions. Ensure you add / update ALL appropriate files (including .md files, CLAUDE config files, mem) as appropriate

---

## Implementation Decisions

- **`type: 'video' | 'playlist'`** field on the `Video` interface — not a boolean `isPlaylist`. Reads more clearly at the data level and is easier to extend.
- **ID prefixes:** videos use `v_`, playlists use `p_` — enforced by the generator, validated against the declared type.
- **Same directory:** both live in `knowledge-base/videos/` — no restructuring needed.
- **Same thumbnail path:** `frontend/public/thumbnails/video/` for both types.
- **Flat JSON array:** generator outputs one sorted array; frontend splits by `type`. No separate generator or JSON file.
- **`type` defaults to `video`:** existing MD files with no `type` field need zero changes.
- **Link text:** `"Watch on YouTube"` for videos, `"View Playlist"` for playlists — passed as prop to `ContentCard` which is unchanged.
- **No new route:** playlists appear as a section on `/videos` and as a preview on `/`; no `/playlists` page.

---

## What Was Built

### Generator (`tools/gen-videos.py`)
- Added `YOUTUBE_PLAYLIST_URL_RE` regex for `youtube.com/playlist?list=<id>`
- Added `PLAYLIST_ID_RE` for `p_` prefix validation
- `validate_video_id` now accepts `item_type` param — enforces `v_` for videos, `p_` for playlists
- `validate_youtube_url` now accepts `item_type` param — routes to correct URL regex
- Added `type` field validation (must be `"video"` or `"playlist"`; invalid type is an early-exit error)
- `post_to_record` includes `type` in output (defaults to `"video"` when absent)

### Tests (`tools/tests/test_gen_videos.py`)
- 36 tests total (up from 26)
- Added: `TestSingleValidVideo::test_type_defaults_to_video_when_absent`
- Added: `TestSingleValidPlaylist` class
- Added: `TestMixedVideosAndPlaylists` class
- Added: `TestInvalidType` class
- Added: `TestPlaylistIdPrefix` class (two tests: v_ on playlist fails, p_ on video fails)
- Added: `TestInvalidYoutubeUrl::test_bad_playlist_url` parametrized group

### Frontend types (`src/types/content.ts`)
- Added `type: 'video' | 'playlist'` to `Video` interface

### `VideosPage.tsx`
- Split `videosData` into `videos` and `playlists` by `type`
- Videos rendered in existing grid section
- New "Playlists" section below on `bg-brand-beige`; each card uses `linkText="View Playlist"`
- Both sections have independent empty states

### `HomePage.tsx`
- Split `videosData` into videos and playlists
- Existing "Latest Videos" section unchanged
- New "Latest Playlist" section on `bg-brand-beige` between Latest Videos and CTA Banner
- Empty state: "Curated playlists are on the way."

### Tests
- `VideosPage.test.tsx` — new file, 11 tests: both empty, videos populated, playlists populated, both populated
- `HomePage.test.tsx` — updated: replaced blog mocks with playlist mocks; added playlist empty state and populated tests

### Docs and config updated
- `docs/runbooks/New_Video.md` — reframed as "Videos and Playlists" runbook; added playlist steps, playlist frontmatter template, `type` field in table
- `docs/ux/site-structure.md` — updated overview, pages table, ContentCard section, Home sections, Videos page sections
- `docs/tech/tech-stack.md` — updated content pipeline section
- `knowledge-base/website/site-overview.md` — added playlists mention
- `knowledge-base/website/details.md` — updated Content Structure section
- `CLAUDE.md` — updated Tools quick reference
- `.claude/rules/frontend.md` — updated Video interface, import pattern, routing table
- `.claude/rules/project.md` — updated overview and current scope
- `.claude/agents/python-agent.md` — updated gen-videos.py description and test count

---

## Verification

- 36 Python tests passing
- 49 unit tests passing (up from 33 — added VideosPage.test.tsx with 11 tests, updated HomePage.test.tsx)
- Production build clean
- ESLint clean
