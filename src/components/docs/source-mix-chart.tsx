'use client';

import { useEffect, useRef, useState } from 'react';
import { ChartFrame } from './chart-frame';

const scenarios = {
  快速查找: [
    { name: '官方资料', value: 55 },
    { name: '专业分析', value: 25 },
    { name: '社区线索', value: 20 },
  ],
  决策研究: [
    { name: '官方资料', value: 40 },
    { name: '专业分析', value: 40 },
    { name: '社区线索', value: 20 },
  ],
} as const;

type ScenarioName = keyof typeof scenarios;

function SourceMixVisual({ scenario }: { scenario: ScenarioName }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    let disposed = false;
    let teardown: (() => void) | undefined;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || teardown) return;
      intersectionObserver.disconnect();

      void import('echarts').then((echarts) => {
        if (disposed) return;
        element.replaceChildren();
        const chart = echarts.init(element, undefined, { renderer: 'svg' });
        const render = () => {
          const isDark = document.documentElement.classList.contains('dark');
          chart.setOption({
            animationDuration: document.documentElement.dataset.motionLevel === 'off' ? 0 : 420,
            tooltip: { trigger: 'item', formatter: '{b}：{c}%' },
            color: ['#7558e8', '#b4dc60', '#ef8e62'],
            textStyle: { fontFamily: 'Inter, PingFang SC, Microsoft YaHei, sans-serif' },
            series: [{
              type: 'pie',
              radius: ['48%', '72%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: true,
              itemStyle: { borderWidth: 4, borderColor: isDark ? '#17161c' : '#fffdf9', borderRadius: 8 },
              label: {
                color: isDark ? '#f5f1ec' : '#211d29',
                formatter: '{b}\n{c}%',
                fontSize: 12,
                fontWeight: 700,
              },
              labelLine: { lineStyle: { color: isDark ? '#78717f' : '#aaa2b1' } },
              data: scenarios[scenario],
            }],
          }, true);
        };

        render();
        const themeObserver = new MutationObserver(render);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-motion-level'] });
        const resizeObserver = new ResizeObserver(() => chart.resize());
        resizeObserver.observe(element);
        teardown = () => {
          themeObserver.disconnect();
          resizeObserver.disconnect();
          chart.dispose();
        };
      }).catch(() => {
        if (!disposed) element.textContent = '图表暂时无法加载，请查看下方数据。';
      });
    }, { rootMargin: '180px', threshold: 0.01 });
    intersectionObserver.observe(element);

    return () => {
      disposed = true;
      intersectionObserver.disconnect();
      teardown?.();
    };
  }, [scenario]);

  return (
    <div ref={chartRef} className="docs-source-mix-chart" role="img" aria-label={`${scenario}场景的示例来源组合`}>
      <span>图表接近视口后加载；关键数值见下方。</span>
    </div>
  );
}

export function SourceMixChart() {
  const [scenario, setScenario] = useState<ScenarioName>('快速查找');
  const data = scenarios[scenario];
  const title = scenario === '快速查找'
    ? '快速查找时，官方资料承担过半证据'
    : '决策研究需要平衡官方资料与专业分析';
  const rows = data.map((item) => ({ source: item.name, value: `${item.value}%` }));

  const controls = (
    <div aria-label="切换研究场景">
      {(Object.keys(scenarios) as ScenarioName[]).map((name) => (
        <button type="button" aria-pressed={scenario === name} onClick={() => setScenario(name)} key={name}>{name}</button>
      ))}
    </div>
  );
  const summary = (
    <ul aria-label="当前示例关键数值">
      {data.map((item) => <li key={item.name}><span>{item.name}</span><strong>{item.value}%</strong></li>)}
    </ul>
  );

  return (
    <ChartFrame
      title={title}
      description="来源组合练习"
      source={{ label: '教学设计 · 2026-07-16' }}
      status="illustrative"
      caveat="教学示例，不是行业统计数据；比例用于解释来源组合方法。"
      columns={[{ key: 'source', label: '来源' }, { key: 'value', label: '占比' }]}
      rows={rows}
      controls={controls}
      summary={summary}
      viewerContent={<div className="docs-source-mix-viewer"><SourceMixVisual scenario={scenario} />{summary}</div>}
    >
      <SourceMixVisual scenario={scenario} />
    </ChartFrame>
  );
}
