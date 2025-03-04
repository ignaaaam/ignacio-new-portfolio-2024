import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
// import vercelStatic from "@astrojs/vercel/static";
import react from "@astrojs/react";
import db from "@astrojs/db";

import webVitals from "@astrojs/web-vitals";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
        noExternal: ['webcoreui']
    },
    css: {
      preprocessorOptions: {
          scss: {
              api: 'modern-compiler'
          }
      }
    }
  },
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
      debug: false,
      forward: ["dataLayer.push"],
      resolveUrl: (url) => {
        return url
      },
      loadScriptsOnMainThread: [
        "https://www.googletagmanager.com",
      ],
    }
  }), sitemap(), react(), db(), webVitals(), tailwind()],
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    },
  })
});