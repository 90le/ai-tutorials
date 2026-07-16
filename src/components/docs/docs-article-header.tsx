import { CalendarDots, Tag } from '@phosphor-icons/react/ssr';
import {
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import Link from 'next/link';
import type { DocDifficulty } from '@/lib/docs-content';

interface DocsArticleHeaderProps {
  title: string;
  description?: string;
  trail: Array<{ name: string; href?: string }>;
  published: string;
  difficulty?: DocDifficulty;
  tags: string[];
  markdownUrl: string;
  githubUrl: string;
}

export function DocsArticleHeader({
  title,
  description,
  trail,
  published,
  difficulty,
  tags,
  markdownUrl,
  githubUrl,
}: DocsArticleHeaderProps) {
  return (
    <header className="docs-article-header">
      <nav className="docs-article-breadcrumb" aria-label="面包屑">
        <Link href="/docs/" prefetch={false}>文档首页</Link>
        {trail.map((item, index) => (
          <span className="docs-article-breadcrumb-segment" key={`${item.name}-${index}`}>
            <span aria-hidden="true">/</span>
            {item.href && index < trail.length - 1 ? (
              <Link href={item.href} prefetch={false}>{item.name}</Link>
            ) : (
              <span aria-current={index === trail.length - 1 ? 'page' : undefined}>{item.name}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="docs-article-heading">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="docs-article-utility-row">
        <div className="docs-article-meta">
          <span><CalendarDots aria-hidden="true" /> {published.replaceAll('-', '.')}</span>
          {difficulty ? <span className={`docs-difficulty docs-difficulty-${difficulty}`}>{difficulty}</span> : null}
          {tags.length > 0 ? (
            <span className="docs-article-tags"><Tag aria-hidden="true" /> {tags.slice(0, 3).join(' · ')}</span>
          ) : null}
        </div>
        <div className="docs-article-actions" aria-label="页面操作">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
        </div>
      </div>
    </header>
  );
}
