import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://scalio-web.vercel.app",
  redirects: {
    '/scalio': '/#servicios',
    '/contacto': '/#contacto',
  },
  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: "es",
        locales: {
          es: "es-PE",
        },
      },
      filter: (page) => !page.includes("/gracias") && !page.includes("/admin"),
      serialize(item) {
        if (item.url === "https://scalio-web.vercel.app/") {
          item.priority = 1.0;
          item.changefreq = "daily";
        } else if (item.url.includes("/blog/")) {
          item.priority = 0.6;
        }
        return item;
      },
    }),
  ],
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["astro"],
          },
        },
      },
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});
