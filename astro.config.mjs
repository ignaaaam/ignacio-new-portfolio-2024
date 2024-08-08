import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercelStatic from "@astrojs/vercel/static";
import react from "@astrojs/react";
import db from "@astrojs/db";

import webVitals from "@astrojs/web-vitals";

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "es",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  output: "static",
  integrations: [tailwind(), partytown({
    config: {
      config: {
        debug: false
      },
      forward: ["dataLayer.push"]
    }
  }), sitemap(), react(), db(), webVitals()],
  adapter: vercelStatic({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    }
  })
});