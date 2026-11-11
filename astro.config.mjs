// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import emdash from 'emdash/astro';
import { d1, r2 } from '@emdash-cms/cloudflare';

const rawEmdash = emdash({
  database: d1({ binding: 'DB', session: 'disabled' }),
  storage: r2({ binding: 'MEDIA' }),
});

const origSetup = rawEmdash.hooks?.['astro:config:setup'];
if (origSetup && rawEmdash.hooks) {
  rawEmdash.hooks['astro:config:setup'] = async (params) => {
    return origSetup({
      ...params,
      addMiddleware: () => {},
      injectRoute: (route) => {
        if (route.pattern === '/_emdash/admin/[...path]') {
          params.injectRoute({
            pattern: '/_emdash/_internal_admin_assets',
            entrypoint: route.entrypoint,
          });
        }
      },
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://eosinophilicgastroenteritis-ege.pages.dev',
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    react(),
    {
      name: 'emdash-api-override',
      hooks: {
        'astro:config:setup'({ injectRoute }) {
          const routes = [
            '/_emdash/admin',
            '/_emdash/admin/[...path]',
            '/_emdash/api/calendar',
            '/_emdash/api/dashboard',
            '/_emdash/api/admin/comments/counts',
            '/_emdash/api/admin/comments',
            '/_emdash/api/admin/core-update',
            '/_emdash/api/content/posts',
            '/_emdash/api/content/posts/authors',
            '/_emdash/api/content/posts/trash',
            '/_emdash/api/content/posts/[id]',
            '/_emdash/api/content/posts/[id]/translations',
            '/_emdash/api/content/pages',
            '/_emdash/api/content/pages/authors',
            '/_emdash/api/content/pages/trash',
            '/_emdash/api/taxonomies',
            '/_emdash/api/settings',
            '/_emdash/api/relations',
            '/_emdash/api/schema/collections',
            '/_emdash/api/schema/collections/[...slug]',
            '/_emdash/api/schema/orphans',
            '/_emdash/api/schema/block-types',
            '/_emdash/api/menus',
            '/_emdash/api/admin/menus',
            '/_emdash/api/redirects',
            '/_emdash/api/users',
            '/_emdash/api/admin/users',
            '/_emdash/api/admin/users/[id]',
            '/_emdash/api/bylines',
            '/_emdash/api/admin/bylines',
            '/_emdash/api/admin/bylines/[id]',
            '/_emdash/api/byline-schema',
            '/_emdash/api/plugins',
            '/_emdash/api/admin/plugins',
            '/_emdash/api/media',
            '/_emdash/api/admin/media',
            '/_emdash/api/media/folders',
            '/_emdash/api/[...path]',
            '/_emdash/api/auth/me',
            '/_emdash/api/manifest',
          ];
          for (const pattern of routes) {
            injectRoute({
              pattern,
              entrypoint: './src/pages/[...catchall].ts',
            });
          }
        },
      },
    },
    rawEmdash,
  ],
});
