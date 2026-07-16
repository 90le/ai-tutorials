import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { KnowledgePage } from '@/lib/docs-navigation';

export function ArticlePager({
  previous,
  next,
}: {
  previous?: KnowledgePage;
  next?: KnowledgePage;
}) {
  if (!previous && !next) return null;

  return (
    <nav className="docs-article-pager" aria-label="继续阅读">
      {previous ? (
        <Link href={previous.url} prefetch={false} rel="prev" className="docs-article-pager-previous">
          <ArrowLeft aria-hidden="true" />
          <span><small>上一篇 · {previous.group} / {previous.section}</small><strong>{previous.name}</strong></span>
        </Link>
      ) : <span aria-hidden="true" />}
      {next ? (
        <Link href={next.url} prefetch={false} rel="next" className="docs-article-pager-next">
          <span><small>下一篇 · {next.group} / {next.section}</small><strong>{next.name}</strong></span>
          <ArrowRight aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}
