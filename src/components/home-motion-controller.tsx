'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from 'lenis';

export function HomeMotionController() {
  const [motionEnabled, setMotionEnabled] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const cursor = document.querySelector<HTMLElement>('.motion-cursor');
    const progress = document.querySelector<HTMLElement>('.motion-progress > i');
    const onPointerMove = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
      if (cursor) cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    const onScroll = () => {
      if (!progress) return;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (!motionEnabled) {
      root.dataset.motion = 'disabled';
      return () => {
        delete root.dataset.motion;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
      };
    }

    try {
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      const magneticTeardowns: Array<() => void> = [];
      const updateScroll = () => ScrollTrigger.update();
      const raf = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', updateScroll);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

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
      return () => {
        context.revert();
        gsap.ticker.remove(raf);
        lenis.off('scroll', updateScroll);
        lenis.destroy();
        magneticTeardowns.forEach((teardown) => teardown());
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        delete root.dataset.motion;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
      };
    } catch {
      root.dataset.motion = 'fallback';
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
      };
    }
  }, [motionEnabled]);

  return (
    <>
      <div className="motion-progress" aria-hidden="true"><i /></div>
      <div className="motion-cursor" aria-hidden="true"><i /></div>
      <button className="motion-toggle" type="button" onClick={() => setMotionEnabled((value) => !value)} aria-pressed={motionEnabled}>
        <i /> MOTION {motionEnabled ? 'ON' : 'OFF'}
      </button>
    </>
  );
}
