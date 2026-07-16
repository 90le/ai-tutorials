import { describe, expect, it } from 'vitest';
import { calculateReadingProgress } from './reading-progress';

describe('calculateReadingProgress', () => {
  it('measures progress through the article viewport', () => {
    expect(calculateReadingProgress({ articleTop: 300, articleHeight: 2000, viewportHeight: 800, scrollY: 300 })).toBe(0);
    expect(calculateReadingProgress({ articleTop: 300, articleHeight: 2000, viewportHeight: 800, scrollY: 900 })).toBe(0.5);
    expect(calculateReadingProgress({ articleTop: 300, articleHeight: 2000, viewportHeight: 800, scrollY: 1500 })).toBe(1);
  });

  it('clamps positions before and after the article', () => {
    expect(calculateReadingProgress({ articleTop: 300, articleHeight: 500, viewportHeight: 800, scrollY: 0 })).toBe(0);
    expect(calculateReadingProgress({ articleTop: 300, articleHeight: 500, viewportHeight: 800, scrollY: 2000 })).toBe(1);
  });
});
