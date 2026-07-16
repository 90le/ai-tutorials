export function calculateReadingProgress({
  articleTop,
  articleHeight,
  viewportHeight,
  scrollY,
}: {
  articleTop: number;
  articleHeight: number;
  viewportHeight: number;
  scrollY: number;
}): number {
  const availableDistance = articleHeight - viewportHeight;
  if (availableDistance <= 0) return scrollY < articleTop ? 0 : 1;

  const progress = (scrollY - articleTop) / availableDistance;
  return Math.min(1, Math.max(0, progress));
}
