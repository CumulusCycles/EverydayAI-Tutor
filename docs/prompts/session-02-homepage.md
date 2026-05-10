# Session 02 — Homepage

**Branch:** `feature/homepage`
**Date:** May 9, 2026

---

## Goal

Build the homepage and all shared components — Navbar, Footer, ContentCard — using the mockup as visual reference. Set up static data files and TypeScript types.

---

## Prompts

### Prompt 1

> Using docs/ux/mockup-homepage.html as the visual reference and docs/branding/brand.md for brand guidelines, build the homepage.
>
> Create the following:
>
> 1. src/components/Navbar.tsx — sticky top nav with logo (using docs/branding/images/yt-channel-logo.png), nav links (Home, Videos, Blog, About), and an orange Subscribe CTA button linking to https://www.youtube.com/@EverydayAITutor in a new tab
>
> 2. src/components/Footer.tsx — three column layout with logo + tagline (left), nav links (center), YouTube subscribe button (right), and a bottom bar with copyright and Privacy Policy link
>
> 3. src/components/ContentCard.tsx — reusable card component with thumbnail image, title, description, publish date, and external link. Used for both videos and blog posts.
>
> 4. src/types/content.ts — TypeScript interfaces for Video and BlogPost
>
> 5. src/data/videos.ts — static data file with at least 2 sample video entries using the existing thumbnail at docs/branding/images/yt-channel-video-thumbnail.png
>
> 6. src/data/posts.ts — static data file with at least 2 sample blog post entries
>
> 7. src/pages/HomePage.tsx — full homepage matching the mockup: hero section, "What You'll Learn" section, Latest Videos (3 cards), Latest Blog Posts (3 cards), and CTA banner
>
> 8. Update src/App.tsx to use Navbar and Footer as shared layout wrappers around all routes
>
> Match the look and feel of the mockup as closely as possible — colors, typography, spacing, and layout. Use Tailwind CSS v4 utility classes. Run lint and build checks when done.

### Result

⏺ Everything passes. Here's a summary of what was built:

  ---
  What was created
  
  src/types/content.ts — Video and BlogPost interfaces (strict TypeScript, optional thumbnailUrl)

  src/data/videos.ts — 3 sample video entries; first has the real thumbnail, two are "coming soon" (empty publishDate, no thumbnailUrl)

  src/data/posts.ts — 3 sample blog post entries with ISO dates

  src/components/ContentCard.tsx — Reusable card for both videos and posts. Renders the thumbnail image or a gradient placeholder when none. Formats ISO dates to "Month Day, Year";
  empty date shows "Coming soon". External link with target="_blank" rel="noopener noreferrer".

  src/components/Navbar.tsx — Sticky top nav. Logo links home; NavLink highlights the active route in orange. Subscribe button always visible. Hamburger toggle for mobile (nav links
  collapse into a dropdown, subscribe stays in the top bar).

  src/components/Footer.tsx — Three-column layout (brand left, nav center, YouTube right), bottom bar with copyright and Privacy Policy link.

  src/pages/HomePage.tsx — Full homepage matching the mockup:
  - Hero: eyebrow pill, large headline with orange accent, subtitle, CTA + hero image
  - "What You'll Learn": 4-card beige grid with emoji icons
  - Latest Videos: 3 ContentCards + "View all videos →" link
  - Latest Blog Posts: 3 ContentCards + "View all posts →" link
  - CTA Banner: navy background, orange accent on heading
  
  src/App.tsx — Navbar + <main> + Footer wrap all routes. The other 4 pages are still stubs.

  public/ — logo.png, thumbnail.png, and favicon.ico copied from docs/branding/images/

  All checks passed: TypeScript · ESLint · Prettier · vite build (567ms, 244kB JS, 13.5kB CSS)

  ---
  Next steps
  
  1. Run /commit to lint + build + commit this work, then /pr to open the PR
  2. Build remaining pages — Videos, Blog, About, Privacy (each has stubs ready in App.tsx)
  3. Write first tests — Navbar.test.tsx, ContentCard.test.tsx, and E2E smoke tests in frontend/e2e/

---