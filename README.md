# Teams HQ — Frontend Showcase (Next.js + TypeScript)

A senior-level UI/UX showcase: design tokens → primitives → components, dashboards, forms, a11y, and motion. Frontend-only with MSW + seed data. Deploy-ready.

## Getting Started

```bash
pnpm install
pnpm dev
```

- Visit **/** for the marketing page.
- Visit **/(showcase)** for the showcase dashboard.
- Storybook: `pnpm storybook`
- Tests: `pnpm test` and `pnpm test:e2e`

## Tech

Next.js 14, TypeScript, Tailwind, Zustand, React Query, MSW, Recharts, Framer Motion, Storybook, RTL, Playwright.

## Notes

- No server dependency; data mocked via MSW and optional Next route handlers.
- WCAG-first patterns: visible focus, semantic landmarks, keyboardable UI.
