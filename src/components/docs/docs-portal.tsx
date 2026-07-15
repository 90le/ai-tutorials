import { ArrowRight, Clock, MapTrifold } from '@phosphor-icons/react/ssr';
import Link from 'next/link';
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

      <aside className="docs-portal-aside" aria-label="文档首页上下文">
        <section>
          <span>本页目录</span>
          <nav>
            <a href="#docs-portal">知识库首页</a>
            <a href="#learning-destinations-title">四大学习目的地</a>
            <a href="#knowledge-path-title">探索知识地图</a>
            <a href="#content-feed-title">最近更新</a>
          </nav>
        </section>
        <section>
          <span><MapTrifold aria-hidden="true" /> 学习路径</span>
          <strong>从真实任务进入</strong>
          <p>第一次访问建议先完成一个 20 分钟的小任务，再选择工具或系列课程。</p>
          <Link href="/docs/start-here/" prefetch={false}>开始学习 <ArrowRight aria-hidden="true" /></Link>
        </section>
        <section>
          <span><Clock aria-hidden="true" /> 最近更新</span>
          {index.recent.length > 0 ? (
            <ul>
              {index.recent.slice(0, 4).map((article) => (
                <li key={article.url}>
                  <Link href={article.url} prefetch={false}>{article.title}</Link>
                  <small>{article.dateLabel}</small>
                </li>
              ))}
            </ul>
          ) : <p>新文章接入后会显示在这里。</p>}
        </section>
      </aside>
    </main>
  );
}
