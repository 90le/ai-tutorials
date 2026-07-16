'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { EChartsOption } from 'echarts';

export function LabShell({ number, title, description, children, footer }: {
  number: string; title: string; description: string; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <section className="docs-lab-shell" aria-label={title}>
      <header><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><i aria-hidden="true" /></header>
      <div className="docs-lab-body">{children}</div>
      {footer ? <footer>{footer}</footer> : null}
    </section>
  );
}

export function SegmentedControl({ label, options, value, onChange }: {
  label: string; options: readonly string[]; value: string; onChange: (value: string) => void;
}) {
  return <div className="docs-lab-segments" aria-label={label}>{options.map((option) => <button type="button" aria-pressed={value === option} onClick={() => onChange(option)} key={option}>{option}</button>)}</div>;
}

export function LazyEChart({ option, ariaLabel }: { option: EChartsOption; ariaLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let disposed = false;
    let teardown: (() => void) | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || teardown) return;
      observer.disconnect();
      void import('echarts').then((echarts) => {
        if (disposed) return;
        element.replaceChildren();
        const chart = echarts.init(element, undefined, { renderer: 'svg' });
        chart.setOption({ animationDuration: document.documentElement.dataset.motionLevel === 'off' ? 0 : 650, ...option });
        const resize = new ResizeObserver(() => chart.resize());
        resize.observe(element);
        teardown = () => { resize.disconnect(); chart.dispose(); };
      });
    }, { rootMargin: '160px' });
    observer.observe(element);
    return () => { disposed = true; observer.disconnect(); teardown?.(); };
  }, [option]);
  return <div ref={ref} className="docs-lab-chart" role="img" aria-label={ariaLabel}><span>交互图表接近视口后加载</span></div>;
}
