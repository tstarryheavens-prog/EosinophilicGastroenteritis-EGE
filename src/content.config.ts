import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    eyecatch: z.string().optional(),
    slug: z.string(),
    enSlug: z.string().optional()
  })
});

const blog_en = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog_en' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    eyecatch: z.string().optional(),
    slug: z.string(),
    originalJaSlug: z.string().optional()
  })
});

export const collections = { blog, blog_en };
