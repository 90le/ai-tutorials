export const DOC_CATEGORY_LABELS = {
  'start-here': '从这里开始',
  tools: '工具教程',
  series: '系列课程',
  playbooks: '场景打法',
  notes: '单篇笔记',
  reference: '参考资料',
} as const;

export type DocDifficulty = '入门' | '进阶' | '专家';
export type DocStatus = 'published' | 'planned';

export interface DocPageInput {
  url: string;
  path: string;
  slugs: string[];
  data: {
    title: string;
    description?: string;
    tags?: string[];
    published: string;
    difficulty?: DocDifficulty;
    featured?: boolean;
    status?: DocStatus;
  };
}

export interface DocSummary {
  title: string;
  description: string;
  url: string;
  path: string;
  slugs: string[];
  category: string;
  categoryLabel: string;
  tags: string[];
  published: string;
  dateLabel: string;
  difficulty?: DocDifficulty;
  featured: boolean;
}

export interface DocsIndex {
  articles: DocSummary[];
  recent: DocSummary[];
  featured: DocSummary[];
  totalArticles: number;
  categoryCounts: Record<string, number>;
}

function isValidPublishedDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isCategoryLanding(page: DocPageInput) {
  return page.slugs.length <= 1;
}

export function normalizeDocPage(page: DocPageInput): DocSummary {
  if (!isValidPublishedDate(page.data.published)) {
    throw new Error(`Invalid published date for ${page.path}: ${page.data.published}`);
  }

  const category = page.slugs[0] ?? 'docs';
  const categoryLabel = DOC_CATEGORY_LABELS[category as keyof typeof DOC_CATEGORY_LABELS] ?? 'AI 知识库';

  return {
    title: page.data.title,
    description: page.data.description ?? '',
    url: page.url,
    path: page.path,
    slugs: page.slugs,
    category,
    categoryLabel,
    tags: page.data.tags ?? [],
    published: page.data.published,
    dateLabel: page.data.published.replaceAll('-', '.'),
    difficulty: page.data.difficulty,
    featured: page.data.featured ?? false,
  };
}

export function buildDocsIndex(pages: DocPageInput[]): DocsIndex {
  const articles = pages
    .filter((page) => page.data.status !== 'planned' && !isCategoryLanding(page))
    .map(normalizeDocPage)
    .sort((a, b) => b.published.localeCompare(a.published));

  const selected = articles.filter((article) => article.featured);
  const categoryCounts = articles.reduce<Record<string, number>>((counts, article) => {
    counts[article.category] = (counts[article.category] ?? 0) + 1;
    return counts;
  }, {});

  return {
    articles,
    recent: articles,
    featured: (selected.length > 0 ? selected : articles).slice(0, 3),
    totalArticles: articles.length,
    categoryCounts,
  };
}
