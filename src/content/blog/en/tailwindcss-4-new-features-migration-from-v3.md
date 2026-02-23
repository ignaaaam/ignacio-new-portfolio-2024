---
title: "TailwindCSS 4: New Features and Migration from v3"
description: "TailwindCSS 4 ships a Rust engine, CSS-first config and real performance gains. A practical summary of what's new and how to migrate from v3."
author: Ignacio Amat
publishDate: 2026-02-23
slug: tailwindcss-4-new-features-migration-from-v3
locale: en
translationKey: tailwindcss-4-migration-2026
image:
  url: /img/optimized/tailwindcss-4-article.webp
  alt: "Frontend development with TailwindCSS 4 and migration from version 3"
tags:
  - TailwindCSS
  - CSS
  - Frontend
  - Migration
  - Full Stack
isDraft: false
---

# TailwindCSS 4: New Features and Migration from v3

TailwindCSS 4 is not an incremental update. It is a deep rewrite of the internal engine, with a new Rust-based compiler, a configuration system that lives directly in CSS and performance improvements you can feel from the very first build. If you use Tailwind in production, this matters.

## What changes in TailwindCSS 4

The most important shift is philosophical: configuration moves out of `tailwind.config.js` and into your CSS file. Instead of the three classic directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`), you now use a single import. The framework automatically detects which classes your project uses, so you no longer need to configure the `content` array manually.

Under the hood, the JavaScript engine has been replaced by **Oxide**, a compiler written in Rust. The result: incremental builds drop from 44ms to 5ms. On large projects, that translates into a noticeably faster development loop.

## Key new features

The improvements go beyond internals. There is real new functionality that previously required plugins or workarounds:

- **container queries** built into core, no need for the `@tailwindcss/container-queries` plugin;
- **3D transforms** with native utilities like `rotate-x-*`, `rotate-y-*`, `scale-z-*` and `translate-z-*`;
- **native cascade layers** for finer control over specificity;
- **color-mix()** to adjust opacity on any color value without extra variables;
- native support for **registered custom properties**, which enables gradient animations;
- new utilities like `inset-shadow-*`, `inset-ring-*`, `field-sizing` for auto-resizing textareas and `font-stretch` for variable fonts.

The `@theme` directive replaces the old `theme.extend` config section, and everything is defined using standard CSS syntax.

## Migrating from v3

Tailwind ships an official migration tool that covers most scenarios:

1. run `npx @tailwindcss/upgrade` at the project root;
2. update your bundler configuration (Vite, PostCSS or whichever you use);
3. convert theme customizations to the `@theme` directive in CSS;
4. review renamed utilities: `shadow` becomes `shadow-sm`, `rounded` becomes `rounded-sm`, `ring` defaults to `ring-1`, `outline-none` becomes `outline-hidden`.

For simple projects, migration takes one to two hours. Projects with custom plugins or heavily extended configurations may need a full day of review.

## What this means for production projects

Browser support starts at Safari 16.4+, Chrome 111+ and Firefox 128+. If your audience includes older browsers, staying on v3.4 is the safer bet until your requirements change.

In my case, for projects built with Astro, Laravel or Next.js where the browser stack is up to date, the migration is worth it. The Rust compiler removes development bottlenecks, CSS-first configuration reduces config file overhead and the new utilities cover scenarios that previously required custom CSS.

There is no need to migrate everything at once. You can keep v3 on stable projects and adopt v4 on new builds or on projects you were already planning to refactor.

## Conclusion

TailwindCSS 4 is a genuine improvement, not just marketing. The Rust engine, CSS-based configuration and new utilities solve concrete everyday problems. If you already use Tailwind, the migration path is well documented and the official tool makes the transition straightforward. I see it as an upgrade that pays back the effort of adopting it.
