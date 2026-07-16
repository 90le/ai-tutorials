import { describe, expect, it } from 'vitest';
import { getSourceMixSeries } from './source-mix-chart';

describe('source mix chart', () => {
  it('keeps pie labels inside narrow full-screen canvases', () => {
    const series = getSourceMixSeries([
      { name: '官方资料', value: 55 },
      { name: '专业分析', value: 25 },
      { name: '社区线索', value: 20 },
    ], true);

    expect(series.radius).toEqual(['42%', '64%']);
    expect(series.labelLine).toMatchObject({ length: 10, length2: 8 });
  });
});
