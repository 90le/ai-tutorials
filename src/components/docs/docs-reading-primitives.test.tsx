import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DocsTocHeader } from './docs-toc-header';
import { KeyTakeaways } from './key-takeaways';
import { MermaidDiagram } from './mermaid-diagram';
import { PromptCard } from './prompt-card';
import { ScenarioTabs } from './scenario-tabs';
import { SourcesDisclosure } from './sources-disclosure';

describe('docs reading primitives', () => {
  it('renders a labelled prompt with a discoverable copy action', () => {
    const html = renderToStaticMarkup(
      <PromptCard title="研究简报" description="先定义问题再开始检索">
        请比较三个方案，并标注证据来源。
      </PromptCard>,
    );

    expect(html).toContain('<figure class="docs-prompt-card"');
    expect(html).toContain('<figcaption');
    expect(html).toContain('研究简报');
    expect(html).toContain('aria-label="复制提示词"');
  });

  it('keeps sources in a native disclosure that is closed by default', () => {
    const html = renderToStaticMarkup(
      <SourcesDisclosure><a href="https://example.com">来源</a></SourcesDisclosure>,
    );

    expect(html).toContain('<details class="docs-sources-disclosure"');
    expect(html).not.toContain('<details class="docs-sources-disclosure" open=""');
    expect(html).toContain('<summary>');
    expect(html).toContain('资料与注释');
  });

  it('renders the desktop table of contents expanded on the server', () => {
    const html = renderToStaticMarkup(<DocsTocHeader />);

    expect(html).toContain('本文导航');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-label="折叠本文导航"');
  });

  it('keeps a readable fallback while a Mermaid diagram loads', () => {
    const html = renderToStaticMarkup(
      <MermaidDiagram title="交付闭环" description="从任务到验证" chart="flowchart LR\nA[任务] --> B[验证]" />,
    );

    expect(html).toContain('<figure class="docs-mermaid"');
    expect(html).toContain('交付闭环');
    expect(html).toContain('正在绘制图示');
    expect(html).toContain('flowchart LR');
  });

  it('renders takeaways and accessible scenario tabs as article content', () => {
    const takeaways = renderToStaticMarkup(
      <KeyTakeaways title="先记住三件事"><li>先定义结果</li><li>再选择工具</li></KeyTakeaways>,
    );
    const tabs = renderToStaticMarkup(
      <ScenarioTabs
        label="笔记对比"
        items={[
          { label: '原始笔记', title: '只有结论', content: '缺少来源。' },
          { label: '来源卡片', title: '证据可回溯', content: '带原文位置。' },
        ]}
      />,
    );

    expect(takeaways).toContain('<aside class="docs-takeaways"');
    expect(tabs).toContain('role="tablist"');
    expect(tabs).toContain('aria-selected="true"');
    expect(tabs).toContain('证据可回溯');
  });
});
