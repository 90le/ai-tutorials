import { ArrowRight, FileText, Sparkle } from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import type { DocSummary } from '@/lib/docs-content';

function ArticleRow({ article, compact = false }: { article: DocSummary; compact?: boolean }) {
  return (
    <Link className={compact ? 'docs-feed-row docs-feed-row-compact' : 'docs-feed-row'} href={article.url} prefetch={false}>
      <FileText aria-hidden="true" weight="regular" />
      <div>
        <strong>{article.title}</strong>
        {compact ? null : <p>{article.description}</p>}
        <span>
          {article.categoryLabel} · {article.dateLabel}
          {article.difficulty ? ` · ${article.difficulty}` : ''}
        </span>
      </div>
      <ArrowRight aria-hidden="true" weight="bold" />
    </Link>
  );
}

export function ContentFeed({ featured, recent }: { featured: DocSummary[]; recent: DocSummary[] }) {
  const hasArticles = featured.length > 0 || recent.length > 0;

  return (
    <section className="docs-content-feed" aria-labelledby="content-feed-title">
      <div className="docs-section-heading docs-section-heading-inline">
        <div>
          <span>03 / FIELD NOTES</span>
          <h2 id="content-feed-title">精选内容与最近更新</h2>
        </div>
        <p>从真实发布内容自动生成，不使用虚构数量或假进度。</p>
      </div>
      {hasArticles ? (
        <div className="docs-feed-columns">
          <div>
            <h3><Sparkle aria-hidden="true" weight="fill" /> 精选内容</h3>
            {featured.map((article) => <ArticleRow article={article} key={article.url} />)}
          </div>
          <div>
            <h3>最近更新</h3>
            {recent.slice(0, 6).map((article) => <ArticleRow article={article} compact key={article.url} />)}
          </div>
        </div>
      ) : (
        <div className="docs-feed-empty">
          <strong>第一批实践教程正在接入</strong>
          <p>先从快速开始了解本站的学习方法，新文章发布后会自动出现在这里。</p>
          <Link href="/docs/start-here/" prefetch={false}>前往快速开始 <ArrowRight aria-hidden="true" /></Link>
        </div>
      )}
    </section>
  );
}
