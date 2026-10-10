# Learning path

This is a self-study path for TypeScript, testing, React, Tailwind and Playwright. Each lesson is built around the real apps in this repo, `ui-kit/` and `approvals-app/`. The plan runs for 8 weeks at about 10 hours per week, starting Monday 12 October 2026.

## How each lesson works

1. **Read (30-45 min):** Official docs only.
2. **Watch (30-60 min):** One focused, recent video. Skip anything older than about 18 months.
3. **Build:** A small commit in `ui-kit/` or `approvals-app/`.
4. **Teach-back (15 min):** Copy `TEMPLATE.md` and write "what I'd tell a beginner".

## The rule

Spend about 1 hour reading or watching for every 2 hours of building. If a week has no commit, the lesson is not done.

## Schedule

| Weeks | Dates | Lesson | Build target |
| --- | --- | --- | --- |
| 1-2 | 12-25 Oct | TypeScript + Vitest basics | Type the approvals-app API responses. Fix the deferred review issues test-first: huge numbers return 400 not 500, a missing enrollment's events return 404, /health?x=1 returns 200 |
| 3-5 | 26 Oct - 15 Nov | React + Testing Library | An accessible form in `ui-kit/`, tested as you build it |
| 6 | 16-22 Nov | Tailwind CSS | Dark mode and a responsive pass on `ui-kit/` |
| 7 | 23-29 Nov | Playwright | An end-to-end test of the form flow |
| 8 | 30 Nov - 6 Dec | Buffer | Catch up and tidy the teach-back notes |

## Lessons

- [01: TypeScript and Vitest](01-typescript-vitest.md)
- [02: React and Testing Library](02-react-testing-library.md)
- [03: Tailwind CSS](03-tailwind.md)
- [04: Playwright](04-playwright.md)

Teach-back notes start from [TEMPLATE.md](TEMPLATE.md).

## Later

These notes are the seed of a public beginner course. They are rough for now. Expect them to change as I learn.
