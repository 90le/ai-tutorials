import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ChartFrame } from './chart-frame';

describe('ChartFrame', () => {
  it('keeps insight, provenance, key values and source data visible without hover', () => {
    const html = renderToStaticMarkup(
      <ChartFrame
        title="官方资料承担主要证据"
        description="来源组合教学示例"
        source={{ label: '教学设计' }}
        status="illustrative"
        caveat="不是行业统计数据"
        columns={[{ key: 'source', label: '来源' }, { key: 'value', label: '占比' }]}
        rows={[{ source: '官方资料', value: '55%' }]}
        viewerContent={<div>full chart</div>}
      >
        <div>chart</div>
      </ChartFrame>,
    );

    expect(html).toContain('官方资料承担主要证据');
    expect(html).toContain('教学设计');
    expect(html).toContain('示意');
    expect(html).toContain('不是行业统计数据');
    expect(html).toContain('查看数据');
    expect(html).toContain('<th scope="col"');
    expect(html).toContain('官方资料');
    expect(html).toContain('aria-label="全屏查看官方资料承担主要证据"');
  });
});
