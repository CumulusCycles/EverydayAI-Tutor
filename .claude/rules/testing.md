# Testing Rules

## Stack

| Layer | Tool |
|---|---|
| Unit & Component | Vitest + React Testing Library |
| End-to-End / Functional | Playwright |

## General Rules

- Add tests for every meaningful behavior change
- Include at least one negative or edge case for important flows
- Favor deterministic tests — avoid timing-dependent or flaky tests
- Tests must pass before opening a PR

## Vitest + React Testing Library

- Unit tests live alongside the component or module they test: `Component.test.tsx`
- Test behavior, not implementation details
- Do not test internal state directly — test what the user sees
- Use React Testing Library queries in priority order:
  1. `getByRole`
  2. `getByLabelText`
  3. `getByText`
  4. `getByTestId` (last resort)

### Run unit tests
```bash
cd frontend
pnpm test
```

### Run with coverage
```bash
pnpm test --coverage
```

## Playwright

- E2E tests live in `frontend/e2e/`
- Test critical user flows — navigation, card rendering, external links, CTA buttons
- Run against the local dev server

### Run E2E tests
```bash
cd frontend
pnpm exec playwright test
```

## What to Test at MVP

- All page routes render without errors
- Navigation links work correctly
- Video and blog cards render with correct content
- External links have correct `target="_blank"` and `rel="noopener noreferrer"`
- Subscribe CTA buttons link to the correct YouTube URL
- 404 / unknown routes redirect correctly
