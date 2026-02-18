#!/usr/bin/env node
/**
 * scripts/fetch-unsplash-images.mjs
 *
 * Fetches relevant images from the Unsplash API for each blog article,
 * converts them to 1200×630 WebP, saves to public/img/optimized/, and
 * updates the image.url + image.alt fields in both ES and EN frontmatter.
 *
 * Usage:
 *   UNSPLASH_ACCESS_KEY=xxx node scripts/fetch-unsplash-images.mjs
 *   UNSPLASH_ACCESS_KEY=xxx node scripts/fetch-unsplash-images.mjs --only-missing
 *   UNSPLASH_ACCESS_KEY=xxx node scripts/fetch-unsplash-images.mjs --key=astro-6-beta-2026
 *
 * Flags:
 *   --only-missing   Skip articles whose target image file already exists
 *   --key=<value>    Process only the article with this translationKey
 *   --dry-run        Show what would happen without downloading or writing files
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Load .env manually (no extra dependency needed)
const envPath = join(ROOT, ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] ??= match[2].trim().replace(/^["']|["']$/g, "");
  }
}

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const ONLY_MISSING = process.argv.includes("--only-missing");
const DRY_RUN = process.argv.includes("--dry-run");
const KEY_FILTER = process.argv.find((a) => a.startsWith("--key="))?.split("=")[1];

if (!ACCESS_KEY) {
  console.error(
    "\n❌ UNSPLASH_ACCESS_KEY is not set.\n" +
      "   Add it to .env:  UNSPLASH_ACCESS_KEY=your_access_key\n" +
      "   Or pass inline:  UNSPLASH_ACCESS_KEY=xxx node scripts/fetch-unsplash-images.mjs\n" +
      "\n   Get a key at: https://unsplash.com/developers\n"
  );
  process.exit(1);
}

const IMG_DIR = join(ROOT, "public", "img", "optimized");
const BLOG_EN = join(ROOT, "src", "content", "blog", "en");
const BLOG_ES = join(ROOT, "src", "content", "blog", "es");

// ---------------------------------------------------------------------------
// Article → Unsplash image mapping
// key: translationKey used in the article frontmatter
// ---------------------------------------------------------------------------

/** @type {Record<string, { query: string, filename: string, altEn: string, altEs: string }>} */
const ARTICLE_IMAGE_MAP = {
  "astro-6-beta-2026": {
    query: "web performance rocket speed developer laptop dark",
    filename: "astro-6-beta-article.webp",
    altEn: "Developer workstation showing code with web performance metrics",
    altEs: "Estación de trabajo de desarrollador mostrando código y métricas de rendimiento web",
  },
  "claude-opus-46-dev-2026": {
    query: "artificial intelligence coding assistant developer terminal dark",
    filename: "claude-opus-46-article.webp",
    altEn: "AI-assisted development workflow on a modern developer workstation",
    altEs: "Flujo de trabajo de desarrollo asistido por IA en una estación de trabajo moderna",
  },
  "gemini-january-2026-dev": {
    query: "google AI neural network abstract blue purple technology",
    filename: "gemini-2026-article.webp",
    altEn: "Abstract neural network visualization representing Google Gemini AI advancements",
    altEs: "Visualización abstracta de red neuronal representando los avances de Google Gemini AI",
  },
  "gpt-53-codex-dev-2026": {
    query: "full stack developer productivity code workflow multiple screens",
    filename: "gpt-codex-workflow-article.webp",
    altEn: "Full-stack development workflow environment with multiple monitors and code editor",
    altEs: "Entorno de flujo de trabajo full-stack con múltiples monitores y editor de código",
  },
  "laravel-ai-sdk-2026": {
    query: "php backend server code dark terminal command line",
    filename: "laravel-ai-sdk-article.webp",
    altEn: "PHP backend development with Laravel framework and AI SDK integration",
    altEs: "Desarrollo backend PHP con el framework Laravel e integración del SDK de IA",
  },
  "blade-ui-libraries": {
    query: "web UI component design system interface modern clean",
    filename: "blade-ui-libraries-article.webp",
    altEn: "Modern web UI component library layout showing design system elements",
    altEs: "Diseño de biblioteca de componentes web modernos mostrando elementos de sistema de diseño",
  },
  "laravel-cloud-future-hosting": {
    query: "cloud server infrastructure hosting datacenter blue",
    filename: "laravel-cloud-hosting-article.webp",
    altEn: "Cloud server infrastructure representing modern web application hosting",
    altEs: "Infraestructura de servidores en la nube representando el alojamiento web moderno",
  },
  "welcome-programming-blog": {
    query: "programmer developer desk setup laptop notebook coffee",
    filename: "welcome-blog-article.webp",
    altEn: "Developer workspace with laptop, notebook and coffee — a programming blog setup",
    altEs: "Espacio de trabajo de desarrollador con laptop, cuaderno y café",
  },
  "filamentphp-framework": {
    query: "admin dashboard web application modern clean interface",
    filename: "filamentphp-article.webp",
    altEn: "Modern admin dashboard interface representing FilamentPHP capabilities",
    altEs: "Interfaz de panel de administración moderna que representa las capacidades de FilamentPHP",
  },
  "neuralink-vision-restoration": {
    query: "neurotechnology brain science research laboratory",
    filename: "neuralink-vision-article.webp",
    altEn: "Neurotechnology research visualization representing brain-computer interface advances",
    altEs: "Visualización de investigación en neurotecnología representando avances de interfaces cerebro-computadora",
  },
  "full-stack-remote-projects": {
    query: "remote work home office developer laptop desk minimal",
    filename: "full-stack-remote-article.webp",
    altEn: "Remote developer home office setup with laptop on a clean organized desk",
    altEs: "Configuración de oficina en casa de desarrollador remoto con laptop en escritorio organizado",
  },
  "php-84-features": {
    query: "php programming language backend code server dark theme",
    filename: "php-84-features-article.webp",
    altEn: "PHP code on a dark-themed editor displaying new language features",
    altEs: "Código PHP en editor de tema oscuro mostrando nuevas características del lenguaje",
  },
  "crowdstrike-global-outage-analysis": {
    query: "cybersecurity system failure computer error screen dark",
    filename: "crowdstrike-outage-article.webp",
    altEn: "System error screen representing a large-scale cybersecurity outage incident",
    altEs: "Pantalla de error del sistema representando un incidente de interrupción de ciberseguridad a gran escala",
  },
  "vercel-v0-integrated-chat": {
    query: "AI UI generation design chat interface tool web",
    filename: "vercel-v0-chat-article.webp",
    altEn: "AI-powered web UI generation tool with integrated chat interface",
    altEs: "Herramienta de generación de interfaz web con IA y chat integrado",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function unsplashSearch(query) {
  const url =
    `https://api.unsplash.com/search/photos` +
    `?query=${encodeURIComponent(query)}` +
    `&per_page=5&orientation=landscape&content_filter=high`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
      "Accept-Version": "v1",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Unsplash API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.results ?? [];
}

async function triggerUnsplashDownload(downloadLocation) {
  try {
    await fetch(`${downloadLocation}&client_id=${ACCESS_KEY}`);
  } catch {
    // non-fatal — best effort
  }
}

async function downloadAsWebp(rawUrl, outputPath) {
  // Append Unsplash image params for a 1200px wide, high-quality crop
  const downloadUrl = `${rawUrl}&w=1200&h=630&fit=crop&q=85&fm=jpg&auto=format`;
  const res = await fetch(downloadUrl);
  if (!res.ok) throw new Error(`Image download failed with status ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await sharp(buffer)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .webp({ quality: 85 })
    .toFile(outputPath);
}

/**
 * Replace the image block in a markdown file's frontmatter.
 * Handles both single-line and YAML block-scalar alt text values.
 */
function updateArticleFrontmatter(filePath, newUrl, newAlt) {
  if (!existsSync(filePath)) return false;

  const original = readFileSync(filePath, "utf-8");

  // Match the entire `image:` block (url + alt, possibly multiline alt)
  const updated = original.replace(
    /^(image:\s*\n)((?:\s+.+\n)+)/m,
    `$1  url: ${newUrl}\n  alt: "${newAlt}"\n`
  );

  if (updated === original) return false;
  writeFileSync(filePath, updated, "utf-8");
  return true;
}

/** Index all blog files by their translationKey */
function buildArticleIndex() {
  /** @type {Record<string, Record<string, string>>} */
  const index = {};

  for (const [dir, locale] of [
    [BLOG_EN, "en"],
    [BLOG_ES, "es"],
  ]) {
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const filePath = join(dir, file);
      const content = readFileSync(filePath, "utf-8");
      const match = content.match(/^translationKey:\s*(.+)$/m);
      if (match) {
        const tk = match[1].trim();
        if (!index[tk]) index[tk] = {};
        index[tk][locale] = filePath;
      }
    }
  }
  return index;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!DRY_RUN) mkdirSync(IMG_DIR, { recursive: true });

  const articleIndex = buildArticleIndex();
  const keysToProcess = KEY_FILTER
    ? [KEY_FILTER]
    : Object.keys(ARTICLE_IMAGE_MAP);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  console.log(
    `\n📸 Unsplash image fetcher` +
      (DRY_RUN ? " [DRY RUN]" : "") +
      (ONLY_MISSING ? " [--only-missing]" : "") +
      `\n   Processing ${keysToProcess.length} article(s)\n`
  );

  for (const key of keysToProcess) {
    const config = ARTICLE_IMAGE_MAP[key];
    if (!config) {
      console.warn(`⚠️  No image config for translationKey: "${key}"`);
      continue;
    }

    const outputPath = join(IMG_DIR, config.filename);

    if (ONLY_MISSING && existsSync(outputPath)) {
      console.log(`⏭️  ${key} — image already exists, skipping`);
      skipped++;
      continue;
    }

    console.log(`🔍 ${key}`);
    console.log(`   query    : "${config.query}"`);
    console.log(`   output   : ${config.filename}`);

    try {
      const photos = await unsplashSearch(config.query);

      if (!photos.length) {
        console.error(`   ❌ No photos found for this query`);
        failed++;
        continue;
      }

      const photo = photos[0];
      console.log(
        `   photo    : "${photo.description ?? photo.alt_description ?? "untitled"}" by ${photo.user.name}`
      );
      console.log(`   unsplash : ${photo.links.html}`);

      if (!DRY_RUN) {
        await downloadAsWebp(photo.urls.raw, outputPath);
        await triggerUnsplashDownload(photo.links.download_location);
        console.log(`   ✅ Saved  : public/img/optimized/${config.filename}`);
      } else {
        console.log(`   [dry] Would save: public/img/optimized/${config.filename}`);
      }

      // Update frontmatter in matching article files
      const articles = articleIndex[key] ?? {};
      const foundLocales = Object.keys(articles);

      if (!foundLocales.length) {
        console.warn(`   ⚠️  No article files found for translationKey: "${key}"`);
      }

      for (const [locale, filePath] of Object.entries(articles)) {
        const alt = locale === "en" ? config.altEn : config.altEs;
        const relPath = filePath.replace(ROOT, "").replace(/\\/g, "/");

        if (!DRY_RUN) {
          const didUpdate = updateArticleFrontmatter(
            filePath,
            `/img/optimized/${config.filename}`,
            alt
          );
          console.log(
            didUpdate
              ? `   ✅ Updated: ${relPath}`
              : `   ⚠️  No change: ${relPath} (frontmatter pattern not matched)`
          );
        } else {
          console.log(`   [dry] Would update: ${relPath}`);
        }
      }

      processed++;
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
      failed++;
    }

    // Brief pause between requests to respect Unsplash rate limits
    await new Promise((r) => setTimeout(r, 400));
    console.log();
  }

  console.log(
    `\n📊 Summary: ${processed} processed, ${skipped} skipped, ${failed} failed` +
      (DRY_RUN ? " [DRY RUN — no files written]" : "") +
      "\n"
  );

  if (!DRY_RUN && processed > 0) {
    console.log("Next step: npm run check && npm run build\n");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
