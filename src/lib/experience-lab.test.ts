import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('../../', import.meta.url));
const referenceMetaPath = join(root, 'content/docs/reference/meta.json');
const labMetaPath = join(root, 'content/docs/reference/experience-lab/meta.json');
const matrixPath = join(root, 'docs/rendering-capability-matrix.md');
const docsMetaPath = join(root, 'content/docs/meta.json');
const helpRoot = join(root, 'content/docs/help');
const helpPages = [
  'index.mdx',
  'reading-navigation/using-the-knowledge-base.mdx',
  'reading-navigation/search-toc-reading-tools.mdx',
  'content-layout/markdown-complete-reference.mdx',
  'content-layout/structured-content-components.mdx',
  'content-layout/code-formula-table-assets.mdx',
  'visual-media/mermaid-infinite-canvas.mdx',
  'visual-media/data-charts-visualization.mdx',
  'visual-media/images-gallery-video-annotation.mdx',
  'ai-interactions/agents-tool-calls.mdx',
  'ai-interactions/prompts-context-retrieval.mdx',
  'ai-interactions/models-cost-evidence-3d.mdx',
  'design-quality/themes-motion-effects.mdx',
  'design-quality/mobile-accessibility-print.mdx',
  'design-quality/component-selection-guide.mdx',
  'design-quality/complete-regression-check.mdx',
] as const;

const requiredMarkers = [
  '<Callout',
  '<Cards>',
  '<Steps>',
  '<Tabs',
  '<Accordions>',
  '<CodeBlockTabs',
  '<TypeTable',
  '<PromptCard',
  '<KeyTakeaways',
  '<ScenarioTabs',
  '<SourcesDisclosure',
  '<MediaFrame',
  '<MermaidDiagram',
  '<SourceMixChart',
  '<FormulaBlock',
  '<DataTable',
  '<DownloadCard',
  '<ArticleImage',
  '<ImageGallery',
  '<ImageCompare',
  '<ArticleVideo',
  '<AgentFlowStudio',
  '<PromptDiffLab',
  '<ContextBudgetComposer',
  '<RetrievalExplorer',
  '<ToolCallTrace',
  '<MultiAgentOrchestration',
  '<ModelTradeoffMatrix',
  '<CostLatencySimulator',
  '<EvidenceNetwork',
  '<SemanticSpace3D',
  '<StreamingResponseTimeline',
  '<FailureStateGallery',
  '<MetricBoard',
  '<NarrativeTimeline',
  '<ComparisonMatrix',
  '<DecisionTreeExplorer',
  '<AnnotatedImage',
  '<GlossaryGrid',
  '<CitationCluster',
  '<RevealSequence',
] as const;

describe('rendering and interaction lab', () => {
  it('publishes the official guide as a top-level multi-page knowledge tree', () => {
    const docsMeta = JSON.parse(readFileSync(docsMetaPath, 'utf8')) as { pages: string[] };
    expect(docsMeta.pages[1]).toBe('help');
    for (const page of helpPages) expect(existsSync(join(helpRoot, page)), page).toBe(true);
    for (const category of ['reading-navigation', 'content-layout', 'visual-media', 'ai-interactions', 'design-quality']) {
      expect(existsSync(join(helpRoot, category, 'meta.json')), category).toBe(true);
    }
  });

  it('moves the lab out of the reference tree and keeps migration routes', () => {
    expect(existsSync(labMetaPath)).toBe(true);
    expect(existsSync(matrixPath)).toBe(true);

    const referenceMeta = JSON.parse(readFileSync(referenceMetaPath, 'utf8')) as { pages: string[] };
    const labMeta = JSON.parse(readFileSync(labMetaPath, 'utf8')) as { title: string; pages: string[] };

    expect(referenceMeta.pages).not.toContain('experience-lab');
    expect(labMeta).toEqual({
      title: '旧版渲染实验室',
      pages: ['index'],
    });
    expect(readFileSync(join(root, 'content/docs/reference/experience-lab/complete-showcase.mdx'), 'utf8')).toContain('/docs/help/design-quality/complete-regression-check/');
    expect(readFileSync(join(root, 'content/docs/reference/experience-lab/ai-workbenches.mdx'), 'utf8')).toContain('/docs/help/ai-interactions/agents-tool-calls/');
    expect(readFileSync(join(root, 'content/docs/reference/experience-lab/infinite-canvas.mdx'), 'utf8')).toContain('/docs/help/visual-media/mermaid-infinite-canvas/');
  });

  it('publishes all twelve original AI workbench components across focused guides', () => {
    const guides = helpPages.map((page) => readFileSync(join(helpRoot, page), 'utf8')).join('\n');
    const components = [
      'AgentFlowStudio', 'PromptDiffLab', 'ContextBudgetComposer', 'RetrievalExplorer',
      'ToolCallTrace', 'MultiAgentOrchestration', 'ModelTradeoffMatrix', 'CostLatencySimulator',
      'EvidenceNetwork', 'SemanticSpace3D', 'StreamingResponseTimeline', 'FailureStateGallery',
    ];
    for (const component of components) expect(guides).toContain(`<${component} />`);
  });

  it('keeps every supported rendering primitive visible across the official guides', () => {
    const guides = helpPages.map((page) => readFileSync(join(helpRoot, page), 'utf8')).join('\n');
    expect(guides).toContain('published: 2026-07-16');
    for (const marker of requiredMarkers) expect(guides).toContain(marker);
  });

  it('keeps each official guide focused and free of placeholder copy', () => {
    for (const page of helpPages) {
      const source = readFileSync(join(helpRoot, page), 'utf8');
      expect(source, page).toContain('description:');
      expect(source, page).not.toMatch(/lorem|placeholder|待补充内容/i);
      expect(source.split('\n').length, page).toBeGreaterThan(12);
    }
  });

  it('publishes the complete visual asset set locally', () => {
    const imageFiles = [
      'knowledge-signal.webp',
      'collect.webp',
      'judge.webp',
      'deliver.webp',
      'raw-materials.webp',
      'evidence-map.webp',
    ];

    for (const file of imageFiles) {
      expect(existsSync(join(root, 'public/images/experience-lab', file)), file).toBe(true);
    }
  });

  it('publishes an accessible, lightweight local video package', () => {
    const videoDir = join(root, 'public/videos/experience-lab');
    const videoPath = join(videoDir, 'knowledge-flow.mp4');
    const posterPath = join(videoDir, 'knowledge-flow-poster.jpg');
    const vttPath = join(videoDir, 'knowledge-flow.zh-CN.vtt');
    const transcriptPath = join(root, 'public/downloads/experience-lab/knowledge-flow-transcript.md');

    for (const path of [videoPath, posterPath, vttPath, transcriptPath]) {
      expect(existsSync(path), path).toBe(true);
    }

    if (!existsSync(videoPath) || !existsSync(vttPath)) return;
    expect(statSync(videoPath).size).toBeLessThan(3 * 1024 * 1024);
    expect(readFileSync(vttPath, 'utf8')).toMatch(/^WEBVTT/);
  });
});
