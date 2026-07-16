import { describe, expect, it } from 'vitest';
import type * as PageTree from 'fumadocs-core/page-tree';
import { buildKnowledgePageTree, getArticleNeighbors, getKnowledgeTrail } from './docs-navigation';

const urls = {
  home: '/docs/',
  taskSystem: '/docs/start-here/ai-task-operating-system/',
  learningPath: '/docs/series/ai-capability-operating-system/',
  research: '/docs/tools/chatgpt/deep-research-workflow/',
  secondBrain: '/docs/playbooks/ai-second-brain/',
  visual: '/docs/playbooks/ai-visual-production/',
  codex: '/docs/tools/codex/agentic-repository-delivery/',
  toolkit: '/docs/reference/agent-ready-toolkit/',
} as const;

function item(name: string, url: string): PageTree.Item {
  return { type: 'page', name, url };
}

function fixture(excluded: string[] = []): PageTree.Root {
  const pages = [
    item('旧知识库首页', urls.home),
    item('AI 任务操作系统', urls.taskSystem),
    item('完整学习路线', urls.learningPath),
    item('ChatGPT 深度研究', urls.research),
    item('AI 第二大脑', urls.secondBrain),
    item('AI 视觉生产', urls.visual),
    item('Codex 智能体仓库交付', urls.codex),
    item('Agent-ready 工具链', urls.toolkit),
    item('不应显示的分类页', '/docs/notes/'),
  ].filter((page) => !excluded.includes(page.url));

  return {
    type: 'root',
    name: 'Docs',
    children: [
      pages[0],
      {
        type: 'folder',
        name: '旧文件结构',
        children: pages.slice(1),
      },
    ],
  };
}

function collectUrls(nodes: PageTree.Node[]): string[] {
  return nodes.flatMap((node) => {
    if (node.type === 'page') return [node.url];
    if (node.type === 'folder') return collectUrls(node.children);
    return [];
  });
}

function folderNames(node: PageTree.Node): string[] {
  if (node.type !== 'folder') return [];
  return [String(node.name), ...node.children.flatMap(folderNames)];
}

describe('buildKnowledgePageTree', () => {
  it('creates a stable reader-facing hierarchy without duplicate URLs', () => {
    const tree = buildKnowledgePageTree(fixture());

    expect(tree.children.map((node) => String(node.name))).toEqual([
      '知识库首页',
      '开始',
      'AI 应用',
      'Agent 工程',
    ]);

    expect(tree.children.flatMap(folderNames)).toEqual([
      '开始',
      '使用方法',
      '学习路线',
      'AI 应用',
      '研究与知识',
      '视觉与内容',
      'Agent 工程',
      '编程交付',
      '工具与协议',
    ]);

    const allUrls = collectUrls(tree.children);
    expect(allUrls).toEqual([
      urls.home,
      urls.taskSystem,
      urls.learningPath,
      urls.research,
      urls.secondBrain,
      urls.visual,
      urls.codex,
      urls.toolkit,
    ]);
    expect(new Set(allUrls).size).toBe(allUrls.length);
  });

  it('omits missing pages and never emits an empty knowledge group', () => {
    const tree = buildKnowledgePageTree(fixture([
      urls.learningPath,
      urls.research,
      urls.secondBrain,
      urls.visual,
      urls.codex,
      urls.toolkit,
    ]));

    expect(tree.children.map((node) => String(node.name))).toEqual([
      '知识库首页',
      '开始',
    ]);
    expect(collectUrls(tree.children)).toEqual([urls.home, urls.taskSystem]);
  });

  it('returns the same reader-facing hierarchy for article breadcrumbs', () => {
    expect(getKnowledgeTrail(urls.research)).toEqual([
      { name: 'AI 应用' },
      { name: '研究与知识' },
      { name: 'ChatGPT 深度研究', href: urls.research },
    ]);

    expect(getKnowledgeTrail('/docs/unknown/')).toEqual([]);
  });

  it('returns previous and next articles in knowledge-tree order', () => {
    expect(getArticleNeighbors(urls.taskSystem)).toEqual({
      next: { group: '开始', section: '学习路线', name: 'AI 能力操作系统', url: urls.learningPath },
    });
    expect(getArticleNeighbors(urls.research)).toEqual({
      previous: { group: '开始', section: '学习路线', name: 'AI 能力操作系统', url: urls.learningPath },
      next: { group: 'AI 应用', section: '研究与知识', name: 'AI 第二大脑', url: urls.secondBrain },
    });
    expect(getArticleNeighbors(urls.toolkit)).toEqual({
      previous: { group: 'Agent 工程', section: '编程交付', name: 'Codex 智能体仓库交付', url: urls.codex },
    });
  });
});
