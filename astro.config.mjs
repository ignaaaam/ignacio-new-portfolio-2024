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
  site: 'https://www.ignathedev.com',
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
  }), sitemap({
    i18n: {
      defaultLocale: 'es',
      locales: {
        es: 'es-ES',
        en: 'en-US',
      },
    },
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
    filter: (page) => !page.includes('/api/') && !page.includes('/admin/'),
    serialize: (item) => {
      // Boost priority for important pages
      if (item.url === 'https://www.ignathedev.com/' || item.url === 'https://www.ignathedev.com/en/') {
        item.priority = 1.0;
        item.changefreq = 'daily';
      } else if (item.url.includes('/blog')) {
        item.priority = 0.8;
        item.changefreq = 'weekly';
      }
      return item;
    },
  }), react(), db(), webVitals(), tailwind()],
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    },
  })
});