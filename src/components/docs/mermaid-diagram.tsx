'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { DiagramViewer } from './diagram-viewer';

interface MermaidDiagramProps {
  title: string;
  description?: string;
  chart: string;
}

export function MermaidDiagram({ title, description, chart }: MermaidDiagramProps) {
  const reactId = useId();
  const diagramId = `docs-mermaid-${reactId.replaceAll(':', '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [svgMarkup, setSvgMarkup] = useState('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let renderVersion = 0;
    const narrowScreen = window.matchMedia('(max-width: 42rem)');

    const render = async () => {
      const version = ++renderVersion;
      const isDark = document.documentElement.classList.contains('dark');

      try {
        const { default: mermaid } = await import('mermaid');
        if (disposed || version !== renderVersion) return;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          fontFamily: 'Inter, PingFang SC, Microsoft YaHei, sans-serif',
          themeVariables: {
            background: 'transparent',
            primaryColor: isDark ? '#24222c' : '#f3f0ff',
            primaryTextColor: isDark ? '#f5f1ec' : '#211d29',
            primaryBorderColor: isDark ? '#8171d8' : '#7558e8',
            lineColor: isDark ? '#928a9c' : '#6f6878',
            secondaryColor: isDark ? '#1d2923' : '#edf8e1',
            tertiaryColor: isDark ? '#30261f' : '#fff1e8',
            edgeLabelBackground: isDark ? '#17161c' : '#fffdf9',
          },
          flowchart: { curve: 'basis', htmlLabels: true },
        });

        const responsiveChart = narrowScreen.matches
          ? chart.replace('flowchart LR', 'flowchart TD').replaceAll('direction TB', 'direction LR')
          : chart;
        const { svg } = await mermaid.render(`${diagramId}-${version}`, responsiveChart);
        if (disposed || version !== renderVersion) return;

        setSvgMarkup(svg);
        setError(false);
      } catch {
        if (!disposed && version === renderVersion) {
          setSvgMarkup('');
          setError(true);
        }
      }
    };

    void render();
    const observer = new MutationObserver(() => void render());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    narrowScreen.addEventListener('change', render);

    return () => {
      disposed = true;
      observer.disconnect();
      narrowScreen.removeEventListener('change', render);
      container.replaceChildren();
    };
  }, [chart, diagramId]);

  return (
    <figure className="docs-mermaid">
      <figcaption>
        <span><strong>{title}</strong>{description ? <small>{description}</small> : null}</span>
        <span className="docs-mermaid-tools">
          <span>MERMAID / LIVE DIAGRAM</span>
          {svgMarkup ? (
            <DiagramViewer title={title}>
              <div className="docs-viewer-svg" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
            </DiagramViewer>
          ) : null}
        </span>
      </figcaption>
      {svgMarkup ? (
        <div
          className="docs-mermaid-canvas"
          ref={containerRef}
          role="img"
          aria-label={`${title}：${description ?? '流程图'}`}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      ) : (
        <div className="docs-mermaid-canvas" ref={containerRef} role="img" aria-label={`${title}：${description ?? '流程图'}`}>
          <span className="docs-mermaid-loading" aria-live="polite">
            {error ? '图示暂时无法绘制，请查看下方源码。' : '正在绘制图示…'}
          </span>
        </div>
      )}
      <details className="docs-mermaid-source">
        <summary>查看图示源码</summary>
        <pre><code>{chart}</code></pre>
      </details>
    </figure>
  );
}
