import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://eosinophilicgastroenteritis-ege.pages.dev',
  image: {
    service: passthroughImageService(),
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
