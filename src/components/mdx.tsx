import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { PromptCard } from '@/components/docs/prompt-card';
import { SourcesDisclosure } from '@/components/docs/sources-disclosure';
import { KeyTakeaways } from '@/components/docs/key-takeaways';
import { MermaidDiagram } from '@/components/docs/mermaid-diagram';
import { ScenarioTabs } from '@/components/docs/scenario-tabs';
import { SourceMixChart } from '@/components/docs/source-mix-chart';
import { ArticleImage } from '@/components/docs/article-image';
import { ImageGallery } from '@/components/docs/image-gallery';
import { ImageCompare } from '@/components/docs/image-compare';
import { MediaFrame } from '@/components/docs/media-frame';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    PromptCard,
    SourcesDisclosure,
    KeyTakeaways,
    MermaidDiagram,
    ScenarioTabs,
    SourceMixChart,
    MediaFrame,
    ArticleImage,
    ImageGallery,
    ImageCompare,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
