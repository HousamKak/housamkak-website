import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One file per project: src/content/work/<slug>.md  (slug = filename, must match projects.json slug)
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    order: z.number().default(100),            // sort within tier, lower first
    hook: z.string(),                           // one line, shown on cards
    summary: z.string(),                        // 2 or 3 sentences, used for meta description and page intro
    categories: z.array(z.string()).default([]),
    role: z.string(),                           // honest ownership line, e.g. "Sole designer and engineer"
    period: z.string(),                         // e.g. "Mar 2026 to now"
    status: z.string(),                         // plain-language status
    stack: z.array(z.string()).default([]),
    highlights: z.array(z.string()).default([]),// 3 to 6 short technical highlights
    credits: z.array(z.string()).default([]),   // collaborators and upstream credit
    links: z.object({
      live: z.string().url().optional(),
      repo: z.string().url().optional(),
      writing: z.string().optional(),           // related blog post URL
    }).default({}),
    openQuestions: z.array(z.string()).default([]), // NOT rendered publicly; review list for Housam
    confidential: z.boolean().default(false),   // true = summary-only page, no internals
    draft: z.boolean().default(false),
  }),
});

const cv = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cv' }),
  schema: z.object({ title: z.string(), updated: z.coerce.date() }),
});

export const collections = { work, cv };
