import type * as PageTree from 'fumadocs-core/page-tree';

const KNOWLEDGE_GROUPS = [
  {
    id: 'knowledge-start',
    name: '开始',
    sections: [
      {
        id: 'knowledge-start-method',
        name: '使用方法',
        pages: [
          {
            name: 'AI 任务操作系统',
            url: '/docs/start-here/ai-task-operating-system/',
          },
        ],
      },
      {
        id: 'knowledge-start-path',
        name: '学习路线',
        pages: [
          {
            name: 'AI 能力操作系统',
            url: '/docs/series/ai-capability-operating-system/',
          },
        ],
      },
    ],
  },
  {
    id: 'knowledge-applications',
    name: 'AI 应用',
    sections: [
      {
        id: 'knowledge-research',
        name: '研究与知识',
        pages: [
          {
            name: 'ChatGPT 深度研究',
            url: '/docs/tools/chatgpt/deep-research-workflow/',
          },
          {
            name: 'AI 第二大脑',
            url: '/docs/playbooks/ai-second-brain/',
          },
        ],
      },
      {
        id: 'knowledge-visual',
        name: '视觉与内容',
        pages: [
          {
            name: 'AI 视觉生产',
            url: '/docs/playbooks/ai-visual-production/',
          },
        ],
      },
    ],
  },
  {
    id: 'knowledge-agent-engineering',
    name: 'Agent 工程',
    sections: [
      {
        id: 'knowledge-agent-delivery',
        name: '编程交付',
        pages: [
          {
            name: 'Codex 智能体仓库交付',
            url: '/docs/tools/codex/agentic-repository-delivery/',
          },
        ],
      },
      {
        id: 'knowledge-agent-tools',
        name: '工具与协议',
        pages: [
          {
            name: 'Agent-ready 工具链',
            url: '/docs/reference/agent-ready-toolkit/',
          },
        ],
      },
    ],
  },
] as const;

const OFFICIAL_GUIDE = {
  index: { name: '指南首页', url: '/docs/help/' },
  sections: [
    { id: 'official-reading', name: '阅读与导航', pages: [
      { name: '如何使用知识库', url: '/docs/help/reading-navigation/using-the-knowledge-base/' },
      { name: '搜索、目录与阅读工具', url: '/docs/help/reading-navigation/search-toc-reading-tools/' },
    ] },
    { id: 'official-layout', name: '内容与排版', pages: [
      { name: 'Markdown 完整样式', url: '/docs/help/content-layout/markdown-complete-reference/' },
      { name: '提示、步骤、页签与折叠', url: '/docs/help/content-layout/structured-content-components/' },
      { name: '代码、公式、表格与附件', url: '/docs/help/content-layout/code-formula-table-assets/' },
    ] },
    { id: 'official-media', name: '图示与富媒体', pages: [
      { name: 'Mermaid 与无限画布', url: '/docs/help/visual-media/mermaid-infinite-canvas/' },
      { name: '数据图表与可视化', url: '/docs/help/visual-media/data-charts-visualization/' },
      { name: '图片、图库、视频与标注', url: '/docs/help/visual-media/images-gallery-video-annotation/' },
    ] },
    { id: 'official-ai', name: 'AI 交互组件', pages: [
      { name: 'Agent 与工具调用', url: '/docs/help/ai-interactions/agents-tool-calls/' },
      { name: '提示词、上下文与检索', url: '/docs/help/ai-interactions/prompts-context-retrieval/' },
      { name: '模型、成本、证据网络与 3D', url: '/docs/help/ai-interactions/models-cost-evidence-3d/' },
    ] },
    { id: 'official-quality', name: '设计与质量', pages: [
      { name: '主题、动画与视觉效果', url: '/docs/help/design-quality/themes-motion-effects/' },
      { name: '移动端、无障碍与打印', url: '/docs/help/design-quality/mobile-accessibility-print/' },
      { name: '组件选型指南', url: '/docs/help/design-quality/component-selection-guide/' },
      { name: '完整回归检查', url: '/docs/help/design-quality/complete-regression-check/' },
    ] },
  ],
} as const;

export interface KnowledgePage {
  group: string;
  section: string;
  name: string;
  url: string;
}

function normalizeUrl(url: string) {
  return url.endsWith('/') ? url : `${url}/`;
}

function collectPages(nodes: PageTree.Node[], pages = new Map<string, PageTree.Item>()) {
  for (const node of nodes) {
    if (node.type === 'page') {
      pages.set(normalizeUrl(node.url), node);
    } else if (node.type === 'folder') {
      if (node.index) pages.set(normalizeUrl(node.index.url), node.index);
      collectPages(node.children, pages);
    }
  }

  return pages;
}

export function getKnowledgeTrail(url: string) {
  const normalizedUrl = normalizeUrl(url);

  if (normalizeUrl(OFFICIAL_GUIDE.index.url) === normalizedUrl) {
    return [{ name: '官方指南' }, { name: OFFICIAL_GUIDE.index.name, href: OFFICIAL_GUIDE.index.url }];
  }

  for (const section of OFFICIAL_GUIDE.sections) {
    const page = section.pages.find((candidate) => normalizeUrl(candidate.url) === normalizedUrl);
    if (page) return [{ name: '官方指南' }, { name: section.name }, { name: page.name, href: page.url }];
  }

  for (const group of KNOWLEDGE_GROUPS) {
    for (const section of group.sections) {
      const page = section.pages.find((candidate) => normalizeUrl(candidate.url) === normalizedUrl);
      if (page) {
        return [
          { name: group.name },
          { name: section.name },
          { name: page.name, href: page.url },
        ];
      }
    }
  }

  return [];
}

function getKnowledgePages(): KnowledgePage[] {
  const officialPages: KnowledgePage[] = [
    { group: '官方指南', section: '指南总览', ...OFFICIAL_GUIDE.index },
    ...OFFICIAL_GUIDE.sections.flatMap((section) => section.pages.map((page) => ({ group: '官方指南', section: section.name, ...page }))),
  ];

  return [...officialPages, ...KNOWLEDGE_GROUPS.flatMap((group) =>
    group.sections.flatMap((section) =>
      section.pages.map((page) => ({
        group: group.name,
        section: section.name,
        name: page.name,
        url: page.url,
      })),
    ),
  )];
}

export function getArticleNeighbors(url: string): {
  previous?: KnowledgePage;
  next?: KnowledgePage;
} {
  const pages = getKnowledgePages();
  const index = pages.findIndex((page) => normalizeUrl(page.url) === normalizeUrl(url));
  if (index < 0) return {};

  return {
    previous: index > 0 ? pages[index - 1] : undefined,
    next: index < pages.length - 1 ? pages[index + 1] : undefined,
  };
}

export function buildKnowledgePageTree(root: PageTree.Root): PageTree.Root {
  const pages = collectPages(root.children);
  const home = pages.get('/docs/');
  const children: PageTree.Node[] = [];

  if (home) {
    children.push({ ...home, name: '知识库首页' });
  }

  const guideIndex = pages.get(normalizeUrl(OFFICIAL_GUIDE.index.url));
  const guideSections = OFFICIAL_GUIDE.sections.map((section) => ({
    $id: section.id,
    type: 'folder' as const,
    name: section.name,
    collapsible: true,
    defaultOpen: false,
    children: section.pages.map((page) => pages.get(normalizeUrl(page.url))).filter((page): page is PageTree.Item => page !== undefined),
  })).filter((section) => section.children.length > 0);

  if (guideIndex || guideSections.length > 0) {
    children.push({
      $id: 'official-guide',
      type: 'folder',
      name: '官方指南',
      index: guideIndex,
      collapsible: true,
      defaultOpen: false,
      children: guideSections,
    });
  }

  for (const group of KNOWLEDGE_GROUPS) {
    const groupChildren: PageTree.Folder[] = [];

    for (const section of group.sections) {
      const sectionChildren = section.pages
        .map((page) => pages.get(normalizeUrl(page.url)))
        .filter((page): page is PageTree.Item => page !== undefined);

      if (sectionChildren.length === 0) continue;

      groupChildren.push({
        $id: section.id,
        type: 'folder',
        name: section.name,
        collapsible: true,
        defaultOpen: false,
        children: sectionChildren,
      });
    }

    if (groupChildren.length === 0) continue;

    children.push({
      $id: group.id,
      type: 'folder',
      name: group.name,
      collapsible: true,
      defaultOpen: false,
      children: groupChildren,
    });
  }

  return {
    ...root,
    name: 'AI 知识库',
    children,
  };
}
