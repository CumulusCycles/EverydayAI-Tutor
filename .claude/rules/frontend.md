# Frontend Rules

## Stack

- **Framework:** React + Vite
- **Language:** TypeScript — strict mode, no `any`
- **Styling:** Tailwind CSS — utility classes only, no custom CSS unless unavoidable
- **Routing:** React Router — client-side routing with clean URLs
- **Package Manager:** pnpm — never npm or yarn

## Project Structure (frontend/)

```
frontend/
├── src/
│   ├── assets/        # Static assets (images, fonts)
│   ├── components/    # Shared reusable components (including ChatWidget)
│   ├── data/          # Static TypeScript data files (videos, blog posts)
│   ├── pages/         # Page-level components (one per route)
│   ├── types/         # Shared TypeScript types and interfaces
│   └── main.tsx       # App entry point
├── e2e/               # Playwright E2E tests
├── public/            # Public static files
├── index.html
├── vite.config.ts
└── tsconfig.json
```

## Component Rules

- One component per file
- Use functional components with hooks — no class components
- Keep components focused — if it's doing too much, split it
- Shared/reusable components go in `src/components/`
- Page components go in `src/pages/`
- Keep API/data logic out of components — use `src/data/` for static data

## TypeScript Rules

- Strict mode enabled
- No `any` — use explicit types or `unknown`
- Model all data shapes with interfaces in `src/types/`
- All props must be explicitly typed

## Tailwind Rules

- Use Tailwind utility classes for all styling
- **Tailwind v4** — brand colors are defined via `@theme` in `src/index.css`, not in a `tailwind.config.ts`
- Responsive design required — mobile first
- No inline styles unless absolutely necessary

## Content Data

Both videos and blog posts follow the same pipeline: Markdown frontmatter in `knowledge-base/` → Python generator → static JSON → Vite bundles at build time. Seed `[]` files are committed so fresh checkouts build without running the generators. CI overwrites them before building.

```typescript
// frontend/src/types/content.ts
export interface Video {
  videoId: string       // matches MD filename and thumbnail filename
  title: string
  description: string
  publishDate: string   // ISO YYYY-MM-DD
  thumbnail: string     // filename only, e.g. "v_what_ai_actually_is.png"
  youtubeUrl: string
}

export interface BlogPost {
  postId: string        // matches MD filename
  title: string
  description: string
  publishDate: string   // ISO YYYY-MM-DD
  postUrl: string       // external link
  thumbnail: string     // filename only, e.g. "b_my-first-post.png"
}
```

Pages import JSON and cast to the appropriate type:
```typescript
import videosData from '../data/videos.json'
import blogsData from '../data/blogs.json'
import type { Video, BlogPost } from '../types/content'
const videos = videosData as Video[]
const posts = blogsData as BlogPost[]
```

Thumbnail URLs are constructed in the page:
- Videos: `` `/thumbnails/video/${video.thumbnail}` ``
- Blog posts: `` `/thumbnails/blog/${post.thumbnail}` ``

## Routing

| Route | Page Component |
|---|---|
| `/` | `HomePage` |
| `/videos` | `VideosPage` |
| `/blog` | `BlogPage` |
| `/about` | `AboutPage` |
| `/built-with` | `BuiltWithAIPage` |
| `/privacy` | `PrivacyPage` |
| `*` | `NotFound` |

## External Links

All external links must use:
```tsx
target="_blank" rel="noopener noreferrer"
```

## States

Every data-driven UI must handle:
- Loading state
- Error state
- Empty state
- Success/populated state

## Code Quality

- Run `pnpm lint` before declaring any task done
- Fix all lint errors — no warnings left unaddressed
- Run `pnpm build` to verify no TypeScript errors before opening a PR
