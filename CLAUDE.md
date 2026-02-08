# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website/blog built with Astro 5, deployed to Cloudflare Workers. Uses Tailwind CSS v4, MDX for content, and TypeScript.

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Type-check (`astro check`) then build
- `pnpm preview` — Preview production build locally
- `pnpm check` — Run Astro type checking only
- `pnpm lint` — Lint with Biome (`biome lint ./src`)
- `pnpm format` — Format with Biome (`biome format --write .`)
- `pnpm deploy` — Build and deploy to Cloudflare (`pnpm build && pnpm wrangler deploy`)

Node version managed via mise (v25.1.0). Package manager is pnpm.

Pre-commit hook runs `biome-check` via pre-commit framework.

## Architecture

**Content Collections** (defined in `src/content.config.ts`):
- `writing` — Blog posts in `src/content/writing/` as markdown. Frontmatter: `title`, `description`, `date`, optional `draft` and `tags`.
- `works` — Work experience in `src/content/profile/works/`. Frontmatter: `company`, `role`, `dateStart`, `dateEnd`.
- `educations` — Education in `src/content/profile/educations/`. Frontmatter: `university`, `major`, `dateStart`, `dateEnd`.

Note: The content loaders use `glob()` with base paths that differ from the physical directory layout for works/educations (loader base: `./src/content/works`, files at: `./src/content/profile/works`).

**Pages** (`src/pages/`):
- `index.astro` — Homepage showing latest post, tags, and recent writings
- `writing/index.astro` — All blog posts listing
- `writing/[...id].astro` — Individual blog post (renders content collection entry with table of contents)
- `works/index.astro` — Work experience and education timeline
- `about.astro` — About page
- `tags/index.astro` and `tags/[tag].astro` — Tag listing and tag-filtered post pages
- `rss.xml.ts` and `robots.txt.ts` — Generated feeds

**Path aliases** (from `tsconfig.json`):
- `@*` maps to `./src/*` (e.g., `@components/Footer.astro`, `@consts`, `@lib/utils`, `@types`, `@layouts/Layout.astro`)

**Key files**:
- `src/consts.ts` — Site metadata, page titles/descriptions, social links. `SITE.NUM_POSTS_ON_HOMEPAGE` controls homepage post count.
- `src/types.ts` — TypeScript types for `Site`, `Metadata`, `Socials`
- `src/lib/utils.ts` — Utilities: `cn()` (clsx + tailwind-merge), `readingTime()`, `dateRange()`
- `src/layouts/Layout.astro` — Base layout wrapping all pages (Head, Header, Footer, BackToTop)
- `src/styles/global.css` — Global styles, "Cloud Dancer" color scheme, Shiki code theme variables, `.animate` class for scroll animations

**Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin. Dark mode uses class-based strategy (`.dark` class). Custom color scheme defined as CSS variables in `global.css`. Code syntax highlighting uses Shiki with `css-variables` theme.

**Deployment**: Cloudflare Workers via `@astrojs/cloudflare` adapter. Wrangler config names the worker "space" and serves from `./dist`.

## Content Authoring

The `src/content/` directory doubles as an Obsidian vault (`.obsidian` config present). Blog posts are written as markdown with YAML frontmatter. Posts with `draft: true` are excluded from all listings and feeds.
