import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('../../', import.meta.url));
const showcasePath = join(root, 'content/docs/reference/experience-lab/complete-showcase.mdx');
const referenceMetaPath = join(root, 'content/docs/reference/meta.json');
const labMetaPath = join(root, 'content/docs/reference/experience-lab/meta.json');
const matrixPath = join(root, 'docs/rendering-capability-matrix.md');
const workbenchesPath = join(root, 'content/docs/reference/experience-lab/ai-workbenches.mdx');
const canvasPath = join(root, 'content/docs/reference/experience-lab/infinite-canvas.mdx');
const qualityPath = join(root, 'content/docs/reference/experience-lab/quality-matrix.mdx');

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
] as const;

describe('rendering and interaction lab', () => {
  it('publishes a dedicated reference category', () => {
    expect(existsSync(showcasePath)).toBe(true);
    expect(existsSync(labMetaPath)).toBe(true);
    expect(existsSync(matrixPath)).toBe(true);
    expect(existsSync(workbenchesPath)).toBe(true);
    expect(existsSync(canvasPath)).toBe(true);
    expect(existsSync(qualityPath)).toBe(true);

    const referenceMeta = JSON.parse(readFileSync(referenceMetaPath, 'utf8')) as { pages: string[] };
    const labMeta = JSON.parse(readFileSync(labMetaPath, 'utf8')) as { title: string; pages: string[] };

    expect(referenceMeta.pages).toContain('experience-lab');
    expect(labMeta).toEqual({
      title: '渲染与交互实验室',
      pages: ['index', 'complete-showcase', 'ai-workbenches', 'infinite-canvas', 'quality-matrix'],
    });
  });

  it('publishes all twelve original AI workbench components', () => {
    const workbenches = readFileSync(workbenchesPath, 'utf8');
    const components = [
      'AgentFlowStudio', 'PromptDiffLab', 'ContextBudgetComposer', 'RetrievalExplorer',
      'ToolCallTrace', 'MultiAgentOrchestration', 'ModelTradeoffMatrix', 'CostLatencySimulator',
      'EvidenceNetwork', 'SemanticSpace3D', 'StreamingResponseTimeline', 'FailureStateGallery',
    ];
    for (const component of components) expect(workbenches).toContain(`<${component} />`);
  });

  it('keeps every supported rendering primitive visible in the showcase source', () => {
    expect(existsSync(showcasePath)).toBe(true);
    if (!existsSync(showcasePath)) return;

    const showcase = readFileSync(showcasePath, 'utf8');
    expect(showcase).toContain('contentType: reference');
    expect(showcase).toContain('published: 2026-07-16');
    for (const marker of requiredMarkers) expect(showcase).toContain(marker);
  });

  it('presents the showcase as a continuous, reviewable reference article', () => {
    const showcase = readFileSync(showcasePath, 'utf8');
    const requiredSections = [
      '## 基础文章语言',
      '## 结构化说明',
      '## 图示与数据',
      '## 图片与视觉证据',
      '## 视频与替代内容',
      '## 降级与验收',
    ];

    for (const section of requiredSections) expect(showcase).toContain(section);
    expect(showcase.match(/检查什么：/g)?.length ?? 0).toBeGreaterThanOrEqual(7);
    expect(showcase).toContain('docs-experience-status');
    expect(showcase).toContain('docs-experience-checklist');
    expect(showcase).not.toMatch(/lorem|placeholder|待补充内容/i);
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
