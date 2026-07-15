import type { DocsIndex } from '@/lib/docs-content';
import { ContentFeed } from './content-feed';
import { DocsPortalSearch } from './docs-portal-search';
import { KnowledgePath } from './knowledge-path';
import { LearningDestinations } from './learning-destinations';

export function DocsPortal({ index }: { index: DocsIndex }) {
  return (
    <main className="docs-portal" id="docs-portal">
      <div className="docs-portal-main">
        <header className="docs-portal-hero">
          <div className="docs-portal-eyebrow"><i aria-hidden="true" /> AI KNOWLEDGE WORKBENCH</div>
          <h1>欢迎来到<br />AI 使用教程</h1>
          <p>面向创作者与实践者的 AI 工程知识库：从模型、工具到真实工作流，把零散技巧连接成可复用的方法。</p>
          <DocsPortalSearch />
          <div className="docs-portal-stats" aria-label="知识库当前状态">
            <span><strong>{index.totalArticles}</strong> 篇实践文章</span>
            <span><strong>{Object.keys(index.categoryCounts).length}</strong> 个已有内容方向</span>
            <span>持续更新 · 公开可访问</span>
          </div>
        </header>
        <LearningDestinations />
        <KnowledgePath />
        <ContentFeed featured={index.featured} recent={index.recent} />
      </div>
    </main>
  );
}
