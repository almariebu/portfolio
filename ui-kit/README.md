# UI Kit

Small React + TypeScript + Tailwind component kit with tests. Project 1 of
`ROADMAP.md`. Built to move into its own repository.

## Components

| Component | Notes |
|---|---|
| `Button` | primary / secondary / danger, loading state (`aria-busy`) |
| `Input` | label linked by id, error announced with `role="alert"` |
| `Modal` | native `<dialog>`: focus trap, Escape to close |

To add next: Table, Toast, Select, Tabs.

## Run

```bash
npm install
npm run dev        # demo page
npm test           # Vitest + Testing Library
npx playwright install chromium
npm run e2e        # Playwright, desktop + phone width
```

## Tests

- Unit: behavior and accessibility attributes for each component.
- End to end: validation flow, modal open/close with keyboard, no horizontal
  scroll at 360px.
- CI: `.github/workflows/ci.yml` (active once this folder is its own repo).

## Before publishing

- [ ] Add screenshots to this README.
- [ ] Deploy the demo (Vercel) and add the live link.
- [ ] Only then list React, TypeScript, and Tailwind on the portfolio and CVs.
