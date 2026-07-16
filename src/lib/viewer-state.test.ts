import { describe, expect, it } from 'vitest';
import {
  fitTransform,
  initialViewerState,
  viewerReducer,
  zoomAtPoint,
} from './viewer-state';

describe('canvas viewer state', () => {
  it('fits content into the viewport and centers it', () => {
    expect(fitTransform({ width: 1200, height: 800 }, { width: 800, height: 600 }, 40)).toEqual({
      scale: 0.6,
      x: 40,
      y: 60,
      mode: 'fit',
    });
  });

  it('zooms around the pointer without moving the point under it', () => {
    expect(zoomAtPoint({ scale: 1, x: 0, y: 0, mode: 'manual' }, 2, { x: 100, y: 80 })).toEqual({
      scale: 2,
      x: -100,
      y: -80,
      mode: 'manual',
    });
  });

  it('pans and clamps zoom to the supported range', () => {
    const panned = viewerReducer(initialViewerState, { type: 'pan', dx: 24, dy: -12 });
    expect(panned).toMatchObject({ x: 24, y: -12, mode: 'manual' });
    expect(viewerReducer(panned, { type: 'zoom-to', scale: 99, point: { x: 0, y: 0 } }).scale).toBe(8);
    expect(viewerReducer(panned, { type: 'zoom-to', scale: 0.01, point: { x: 0, y: 0 } }).scale).toBe(0.1);
  });

  it('accepts an exact fit transform and resets to 100%', () => {
    const fit = { scale: 0.72, x: 32, y: 18, mode: 'fit' as const };
    expect(viewerReducer(initialViewerState, { type: 'fit', transform: fit })).toEqual(fit);
    expect(viewerReducer(fit, { type: 'reset' })).toEqual(initialViewerState);
  });
});
