import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { docsOptions } from '@/lib/layout.shared';
import { buildKnowledgePageTree } from '@/lib/docs-navigation';
import './docs-theme.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={buildKnowledgePageTree(source.getPageTree())}
      {...docsOptions()}
      tabs={false}
      containerProps={{ className: 'docs-shell' }}
      sidebar={{
        defaultOpenLevel: 0,
      }}
    >
      {children}
    </DocsLayout>
  );
}
