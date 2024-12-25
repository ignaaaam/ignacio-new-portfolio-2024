import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
// import vercelStatic from "@astrojs/vercel/static";
import react from "@astrojs/react";
import db from "@astrojs/db";

import webVitals from "@astrojs/web-vitals";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://ignathedev.com',
  i18n: {
    defaultLocale: "es",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  output: "hybrid",
  integrations: [tailwind(), partytown({
    config: {
      config: {
        debug: false
      },
      forward: ["dataLayer.push"]
    }
  }), sitemap(), react(), db(), webVitals()],
  adapter: cloudflare()
});