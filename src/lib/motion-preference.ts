export type MotionMode = 'auto' | 'reduced' | 'off';
export type MotionLevel = 'full' | 'reduced' | 'off';

export const MOTION_STORAGE_KEY = 'ai-tutorials:motion:v2';

export function parseMotionMode(value: string | null): MotionMode {
  return value === 'reduced' || value === 'off' || value === 'auto' ? value : 'auto';
}

export function resolveMotionLevel({
  mode,
  prefersReducedMotion,
  coarsePointer,
}: {
  mode: MotionMode;
  prefersReducedMotion: boolean;
  coarsePointer: boolean;
}): MotionLevel {
  if (mode === 'off') return 'off';
  if (mode === 'reduced') return 'reduced';
  return prefersReducedMotion || coarsePointer ? 'reduced' : 'full';
}
