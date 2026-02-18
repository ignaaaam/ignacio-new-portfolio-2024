# Repository Guidelines

## Project Structure & Module Organization
This is an Astro portfolio site with bilingual content (`es` default, `en` secondary).

- `src/pages/`: route files (`/`, `/blog`, `/en/...`, API routes).
- `src/components/`, `src/layouts/`, `src/lib/`: reusable UI, page shells, and helpers.
- `src/content/config.ts`: Astro Content Collections schema.
- `src/content/blog/es/` and `src/content/blog/en/`: markdown blog posts (one file per locale).
- `public/`: static assets (`public/img`, fonts).
- `docs/`: project docs (including editorial rules in `docs/BLOG-EDITORIAL-GUIDE.md`).

## Build, Test, and Development Commands
Run from repository root:

- `npm install`: install dependencies.
- `npm run dev`: start local Astro dev server.
- `npm run check`: run Astro/TypeScript checks.
- `npm run build`: production build (required before merge).
- `npm run preview`: preview built output locally.

## Coding Style & Naming Conventions
- Formatting uses Prettier with `prettier-plugin-astro` (`.prettierrc.mjs`).
- In `.astro` files, keep one attribute per line when formatting.
- Follow existing style in touched files (TypeScript + Astro, concise comments).
- Use kebab-case for markdown filenames and slugs.
- Blog entries must include complete frontmatter (`title`, `description`, `publishDate`, `locale`, `translationKey`, `image`, `tags`, `isDraft`).
- Keep `translationKey` identical for ES/EN versions of the same article.

## Testing Guidelines
There is no dedicated unit test suite yet. Minimum quality gate for every change:

1. `npm run check`
2. `npm run build`

For blog/content changes, verify:
- both locales exist (`es` + `en`),
- links/translations resolve correctly,
- publish dates and tags are valid.

## Commit & Pull Request Guidelines
- Prefer Conventional Commit style seen in history, e.g. `feat(seo): improve hreflang tags`, `fix(blog): correct slug mapping`.
- Keep commits focused and scoped to one concern.
- PRs should include:
  - concise change summary,
  - impacted paths,
  - screenshots for UI changes,
  - commands executed (`check`, `build`) and results.

## Content Scope Rules
Blog topics must align with the portfolio stack and AI-for-dev focus (Laravel, PHP, JavaScript, Astro, UI/UX, OpenAI/Claude/Gemini updates). Avoid unrelated ecosystems.

## Blog Article Quality Rules
When creating blog articles, always follow `docs/BLOG-EDITORIAL-GUIDE.md`. Key rules:

- Every article needs both `es` AND `en` versions with the same `translationKey`.
- Use exact tag names from the guide's tag reference table (e.g. `IA` in ES, `AI` in EN, `Vue.js` not `vuejs`).
- Every article MUST have a header image: `image.url` pointing to `public/img/optimized/`, and a descriptive `image.alt`.
- Article markdown should NOT include a top-level `# H1` — the layout renders the title automatically.
- Slug must be unique, kebab-case, and keyword-rich (under 75 chars).
- Title: 50–65 chars with primary keyword. Description: 140–160 chars, human-sounding.
- Structure requires: introduction paragraph, at least 3 H2 sections, conclusion/takeaway.
- Tone: first-person for personal experience, professional throughout, no fluff openers.
- Set `isDraft: false` only when article is fully complete and both locales are written.
- After creating articles, run `npm run check && npm run build` to verify no errors.
