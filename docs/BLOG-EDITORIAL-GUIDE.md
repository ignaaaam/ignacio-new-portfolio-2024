# Blog Editorial Guide (Portfolio)

## Main goal

Publish technical articles that demonstrate Ignacio's expertise as a full-stack web developer, attract potential clients looking to hire for web projects, and build authority in the PHP/Laravel/JavaScript/AI-for-dev space.

---

## Approved topics

- **Laravel ecosystem**: releases, packages, Laravel Cloud, Filament, Blade/UI tooling.
- **PHP ecosystem**: new versions, RFCs, performance, production best practices.
- **JavaScript ecosystem**: modern framework updates, npm libraries, tooling, DX improvements.
- **Astro ecosystem**: releases, content collections, performance and SEO workflows.
- **AI for developers**: major model updates (ChatGPT/OpenAI, Claude/Anthropic, Gemini/Google) and practical impact on coding workflows.
- **UI/UX for web products**: component systems, interaction patterns, accessibility, design-to-dev handoff.

## Topic exclusions

- Avoid articles focused on programming languages or ecosystems not used in this portfolio stack.
- Avoid generic AI news with no clear connection to web development workflows.

---

## Article quality standards (SEO + Professional)

Every article must meet these standards before publishing. These rules apply to both ES and EN versions.

### Frontmatter requirements

```yaml
---
title: "Descriptive, keyword-rich title (50–65 chars ideal)"
description: "Compelling meta description with primary keyword (140–160 chars). Should sound like a human would write it, not AI slop."
author: Ignacio Amat
publishDate: YYYY-MM-DD
slug: keyword-rich-kebab-case-slug
locale: es   # or en
translationKey: shared-key-for-es-and-en-pair
image:
  url: /img/optimized/descriptive-image-name.webp
  alt: "Descriptive alt text with context (not keyword-stuffed)"
tags:
  - Primary technology (e.g. Laravel)
  - Secondary topic (e.g. AI)
  - Use case (e.g. Full Stack)
isDraft: false
---
```

### Required structural elements

Every article must have:
1. **H1** — the article title (rendered automatically by the layout, do NOT add it in markdown)
2. **Introduction paragraph** — first paragraph hooks the reader within 2–3 sentences, answers "why should I care"
3. **H2 sections** (at least 3) — logical structure, keyword-containing headings
4. **Conclusion or actionable takeaway** — last section summarizes value or calls to action
5. **Code examples** — when the topic involves code, at least one real, practical example
6. **Internal reader goal** — every article must clearly answer: "What does the reader gain from reading this?"

### SEO rules

- **Title**: 50–65 characters. Primary keyword near the start. No clickbait or keyword stuffing.
- **Description**: 140–160 characters. Summarizes the article value, includes one clear keyword, written like a human.
- **Slug**: kebab-case, lowercase, keyword-rich, no stopwords, under 75 characters.
- **Tags**: 3–6 tags. Use consistent casing — check existing articles for tag names to avoid duplicates (e.g. use "Full Stack" not "full-stack").
- **Headings**: Use H2 and H3 logically. Do NOT skip levels. H2 headings should include secondary keywords naturally.
- **Links**: Use specific anchor text for links — never "click here" or "read more". Link to official docs or related content where relevant.
- **Alt text**: Descriptive, contextual, under 120 characters. Describe what's in the image, not just the keyword.

### Professional quality rules

- Write in **first person** when sharing experiences, third person for technical explanations.
- **Accuracy**: Verify technical claims before publishing. Do not hallucinate API names, version numbers, or behaviors.
- **Depth over length**: A 600-word article that directly answers a question outperforms a 2000-word filler article.
- **Avoid fluff openers**: Never start with "In today's digital world..." or similar generic AI openers.
- **Real-world focus**: Ground every article in a practical scenario. What project would use this? What problem does it solve?
- **Conversion awareness**: Every article is an opportunity to show expertise. End articles in a way that naturally positions Ignacio as someone a client would want to hire.

### Minimum word count guidance

| Article type | Minimum |
|---|---|
| News/update recap | 400 words |
| Tutorial/how-to | 800 words |
| In-depth guide | 1200 words |
| Comparative analysis | 700 words |

---

## Publication rules

- Every article must include both `es` and `en` versions.
- Both language versions must share the same `translationKey`.
- Keep dates realistic and explicit in frontmatter. Use the actual publish date, not a future date.
- Use clear tags aligned with the article topic and stack relevance.
- Never publish with `isDraft: true` unless you intend the post to be invisible.

---

## Header image requirements

- **Format**: `.webp` preferred (better compression), `.png` or `.jpg` acceptable.
- **Size**: 1200×630px minimum (Open Graph optimal). Stored in `public/img/optimized/`.
- **Filename**: kebab-case, descriptive of topic (e.g. `laravel-ai-sdk-integration.webp`). Avoid generic filenames.
- **Alt text**: Must be filled in frontmatter. Describe the visual content, not just repeat the title.
- Every article **must** have a header image. Do not publish without one.

---

## How to get images from Unsplash (recommended — no API wait needed)

Use the `scripts/fetch-unsplash-images.mjs` script to automatically fetch, resize, and assign header images from Unsplash for every article.

### 1. Get an Unsplash API key

1. Go to [https://unsplash.com/developers](https://unsplash.com/developers) and register as a developer
2. Create a new application — demo mode gives 50 requests/hour (enough for all articles)
3. Copy your **Access Key** and add it to `.env`:

```bash
# .env
UNSPLASH_ACCESS_KEY=your_access_key_here
```

### 2. Run the script

```bash
# Fetch and update ALL articles (overwrites existing images)
npm run images:fetch

# Only fetch articles missing a local image file (safe default)
npm run images:fetch-missing

# Preview what would happen without writing any files
npm run images:dry-run

# Process a single article by translationKey
node scripts/fetch-unsplash-images.mjs --key=laravel-ai-sdk-2026
```

### 3. What the script does

For each article defined in `ARTICLE_IMAGE_MAP` inside the script:

1. Searches Unsplash with a curated query for that article's topic
2. Picks the top landscape result
3. Downloads it and converts to **1200×630 WebP** at 85% quality using `sharp`
4. Saves to `public/img/optimized/<filename>.webp`
5. Triggers the Unsplash download endpoint (required by API guidelines)
6. Updates `image.url` and `image.alt` in both the ES and EN frontmatter automatically

### 4. Adding a new article to the map

When you create a new article, add an entry to `ARTICLE_IMAGE_MAP` in `scripts/fetch-unsplash-images.mjs`:

```js
"your-translation-key": {
  query: "descriptive search query for unsplash",
  filename: "your-article-image.webp",
  altEn: "Descriptive alt text in English",
  altEs: "Texto alternativo descriptivo en español",
},
```

Then run `npm run images:fetch-missing` to only fetch the new image.

### 5. Unsplash attribution requirements

- The script hotlinks images during download from Unsplash's CDN (this is required by their API guidelines)
- Images are then stored locally in `public/img/optimized/` as WebP
- The script automatically calls the download tracking endpoint — no manual attribution needed for this use case

---

## How to generate images with Gemini (setup guide)

You can use the Google Gemini API (Imagen) to generate header images and inline content images for articles. Here's how to set it up:

### 1. Get a Google AI API key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a new API key (or use an existing one from your Google AI subscription)
3. Add it to your `.env` file:

```bash
# .env (never commit this file)
GOOGLE_AI_API_KEY=your_api_key_here
```

### 2. Install the Google AI SDK

```bash
npm install @google/genai
```

### 3. Use the Imagen API to generate images

Create a script at `scripts/generate-image.mjs`:

```js
import { GoogleGenAI } from "@google/genai";
import { writeFileSync } from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

async function generateArticleImage(prompt, outputFilename) {
  const response = await ai.models.generateImages({
    model: "imagen-3.0-generate-002",
    prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: "image/jpeg",
      aspectRatio: "16:9",  // Matches 1200x630 Open Graph format
    },
  });

  const imageData = response.generatedImages[0].image.imageBytes;
  const buffer = Buffer.from(imageData, "base64");
  const outputPath = path.join("public", "img", "optimized", outputFilename);
  writeFileSync(outputPath, buffer);
  console.log(`Image saved to: ${outputPath}`);
}

// Example usage — change prompt and filename for each article:
generateArticleImage(
  "Professional dark-themed developer workspace with code editor showing Laravel PHP code, clean modern UI, blue accent colors, high quality, tech aesthetic",
  "laravel-new-feature-article.webp"
);
```

Run it with:

```bash
GOOGLE_AI_API_KEY=your_key node scripts/generate-image.mjs
```

### 4. Prompt guidelines for good article images

- **Be specific about style**: "dark developer workspace", "clean minimal UI screenshot", "abstract code visualization"
- **Include brand/tech context**: "showing Laravel logo", "PHP code visible", "Astro framework"
- **Keep it professional**: Avoid overly rendered 3D, stock-photo humans, or cliché light bulb metaphors
- **Good prompt template**: `"[theme] [context/technology] [visual style], [color palette], professional editorial photography/illustration, high quality, 16:9 composition"`

### Prompt examples by topic

| Topic | Prompt example |
|---|---|
| Laravel release | "Server room with PHP Laravel code on screen, dark background, subtle red Laravel branding colors, minimal clean composition" |
| AI/LLM tool | "Abstract visualization of neural network connections, dark background, blue and purple gradient, modern tech aesthetic, no text" |
| Frontend/Vue.js | "Modern web browser showing reactive component UI, green Vue.js color palette, clean desk workspace, developer perspective" |
| PHP features | "Code editor with PHP syntax highlighting on dark theme, abstract data structures visible, professional tech illustration" |
| Astro/performance | "Rocket launching from a laptop screen representing web performance, orange Astro branding, minimal clean design" |

### 5. Optimize images after generation

After generating, optimize with:

```bash
npx sharp-cli --input public/img/optimized/your-image.jpg --output public/img/optimized/your-image.webp --format webp --quality 85
```

Or use [Squoosh](https://squoosh.app/) online for manual optimization.

---

## Workflow for creating a new article (checklist)

```
[ ] 1. Choose topic from approved list above
[ ] 2. Write ES version first in src/content/blog/es/
[ ] 3. Set all frontmatter fields (title, description, slug, translationKey, etc.)
[ ] 4. Write EN version in src/content/blog/en/ with SAME translationKey
[ ] 5. Add entry for the new translationKey in scripts/fetch-unsplash-images.mjs → ARTICLE_IMAGE_MAP
[ ] 6. Run: npm run images:fetch-missing
       (fetches Unsplash image, saves WebP to public/img/optimized/, updates both frontmatter files)
       Alternative: generate with Gemini Imagen (see below) and save manually to public/img/optimized/
[ ] 7. Verify both frontmatter slugs are unique and kebab-case
[ ] 8. Check article meets quality standards (structure, word count, SEO)
[ ] 9. Run npm run check && npm run build to verify no errors
[ ] 10. Set isDraft: false when ready to publish
```

---

## Tag consistency reference

Use these exact tag names to maintain consistency across articles:

| Technology | Tag to use |
|---|---|
| Laravel framework | `Laravel` |
| PHP language | `PHP` |
| Vue.js | `Vue.js` |
| JavaScript | `JavaScript` |
| TypeScript | `TypeScript` |
| Astro framework | `Astro` |
| AI in Spanish articles | `IA` |
| AI in English articles | `AI` |
| OpenAI tools | `OpenAI` |
| Anthropic/Claude | `Claude` |
| Google Gemini | `Gemini` |
| Full stack topics | `Full Stack` |
| Frontend topics | `Frontend` |
| Backend topics | `Backend` |
| Performance | `Rendimiento Web` (ES) / `Web Performance` (EN) |
| Productivity | `Productividad` (ES) / `Productivity` (EN) |
