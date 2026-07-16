import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsPage,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { DocsPortal } from '@/components/docs/docs-portal';
import { buildDocsIndex, type DocPageInput } from '@/lib/docs-content';
import { DocsArticleHeader } from '@/components/docs/docs-article-header';
import { DocsTocHeader } from '@/components/docs/docs-toc-header';
import { getKnowledgeTrail } from '@/lib/docs-navigation';
import { getArticleNeighbors } from '@/lib/docs-navigation';
import { DocsReadingControls } from '@/components/docs/docs-reading-controls';
import { ArticlePager } from '@/components/docs/article-pager';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  if (page.slugs.length === 0) {
    const index = buildDocsIndex(source.getPages() as DocPageInput[]);
    return <DocsPortal index={index} />;
  }

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`;
  const trail = getKnowledgeTrail(page.url);
  const neighbors = getArticleNeighbors(page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{ enabled: false }}
      tableOfContent={{ header: <DocsTocHeader /> }}
    >
      <DocsReadingControls />
      <DocsArticleHeader
        title={page.data.title}
        description={page.data.description}
        trail={trail.length > 0 ? trail : [{ name: 'AI 知识库' }, { name: page.data.title }]}
        published={page.data.published}
        difficulty={page.data.difficulty}
        tags={page.data.tags}
        markdownUrl={markdownUrl}
        githubUrl={githubUrl}
      />
      <DocsBody className="docs-page-content">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      <ArticlePager {...neighbors} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
