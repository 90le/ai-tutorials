import { describe, expect, it } from 'vitest';
import {
  MOTION_STORAGE_KEY,
  parseMotionMode,
  resolveMotionLevel,
} from './motion-preference';

describe('motion preference policy', () => {
  it('uses full motion only for capable devices in automatic mode', () => {
    expect(resolveMotionLevel({ mode: 'auto', prefersReducedMotion: false, coarsePointer: false })).toBe('full');
    expect(resolveMotionLevel({ mode: 'auto', prefersReducedMotion: true, coarsePointer: false })).toBe('reduced');
    expect(resolveMotionLevel({ mode: 'auto', prefersReducedMotion: false, coarsePointer: true })).toBe('reduced');
  });

  it('honours explicit reduced and off choices', () => {
    expect(resolveMotionLevel({ mode: 'reduced', prefersReducedMotion: false, coarsePointer: false })).toBe('reduced');
    expect(resolveMotionLevel({ mode: 'off', prefersReducedMotion: false, coarsePointer: false })).toBe('off');
  });

  it('falls back to automatic mode for invalid stored values', () => {
    expect(parseMotionMode('reduced')).toBe('reduced');
    expect(parseMotionMode('off')).toBe('off');
    expect(parseMotionMode('on')).toBe('auto');
    expect(parseMotionMode(null)).toBe('auto');
    expect(MOTION_STORAGE_KEY).toBe('ai-tutorials:motion:v2');
  });
});
