// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://mybazidestiny.com',
  output: 'static',
  adapter: vercel({
    // API routes (leaderboard) run as serverless functions; pages stay static
    isr: false,
  }),
  trailingSlash: 'never',
  build: {
    // Preserve legacy URLs exactly: /blog.html, /1960-rat-destiny.html ...
    format: 'file',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
  },
});
