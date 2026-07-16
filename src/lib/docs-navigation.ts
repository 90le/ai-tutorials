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
  return KNOWLEDGE_GROUPS.flatMap((group) =>
    group.sections.flatMap((section) =>
      section.pages.map((page) => ({
        group: group.name,
        section: section.name,
        name: page.name,
        url: page.url,
      })),
    ),
  );
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
