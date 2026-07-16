import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CodeBlockEnhancer } from './code-block-enhancer';
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

  it('provides a polite status channel for enhanced code blocks', () => {
    const html = renderToStaticMarkup(<CodeBlockEnhancer />);

    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('class="docs-code-status"');
  });
});
