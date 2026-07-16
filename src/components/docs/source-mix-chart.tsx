'use client';

import { useEffect, useRef, useState } from 'react';

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

export function SourceMixChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [scenario, setScenario] = useState<ScenarioName>('快速查找');

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    void import('echarts').then((echarts) => {
      if (disposed) return;
      const chart = echarts.init(element, undefined, { renderer: 'svg' });
      const render = () => {
        const isDark = document.documentElement.classList.contains('dark');
        chart.setOption({
          animationDuration: 650,
          tooltip: { trigger: 'item', formatter: '{b}：{c}%' },
          color: ['#7558e8', '#b4dc60', '#ef8e62'],
          textStyle: { fontFamily: 'Inter, PingFang SC, Microsoft YaHei, sans-serif' },
          series: [{
            type: 'pie',
            radius: ['48%', '72%'],
            center: ['50%', '48%'],
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
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      const resizeObserver = new ResizeObserver(() => chart.resize());
      resizeObserver.observe(element);
      teardown = () => {
        themeObserver.disconnect();
        resizeObserver.disconnect();
        chart.dispose();
      };
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [scenario]);

  return (
    <figure className="docs-source-mix">
      <figcaption>
        <span><strong>来源组合练习</strong><small>教学示例，不是行业统计数据</small></span>
        <div aria-label="切换研究场景">
          {(Object.keys(scenarios) as ScenarioName[]).map((name) => (
            <button type="button" aria-pressed={scenario === name} onClick={() => setScenario(name)} key={name}>{name}</button>
          ))}
        </div>
      </figcaption>
      <div ref={chartRef} className="docs-source-mix-chart" role="img" aria-label={`${scenario}场景的示例来源组合`} />
      <ul className="docs-source-mix-values" aria-label="当前示例数据">
        {scenarios[scenario].map((item) => <li key={item.name}><span>{item.name}</span><strong>{item.value}%</strong></li>)}
      </ul>
    </figure>
  );
}
