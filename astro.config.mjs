import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercelStatic from "@astrojs/vercel/static";

import react from "@astrojs/react";

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
  integrations: [
    tailwind(),
    partytown({
      config: {
        config: {
          debug: false,
        },
        forward: ["dataLayer.push"],
      },
    }),
    sitemap(),
    react(),
  ],
  adapter: vercelStatic({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
  }),
});
