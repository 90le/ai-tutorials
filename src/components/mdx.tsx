import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
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
import { ArticleVideo } from '@/components/docs/article-video';
import { DataTable } from '@/components/docs/data-table';
import { DownloadCard } from '@/components/docs/download-card';
import { FormulaBlock } from '@/components/docs/formula-block';
import { ChartFrame } from '@/components/docs/chart-frame';
import { DocsCodeBlock } from '@/components/docs/docs-code-block';
import {
  AgentFlowStudio,
  ContextBudgetComposer,
  CostLatencySimulator,
  EvidenceNetwork,
  FailureStateGallery,
  ModelTradeoffMatrix,
  MultiAgentOrchestration,
  PromptDiffLab,
  RetrievalExplorer,
  StreamingResponseTimeline,
  ToolCallTrace,
} from '@/components/docs/experience-lab/workbench-components';
import { SemanticSpace3D } from '@/components/docs/experience-lab/semantic-space-3d';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Steps,
    Step,
    Tabs,
    Tab,
    Accordions,
    Accordion,
    TypeTable,
    pre: DocsCodeBlock,
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
    ArticleVideo,
    FormulaBlock,
    DataTable,
    DownloadCard,
    ChartFrame,
    AgentFlowStudio,
    PromptDiffLab,
    ContextBudgetComposer,
    RetrievalExplorer,
    ToolCallTrace,
    MultiAgentOrchestration,
    ModelTradeoffMatrix,
    CostLatencySimulator,
    EvidenceNetwork,
    SemanticSpace3D,
    StreamingResponseTimeline,
    FailureStateGallery,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
