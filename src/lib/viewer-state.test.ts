import { describe, expect, it } from 'vitest';
import { initialViewerState, viewerReducer } from './viewer-state';

describe('viewerReducer', () => {
  it('zooms within the supported range', () => {
    let state = initialViewerState;
    for (let index = 0; index < 20; index += 1) state = viewerReducer(state, { type: 'zoom-in' });
    expect(state.scale).toBe(4);
    for (let index = 0; index < 30; index += 1) state = viewerReducer(state, { type: 'zoom-out' });
    expect(state.scale).toBe(0.5);
  });

  it('returns to a readable fit scale', () => {
    expect(viewerReducer({ scale: 2.5 }, { type: 'reset' })).toEqual(initialViewerState);
    expect(viewerReducer({ scale: 2.5 }, { type: 'fit' })).toEqual(initialViewerState);
  });
});
