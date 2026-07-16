import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AnnotatedImage } from './annotated-image';
import { CitationCluster } from './citation-cluster';
import { ComparisonMatrix } from './comparison-matrix';
import { DecisionTreeExplorer } from './decision-tree-explorer';
import { GlossaryGrid } from './glossary-grid';
import { MetricBoard } from './metric-board';
import { NarrativeTimeline } from './narrative-timeline';
import { RevealSequence } from './reveal-sequence';

describe('official guide primitives', () => {
  it('renders semantic, reusable content structures', () => {
    const html = renderToStaticMarkup(<>
      <MetricBoard title="质量信号" metrics={[{ label: '覆盖率', value: '92', unit: '%' }]} />
      <NarrativeTimeline title="交付过程" items={[{ label: '01', title: '定义', description: '确认结果' }]} />
      <ComparisonMatrix title="方案比较" columns={['轻量', '完整']} rows={[{ dimension: '成本', values: ['低', '中'] }]} />
      <DecisionTreeExplorer title="组件选择" question="内容是否需要比较？" options={[{ label: '需要', result: '使用矩阵', description: '保持同一评价维度' }]} />
      <AnnotatedImage title="界面标注" image={{ src: '/images/experience-lab/evidence-map.webp', alt: '任务看板示意' }} annotations={[{ x: 25, y: 25, label: '导航', description: '保持当前位置可见' }]} />
      <GlossaryGrid title="术语" items={[{ term: '上下文', definition: '模型当前可使用的信息' }]} />
      <CitationCluster title="证据" claims={[{ claim: '结论可回查', source: '项目规范', date: '2026-07-16', status: '已核验' }]} />
      <RevealSequence title="渐进讲解" steps={[{ title: '先看结论', content: '明确交付' }, { title: '再看证据', content: '回到来源' }]} />
    </>);

    expect(html).toContain('>质量信号</h3>');
    expect(html).toContain('<table aria-label="方案比较"');
    expect(html).toContain('role="group" aria-label="内容是否需要比较？"');
    expect(html).toContain('alt="任务看板示意"');
    expect(html).toContain('<ol aria-label="渐进讲解"');
  });
});
