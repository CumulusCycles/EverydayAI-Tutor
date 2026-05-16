# EverydayAI Tutor — Site Structure
# docs/ux/site-structure.md

---

## Overview

AIEverydayTutor.com is a channel hub — a clean, branded landing site that introduces the EverydayAI Tutor YouTube channel, showcases videos and playlists, and lists blog posts published across external platforms.

**Primary purpose at launch:** Present the EverydayAI Tutor brand and content in one place, with clear pathways to external content (YouTube, blog platforms).

**Primary CTA across the site:** Subscribe to the YouTube channel.

---

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, channel intro, latest videos, latest blog posts, subscribe CTA |
| Videos | `/videos` | Full card listing of playlists and videos |
| Blog | `/blog` | Full card listing of blog posts |
| About | `/about` | Channel mission, host background, what viewers will learn |
| Built with AI | `/built-with` | How the site was built using Claude Code and AWS |
| Privacy Policy | `/privacy` | Minimal privacy statement — no personal data collected |
| Not Found | `*` | 404 fallback page |

---

## Navigation

### Top Nav
- **Left:** Logo (links to Home)
- **Center:** Home, Videos, Blog, About
- **Right:** Subscribe button (orange, CTA style) → `https://www.youtube.com/@EverydayAITutor`

### Mobile
- Hamburger menu for center nav links
- Subscribe button remains visible

---

## Shared Components

### ContentCard
Reusable card component used on both Videos and Blog pages (and previews on Home).

| Field | Description |
|---|---|
| Thumbnail | Image |
| Title | Post or video title |
| Description | Short description or excerpt |
| Publish Date | Date published |
| External Link | Links out to YouTube video/playlist or blog platform post |

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
- 3 most recent ContentCards
- "View All Videos" link → `/videos`

**4. Latest Blog Posts**
- Section heading: "Latest Posts"
- 3 most recent ContentCards
- "View All Posts" link → `/blog`

**5. Subscribe CTA Banner**
- Full-width section
- "Ready to start learning AI?" or similar
- Subscribe button → YouTube channel

---

### Videos `/videos`

**Goal:** Showcase all playlists and videos in a clean, browsable card grid.

#### Sections

**1. Page Header**
- Title: "Videos"
- Short intro: "Practical AI tutorials for everyday people — from complete beginner to confident AI user."

**2. Video Card Grid**
- Full listing of all videos/playlists as ContentCards
- Ordered by publish date (newest first)
- Each card links to YouTube video or playlist

---

### Blog `/blog`

**Goal:** Showcase all blog posts in a clean, browsable card grid with links to external platforms.

#### Sections

**1. Page Header**
- Title: "Blog"
- Short intro: "Articles, guides, and practical tips on using AI in everyday life."

**2. Blog Card Grid**
- Full listing of all blog posts as ContentCards
- Ordered by publish date (newest first)
- Each card links to the external blog post (Medium, Substack, etc.)
- Opens in new tab

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
- Nav links: Home, Videos, Blog, About

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
| Blog Posts | `knowledge-base/blogs/<postId>.md` | Same pipeline (future — not yet implemented) |
| Chatbot KB | All `knowledge-base/**` MD files | CI syncs to Bedrock S3 bucket → ingestion job updates vector store |

To publish a new video: commit the MD file + thumbnail PNG, open a PR, merge. CI handles the rest. See `docs/runbooks/New_Video.md` for the full workflow.

---

## External Links

| Destination | URL |
|---|---|
| YouTube Channel | `https://www.youtube.com/@EverydayAITutor` |
| Blog posts | Various external platforms (Medium, Substack, etc.) |

All external links open in a new tab (`target="_blank"` with `rel="noopener noreferrer"`).
