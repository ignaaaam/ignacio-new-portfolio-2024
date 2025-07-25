# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Ignacio Amat's professional portfolio website** built with Astro 5.6.1, featuring a bilingual blog (Spanish/English) and optimized for SEO. The site showcases full-stack development services and serves as a content platform for programming tutorials and industry news.

**Live URL**: https://ignathedev.com

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at localhost:4321 |
| `npm run build` | Build production site with remote DB connection (`--remote` flag) |
| `npm run check` | Run Astro type checking |
| `npm run preview` | Preview production build locally |
| `astro add <integration>` | Add new Astro integrations |

**Important**: The build command uses `--remote` flag for Astro DB connectivity in production.

## Architecture Overview

### Tech Stack
- **Framework**: Astro 5.6.1 (server mode with Vercel adapter)
- **UI**: React 19.1.0 + TailwindCSS 3.4.17 with Flowbite components
- **Database**: Astro DB with Zod schemas
- **Styling**: TailwindCSS with custom animations (meteor effects, shine)
- **Graphics**: WebGL with OGL library for Aurora backgrounds
- **Email**: Resend API for contact form
- **Analytics**: Vercel Web Vitals + Speed Insights
- **Performance**: Partytown for third-party scripts, Sharp for image optimization

### Internationalization (i18n) Architecture

**Critical Pattern**: This is a bilingual website with specific routing requirements:

- **Default Language**: Spanish (no prefix) - `ignathedev.com/`
- **English Language**: Prefixed - `ignathedev.com/en/`
- **Configuration**: `prefixDefaultLocale: false` in astro.config.mjs

**File Structure for i18n**:
```
src/pages/
   index.astro          # Spanish homepage
   blog/               # Spanish blog posts
   en/
      index.astro     # English homepage
      blog/          # English blog posts
   api/               # Shared API endpoints
```

**When adding new pages**: Always create both Spanish and English versions. The Spanish version goes in the root, English version goes in `/en/` directory.

### Content Management System

**Blog Architecture**:
- **Location**: Markdown files in `src/content/blog/` and `src/content/blog-en/`
- **Database**: Astro DB with Posts, Images, and Tags collections
- **Schema Validation**: Zod schemas in `src/content/config.ts`
- **SEO**: Comprehensive frontmatter with social sharing, structured data

**Required Blog Frontmatter**:
```yaml
title: "Post Title"
description: "SEO description"
pubDate: "2024-01-01"
image: "/img/blog/image.webp"
category: "Programming"
tags: ["tag1", "tag2"]
```

### Component Architecture

**Key Patterns**:
1. **Astro Components**: Server-side rendered UI (Header, Footer, Layout)
2. **React Components**: Interactive elements (Aurora backgrounds, animations)
3. **Client Directives**: Use sparingly - prefer static rendering
4. **Layout System**: Single `Layout.astro` with extensive SEO configuration

**Component Guidelines**:
- Follow the .cursorrules for Astro component structure
- Use TailwindCSS classes, minimal custom CSS
- Dark mode support via `class` strategy (not media queries)
- Responsive design with mobile-first approach

### Database Schema (Astro DB)

**Collections**:
- **Posts**: Blog entries with relationships to images and tags
- **Images**: Optimized image metadata 
- **Tags**: Categorization system

**Important**: Use `astro db push --remote` for production schema changes.

### Performance & SEO Configuration

**Critical SEO Features**:
- Comprehensive meta tags in `Layout.astro`
- Structured data (JSON-LD)
- Sitemap generation
- Social media sharing optimization
- Image optimization with WebP formats

**Performance Features**:
- Static site generation with server rendering
- Partytown for Google Analytics
- Sharp for image optimization
- Minimal client-side JavaScript

## Development Guidelines

### Working with Themes
- Dark mode toggle implementation in `ThemeToggle.astro`
- Smooth theme transition animation from top-left corner
- Uses `localStorage` for persistence
- Animation appears behind header (z-index: 10 vs header z-index: 50)

### Adding New Blog Posts
1. Create markdown file in appropriate language directory
2. Follow established frontmatter schema
3. Add corresponding optimized images to `/public/img/blog/`
4. Update database if needed (`npm run dev` auto-syncs in development)

### Styling Guidelines
- **Primary Framework**: TailwindCSS with Flowbite components
- **Custom Animations**: Defined in `tailwind.config.mjs` (meteor-effect, shine)
- **Dark Mode**: Class-based switching (`dark:` prefixes)
- **Icons**: Custom Astro components in `/src/components/icons/`

### API Development
- **Contact Form**: `/src/pages/api/send-email.ts` using Resend
- **Rate Limiting**: CV download protection middleware
- **Validation**: Zod schemas for type safety

### Deployment Notes
- **Platform**: Vercel with SSR mode
- **Build**: Requires `--remote` flag for database connectivity
- **Analytics**: Built-in Vercel Analytics and Speed Insights
- **Domain**: Custom domain with proper redirects

## Important Files

- **`astro.config.mjs`**: Main configuration with integrations and i18n setup
- **`src/layouts/Layout.astro`**: SEO-optimized main layout template
- **`src/content/config.ts`**: Content collections and Zod schemas  
- **`tailwind.config.mjs`**: Custom animations and Flowbite integration
- **`src/i18n/utils.ts`**: Internationalization utilities
- **`.cursorrules`**: Astro-specific coding guidelines and best practices

## Business Context

This portfolio serves a **Spanish-speaking market** with international reach. The owner provides:
- Backend development (PHP, Laravel, MySQL)
- Frontend development (Vue.js, React, TailwindCSS)  
- Full-stack web applications and e-commerce solutions

Content strategy focuses on technical blog posts, programming tutorials, and industry news to establish expertise and improve SEO rankings.