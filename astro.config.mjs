import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
// import vercelStatic from "@astrojs/vercel/static";
import react from "@astrojs/react";
import db from "@astrojs/db";

import webVitals from "@astrojs/web-vitals";

import cloudflare from "@astrojs/cloudflare";

import tailwind from "@astrojs/tailwind";

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
  output: "server",
  integrations: [partytown({
    config: {
      config: {
        debug: false
      },
      forward: ["dataLayer.push"]
    }
  }), sitemap(), react(), db(), webVitals(), tailwind()],
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    }
  })
});