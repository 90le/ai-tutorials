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
  category: string;
  categoryHref: string;
  published: string;
  difficulty?: DocDifficulty;
  tags: string[];
  markdownUrl: string;
  githubUrl: string;
}

export function DocsArticleHeader({
  title,
  description,
  category,
  categoryHref,
  published,
  difficulty,
  tags,
  markdownUrl,
  githubUrl,
}: DocsArticleHeaderProps) {
  return (
    <header className="docs-article-header">
      <div className="docs-article-breadcrumb">
        <Link href="/docs/" prefetch={false}>AI 使用教程</Link>
        <span>/</span>
        <Link href={categoryHref} prefetch={false}>{category}</Link>
      </div>
      <div className="docs-article-heading">
        <div>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        <div className="docs-article-actions" aria-label="页面操作">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
        </div>
      </div>
      <div className="docs-article-meta">
        <span><CalendarDots aria-hidden="true" /> {published.replaceAll('-', '.')}</span>
        {difficulty ? <span className={`docs-difficulty docs-difficulty-${difficulty}`}>{difficulty}</span> : null}
        {tags.length > 0 ? (
          <span className="docs-article-tags"><Tag aria-hidden="true" /> {tags.slice(0, 3).join(' · ')}</span>
        ) : null}
      </div>
    </header>
  );
}
