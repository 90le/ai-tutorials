'use client';

import { useEffect, useSyncExternalStore } from 'react';
import {
  MOTION_STORAGE_KEY,
  parseMotionMode,
  resolveMotionLevel,
  type MotionLevel,
  type MotionMode,
} from '@/lib/motion-preference';

const motionOptions: ReadonlyArray<{ mode: MotionMode; label: string; shortLabel: string }> = [
  { mode: 'auto', label: '自动动态', shortLabel: '自动' },
  { mode: 'reduced', label: '减少动态', shortLabel: '柔和' },
  { mode: 'off', label: '关闭动态', shortLabel: '关闭' },
];

const MOTION_CHANGE_EVENT = 'ai-tutorials:motion-change';

function subscribeToMode(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(MOTION_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(MOTION_CHANGE_EVENT, callback);
  };
}

function getModeSnapshot() {
  return parseMotionMode(window.localStorage.getItem(MOTION_STORAGE_KEY));
}

function getModeServerSnapshot(): MotionMode {
  return 'auto';
}

export function HomeMotionController() {
  const mode = useSyncExternalStore(subscribeToMode, getModeSnapshot, getModeServerSnapshot);
  const level = useSyncExternalStore(
    (callback) => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const coarsePointer = window.matchMedia('(pointer: coarse)');
      reducedMotion.addEventListener('change', callback);
      coarsePointer.addEventListener('change', callback);
      return () => {
        reducedMotion.removeEventListener('change', callback);
        coarsePointer.removeEventListener('change', callback);
      };
    },
    () => resolveMotionLevel({
      mode,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    }),
    (): MotionLevel => 'reduced',
  );

  const chooseMode = (nextMode: MotionMode) => {
    window.localStorage.setItem(MOTION_STORAGE_KEY, nextMode);
    window.dispatchEvent(new Event(MOTION_CHANGE_EVENT));
  };

  useEffect(() => {
    const root = document.documentElement;
    const cursor = document.querySelector<HTMLElement>('.motion-cursor');
    const progress = document.querySelector<HTMLElement>('.motion-progress > i');
    let disposed = false;
    let animationTeardown: (() => void) | undefined;

    root.dataset.motionMode = mode;
    root.dataset.motionLevel = level;
    root.dataset.motion = level === 'off' ? 'disabled' : level;

    const onScroll = () => {
      if (!progress) return;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const onPointerMove = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
      if (cursor) cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    if (level === 'full') window.addEventListener('pointermove', onPointerMove, { passive: true });

    if (level === 'full') {
      void Promise.all([
        import('gsap'),
        import('gsap/dist/ScrollTrigger'),
        import('lenis'),
      ]).then(([gsapModule, scrollTriggerModule, lenisModule]) => {
        if (disposed) return;

        const gsap = gsapModule.default;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        const Lenis = lenisModule.default;
        const magneticTeardowns: Array<() => void> = [];
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
        const updateScroll = () => ScrollTrigger.update();
        const raf = (time: number) => lenis.raf(time * 1000);
        lenis.on('scroll', updateScroll);
        gsap.ticker.add(raf);

        const context = gsap.context(() => {
          root.dataset.motion = 'ready';
          gsap.fromTo('.universe-eyebrow', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' });
          gsap.fromTo('.universe-copy h1', { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, delay: 0.08, ease: 'expo.out' });
          gsap.fromTo('.universe-lead, .universe-actions', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.35, stagger: 0.1, ease: 'power3.out' });
          gsap.to('.spatial-hero-scene', { yPercent: 12, scale: 1.1, rotate: 2, ease: 'none', scrollTrigger: { trigger: '.universe-hero', start: 'top top', end: 'bottom top', scrub: 0.65 } });
          gsap.to('.universe-grid', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.universe-hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
          gsap.utils.toArray<HTMLElement>('.universe-node').forEach((element, index) => {
            gsap.fromTo(element, { y: index % 2 === 0 ? -14 : 14 }, { y: index % 2 === 0 ? 14 : -14, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1 } });
          });

          document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((element) => {
            const move = (event: PointerEvent) => {
              const bounds = element.getBoundingClientRect();
              gsap.to(element, { x: (event.clientX - bounds.left - bounds.width / 2) * 0.16, y: (event.clientY - bounds.top - bounds.height / 2) * 0.16, duration: 0.35, ease: 'power2.out' });
            };
            const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, .45)' });
            element.addEventListener('pointermove', move);
            element.addEventListener('pointerleave', leave);
            magneticTeardowns.push(() => {
              element.removeEventListener('pointermove', move);
              element.removeEventListener('pointerleave', leave);
            });
          });
        });

        ScrollTrigger.refresh();
        animationTeardown = () => {
          context.revert();
          gsap.ticker.remove(raf);
          lenis.off('scroll', updateScroll);
          lenis.destroy();
          magneticTeardowns.forEach((teardown) => teardown());
        };
      }).catch(() => {
        if (!disposed) root.dataset.motion = 'fallback';
      });
    }

    return () => {
      disposed = true;
      animationTeardown?.();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      root.style.removeProperty('--pointer-x');
      root.style.removeProperty('--pointer-y');
    };
  }, [level, mode]);

  return (
    <>
      <div className="motion-progress" aria-hidden="true"><i /></div>
      <div className="motion-cursor" aria-hidden="true"><i /></div>
      <div className="motion-control" role="group" aria-label="首页动态效果">
        <span>动态</span>
        {motionOptions.map((option) => (
          <button
            type="button"
            key={option.mode}
            aria-label={option.label}
            aria-pressed={mode === option.mode}
            onClick={() => chooseMode(option.mode)}
          >
            {option.shortLabel}
          </button>
        ))}
      </div>
    </>
  );
}
