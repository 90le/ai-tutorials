import type { MotionLevel } from './motion-preference';

export interface RenderBudget {
  enabled: boolean;
  dpr: number;
  targetFps: number;
  particleCount: number;
}

export function getRenderBudget({
  level,
  devicePixelRatio,
  coarsePointer,
  viewportWidth,
}: {
  level: MotionLevel;
  devicePixelRatio: number;
  coarsePointer: boolean;
  viewportWidth: number;
}): RenderBudget {
  if (level === 'off') return { enabled: false, dpr: 1, targetFps: 0, particleCount: 0 };

  const constrained = coarsePointer || viewportWidth < 720;
  if (level === 'reduced') {
    return {
      enabled: true,
      dpr: Math.min(devicePixelRatio, constrained ? 1.25 : 1.5),
      targetFps: 0,
      particleCount: constrained ? 120 : 180,
    };
  }

  return {
    enabled: true,
    dpr: Math.min(devicePixelRatio, constrained ? 1.25 : 1.75),
    targetFps: constrained ? 30 : 45,
    particleCount: constrained ? 180 : 320,
  };
}
