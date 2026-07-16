import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { PromptCard } from '@/components/docs/prompt-card';
import { SourcesDisclosure } from '@/components/docs/sources-disclosure';
import { KeyTakeaways } from '@/components/docs/key-takeaways';
import { MermaidDiagram } from '@/components/docs/mermaid-diagram';
import { ScenarioTabs } from '@/components/docs/scenario-tabs';
import { SourceMixChart } from '@/components/docs/source-mix-chart';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    PromptCard,
    SourcesDisclosure,
    KeyTakeaways,
    MermaidDiagram,
    ScenarioTabs,
    SourceMixChart,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
