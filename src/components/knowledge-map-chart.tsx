'use client';

import { useEffect, useRef } from 'react';

export function KnowledgeMapChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    void import('echarts').then((echarts) => {
      if (disposed) return;

      const chart = echarts.init(element, undefined, { renderer: 'canvas' });
      const render = () => {
        const text = '#f6f2ec';
        const line = '#6f6678';
        chart.setOption({
          animationDuration: 900,
          animationEasingUpdate: 'cubicOut',
          tooltip: { show: false },
          series: [{
            type: 'graph',
            layout: 'force',
            roam: false,
            draggable: true,
            force: { repulsion: 210, edgeLength: [95, 160], gravity: 0.12 },
            label: { show: true, color: text, fontSize: 12, fontWeight: 700 },
            lineStyle: { color: line, width: 1, opacity: 0.75, curveness: 0.08 },
            emphasis: { focus: 'adjacency', scale: 1.12 },
            data: [
              { name: '真实任务', symbolSize: 78, itemStyle: { color: '#b7ff38' }, label: { color: '#11120f' } },
              { name: '工具选择', symbolSize: 58, itemStyle: { color: '#3157ff' }, label: { color: '#fff' } },
              { name: '场景打法', symbolSize: 64, itemStyle: { color: '#ff6638' }, label: { color: '#11120f' } },
              { name: '提示词', symbolSize: 48, itemStyle: { color: '#2b2433', borderColor: line, borderWidth: 1 } },
              { name: '连续课程', symbolSize: 54, itemStyle: { color: '#2b2433', borderColor: line, borderWidth: 1 } },
              { name: '复盘沉淀', symbolSize: 58, itemStyle: { color: '#2b2433', borderColor: line, borderWidth: 1 } },
            ],
            links: [
              { source: '真实任务', target: '工具选择' },
              { source: '真实任务', target: '场景打法' },
              { source: '工具选择', target: '提示词' },
              { source: '工具选择', target: '连续课程' },
              { source: '场景打法', target: '复盘沉淀' },
              { source: '提示词', target: '复盘沉淀' },
              { source: '连续课程', target: '复盘沉淀' },
            ],
          }],
        }, true);
      };

      render();
      const resizeObserver = new ResizeObserver(() => chart.resize());
      resizeObserver.observe(element);

      teardown = () => {
        resizeObserver.disconnect();
        chart.dispose();
      };
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return <div ref={chartRef} className="knowledge-map-chart" aria-label="AI 学习知识地图" />;
}
