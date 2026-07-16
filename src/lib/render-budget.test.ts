import { describe, expect, it } from 'vitest';
import { getRenderBudget } from './render-budget';

describe('homepage render budget', () => {
  it('caps desktop pixel density and continuous rendering', () => {
    expect(getRenderBudget({ level: 'full', devicePixelRatio: 3, coarsePointer: false, viewportWidth: 1440 }))
      .toEqual({ enabled: true, dpr: 1.75, targetFps: 45, particleCount: 320 });
  });

  it('uses a smaller static scene for reduced motion', () => {
    expect(getRenderBudget({ level: 'reduced', devicePixelRatio: 2, coarsePointer: true, viewportWidth: 390 }))
      .toEqual({ enabled: true, dpr: 1.25, targetFps: 0, particleCount: 120 });
  });

  it('does not create WebGL when motion is off', () => {
    expect(getRenderBudget({ level: 'off', devicePixelRatio: 2, coarsePointer: false, viewportWidth: 1440 }))
      .toEqual({ enabled: false, dpr: 1, targetFps: 0, particleCount: 0 });
  });
});
