# EverydayAI Tutor — Site Structure
# docs/ux/site-structure.md

---

## Overview

AIEverydayTutor.com is a channel hub — a clean, branded landing site that introduces the EverydayAI Tutor YouTube channel and showcases videos and playlists.

**Primary purpose at launch:** Present the EverydayAI Tutor brand and content in one place, with clear pathways to external content (YouTube).

**Primary CTA across the site:** Subscribe to the YouTube channel.

---

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, channel intro, latest video, latest playlist, subscribe CTA |
| Videos | `/videos` | Videos grid + Playlists section |
| About | `/about` | Channel mission, host background, what viewers will learn |
| Built with AI | `/built-with` | How the site was built using Claude Code and AWS |
| Privacy Policy | `/privacy` | Minimal privacy statement — no personal data collected |
| Not Found | `*` | 404 fallback page |

---

## Navigation

### Top Nav
- **Left:** Logo (links to Home)
- **Center:** Home, Videos, About
- **Right:** Subscribe button (orange, CTA style) → `https://www.youtube.com/@EverydayAITutor`

### Mobile
- Hamburger menu for center nav links
- Subscribe button remains visible

---

## Shared Components

### ContentCard
Reusable card component used for both videos and playlists on the Videos page and Home.

| Field | Description |
|---|---|
| Thumbnail | Image |
| Title | Video or playlist title |
| Description | Short description or excerpt |
| Publish Date | Date published |
| External Link | "Watch on YouTube" for videos; "View Playlist" for playlists |

Cards open external links in a new tab.

---

## Page Details

---

### Home `/`

**Goal:** Immediately communicate what EverydayAI Tutor is, build trust, and drive YouTube subscriptions.

#### Sections (top to bottom)

**1. Hero**
- Channel logo
- Headline: "Practical AI for Everyday People"
- Subheadline: "From Curious Beginner to Confident AI User"
- Subscribe CTA button (orange) → YouTube channel
- Channel banner image as hero background or supporting visual

**2. What You'll Learn**
- Brief, scannable overview of the learning journey
- 3–4 simple icons with short labels (e.g. Understand AI, Use AI Tools, Master Prompting, Build with AI)

**3. Latest Videos**
- Section heading: "Latest Videos"
- 1 most recent video ContentCard

**4. Latest Playlist**
- Section heading: "Latest Playlist"
- 1 most recent playlist ContentCard

**5. Subscribe CTA Banner**
- Full-width section
- "Ready to start learning AI?" or similar
- Subscribe button → YouTube channel

---

### Videos `/videos`

**Goal:** Showcase all videos and playlists in a clean, browsable layout.

#### Sections

**1. Page Header**
- Title: "Videos"
- Short intro: "Practical AI tutorials for everyday people — from complete beginner to confident AI user."

**2. Videos Grid**
- Full listing of all videos as ContentCards
- Ordered by publish date (newest first)
- Each card links to YouTube video
- Link text: "Watch on YouTube"

**3. Playlists Section**
- Full listing of all playlists as ContentCards
- Ordered by publish date (newest first)
- Each card links to YouTube playlist
- Link text: "View Playlist"

---

### About `/about`

**Goal:** Build trust and personal connection. Help visitors understand who is behind the channel and why it exists.

#### Sections

**1. Page Header**
- Title: "About EverydayAI Tutor"

**2. Mission**
- What the channel is about
- Who it's for
- The learning journey from beginner to confident AI user

**3. Host**
- Brief bio
- Background and credibility
- Photo (optional at launch)

**4. Subscribe CTA**
- Subscribe button → YouTube channel

---

### Privacy Policy `/privacy`

**Goal:** Simple, honest disclosure. No legal jargon.

#### Content
- We do not currently collect any personal information
- No analytics or tracking
- No cookies beyond what is technically necessary
- Policy will be updated if new features require data collection
- Contact information for privacy questions

#### Notes
- Not linked in main navigation
- Linked in footer bottom bar only
- Keep it short and plain English

---

## Footer

### Layout (three columns)

**Left:**
- Channel logo
- Tagline: "Practical AI for Everyday People"

**Center:**
- Nav links: Home, Videos, About

**Right:**
- Subscribe button/link → `https://www.youtube.com/@EverydayAITutor`

### Bottom Bar
```
© 2026 EverydayAI Tutor.  |  Privacy Policy
```

---

## Content Management

Content is authored as Markdown files in `knowledge-base/` — no CMS, no database, no code edits to publish.

| Content Type | Source | How it reaches the site |
|---|---|---|
| Videos | `knowledge-base/videos/<videoId>.md` | CI runs `tools/gen-videos.py` → generates `frontend/src/data/videos.json` → bundled by Vite |
| Chatbot KB | All `knowledge-base/**` MD files | CI syncs to Bedrock S3 bucket → ingestion job updates vector store |

To publish a new video or playlist: commit the MD file + thumbnail PNG, open a PR, merge. CI handles the rest.
- Videos and playlists: see `docs/runbooks/New_Video.md`

---

## External Links

| Destination | URL |
|---|---|
| YouTube Channel | `https://www.youtube.com/@EverydayAITutor` |

All external links open in a new tab (`target="_blank"` with `rel="noopener noreferrer"`).
