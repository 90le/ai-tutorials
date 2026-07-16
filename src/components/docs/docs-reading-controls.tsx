'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { calculateReadingProgress } from '@/lib/reading-progress';

export function DocsReadingControls() {
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const article = document.querySelector<HTMLElement>('.docs-page-content');
      if (!article) return;
      const bounds = article.getBoundingClientRect();
      const articleTop = bounds.top + window.scrollY;
      setProgress(calculateReadingProgress({
        articleTop,
        articleHeight: article.scrollHeight,
        viewportHeight: window.innerHeight,
        scrollY: window.scrollY,
      }));
      setShowBackToTop(window.scrollY > window.innerHeight);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const backToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="docs-reading-progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>
      <button
        type="button"
        className="docs-back-to-top"
        data-visible={showBackToTop}
        aria-label="返回文章顶部"
        title="返回顶部"
        onClick={backToTop}
      >
        <ArrowUp aria-hidden="true" />
      </button>
    </>
  );
}
