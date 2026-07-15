import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const publishedDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'published 必须使用 YYYY-MM-DD 格式');

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      tags: z.array(z.string()).default([]),
      published: publishedDate,
      difficulty: z.enum(['入门', '进阶', '专家']).optional(),
      featured: z.boolean().default(false),
      status: z.enum(['published', 'planned']).default('published'),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
