import { describe, expect, it } from 'vitest';
import { buildDocsIndex, normalizeDocPage, type DocPageInput } from './docs-content';

function page(overrides: Partial<DocPageInput> = {}): DocPageInput {
  return {
    url: '/docs/notes/example',
    path: 'notes/example.mdx',
    slugs: ['notes', 'example'],
    data: {
      title: 'Example',
      description: 'Example description',
      tags: ['AI'],
      published: '2026-07-10',
      difficulty: '入门',
      status: 'published',
    },
    ...overrides,
  };
}

describe('normalizeDocPage', () => {
  it('normalizes category metadata and a stable date label', () => {
    const result = normalizeDocPage(page());

    expect(result).toMatchObject({
      category: 'notes',
      categoryLabel: '实验与笔记',
      dateLabel: '2026.07.10',
      difficulty: '入门',
      url: '/docs/notes/example/',
    });
  });

  it('rejects a malformed published date', () => {
    expect(() =>
      normalizeDocPage(page({ data: { title: 'Bad date', published: '2026/07/10' } })),
    ).toThrow('Invalid published date');
  });
});

describe('buildDocsIndex', () => {
  it('sorts published articles newest first and excludes planned pages', () => {
    const older = page({
      url: '/docs/notes/older/',
      path: 'notes/older.mdx',
      data: { title: 'Older', published: '2026-07-01' },
    });
    const newer = page({
      url: '/docs/tools/newer/',
      path: 'tools/newer.mdx',
      slugs: ['tools', 'newer'],
      data: { title: 'Newer', published: '2026-07-12' },
    });
    const planned = page({
      url: '/docs/notes/planned/',
      path: 'notes/planned.mdx',
      data: { title: 'Planned', published: '2026-07-15', status: 'planned' },
    });

    const result = buildDocsIndex([older, planned, newer]);

    expect(result.recent.map((item) => item.title)).toEqual(['Newer', 'Older']);
    expect(result.totalArticles).toBe(2);
  });

  it('uses the newest articles when no page is featured', () => {
    const result = buildDocsIndex([
      page({ data: { title: 'Older', published: '2026-07-01' } }),
      page({
        url: '/docs/tools/newer/',
        path: 'tools/newer.mdx',
        slugs: ['tools', 'newer'],
        data: { title: 'Newer', published: '2026-07-12' },
      }),
    ]);

    expect(result.featured.map((item) => item.title)).toEqual(['Newer', 'Older']);
    expect(result.featuredCount).toBe(0);
  });

  it('counts every featured article while limiting the portal feed to three', () => {
    const pages = Array.from({ length: 6 }, (_, index) =>
      page({
        url: `/docs/notes/featured-${index}/`,
        path: `notes/featured-${index}.mdx`,
        slugs: ['notes', `featured-${index}`],
        data: {
          title: `Featured ${index}`,
          published: `2026-07-${String(index + 1).padStart(2, '0')}`,
          featured: true,
        },
      }),
    );

    const result = buildDocsIndex(pages);

    expect(result.featuredCount).toBe(6);
    expect(result.featured).toHaveLength(3);
  });

  it('counts real articles by category and ignores category landing pages', () => {
    const categoryLanding = page({
      url: '/docs/tools/',
      path: 'tools/index.mdx',
      slugs: ['tools'],
      data: { title: 'Tools', published: '2026-07-15' },
    });

    const result = buildDocsIndex([
      categoryLanding,
      page({
        url: '/docs/tools/chatgpt/',
        path: 'tools/chatgpt.mdx',
        slugs: ['tools', 'chatgpt'],
        data: { title: 'ChatGPT', published: '2026-07-14' },
      }),
      page(),
    ]);

    expect(result.totalArticles).toBe(2);
    expect(result.categoryCounts).toEqual({ notes: 1, tools: 1 });
  });
});
