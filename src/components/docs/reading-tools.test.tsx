import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DocsCodeBlock } from './docs-code-block';
import { DiagramViewer } from './diagram-viewer';

describe('advanced reading tools', () => {
  it('renders a labelled diagram viewer trigger and dialog', () => {
    const html = renderToStaticMarkup(
      <DiagramViewer title="研究流程"><div>diagram</div></DiagramViewer>,
    );

    expect(html).toContain('aria-label="全屏查看研究流程"');
    expect(html).toContain('<dialog');
    expect(html).toContain('aria-label="关闭全屏查看"');
  });

  it('renders code tools as React-owned accessible controls', () => {
    const html = renderToStaticMarkup(<DocsCodeBlock title="demo.ts"><code>const demo = true;</code></DocsCodeBlock>);

    expect(html).toContain('aria-label="代码显示选项"');
    expect(html).toContain('自动换行');
    expect(html).toContain('显示行号');
    expect(html).toContain('展开全部');
    expect(html).toContain('demo.ts');
  });
});
