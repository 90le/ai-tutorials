import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { docsOptions } from '@/lib/layout.shared';
import Link from 'next/link';
import { ArrowLeft, GithubLogo } from '@phosphor-icons/react/ssr';
import './docs-theme.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...docsOptions()}
      tabs={false}
      containerProps={{ className: 'docs-shell' }}
      sidebar={{
        defaultOpenLevel: 1,
        footer: (
          <div className="docs-sidebar-footer">
            <Link href="/" prefetch={false}><ArrowLeft aria-hidden="true" /> 返回官网</Link>
            <a href="https://github.com/90le/ai-tutorials" rel="noreferrer" target="_blank"><GithubLogo aria-hidden="true" /> GitHub</a>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
