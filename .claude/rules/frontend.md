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
│   ├── components/    # Shared reusable components
│   ├── data/          # Static TypeScript data files (videos, blog posts)
│   ├── pages/         # Page-level components (one per route)
│   ├── types/         # Shared TypeScript types and interfaces
│   └── main.tsx       # App entry point
├── public/            # Public static files
├── index.html
├── vite.config.ts
├── tailwind.config.ts
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
- Follow the brand color palette — use exact hex values via Tailwind config
- Responsive design required — mobile first
- No inline styles unless absolutely necessary

## Content Data

At launch, video and blog post content is stored as static TypeScript data files in `src/data/`.

```typescript
// Example: src/data/videos.ts
export interface Video {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  thumbnailUrl: string;
  youtubeUrl: string;
}

export const videos: Video[] = [ ... ];
```

## Routing

| Route | Page Component |
|---|---|
| `/` | `HomePage` |
| `/videos` | `VideosPage` |
| `/blog` | `BlogPage` |
| `/about` | `AboutPage` |
| `/privacy` | `PrivacyPage` |

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
