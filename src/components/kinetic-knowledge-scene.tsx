'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { MotionLevel } from '@/lib/motion-preference';
import { getRenderBudget } from '@/lib/render-budget';

function getMotionLevelSnapshot(): MotionLevel {
  const level = document.documentElement.dataset.motionLevel;
  return level === 'full' || level === 'off' ? level : 'reduced';
}

function subscribeToMotionLevel(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-motion-level'],
  });
  return () => observer.disconnect();
}

export function KineticKnowledgeScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const motionLevel = useSyncExternalStore(
    subscribeToMotionLevel,
    getMotionLevelSnapshot,
    (): MotionLevel => 'reduced',
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host || motionLevel === 'off') return;

    const budget = getRenderBudget({
      level: motionLevel,
      devicePixelRatio: window.devicePixelRatio,
      coarsePointer: window.matchMedia('(pointer: coarse)').matches,
      viewportWidth: window.innerWidth,
    });
    if (!budget.enabled) return;

    let disposed = false;
    let inViewport = false;
    let teardown: (() => void) | undefined;
    let resume: (() => void) | undefined;
    let pause: (() => void) | undefined;

    const start = async () => {
      if (disposed || teardown) return;

      try {
        const THREE = await import('three');
        if (disposed) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: budget.dpr <= 1.5 });
        const world = new THREE.Group();
        const pointer = { x: 0, y: 0 };
        let pageVisible = !document.hidden;
        let frame = 0;
        let lastFrameAt = 0;

        renderer.setPixelRatio(budget.dpr);
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.dataset.renderMode = motionLevel;
        host.prepend(renderer.domElement);
        host.dataset.sceneState = motionLevel === 'full' ? 'live' : 'static';
        scene.add(world);
        camera.position.set(0, 0.15, 8.5);

        const knotGeometry = new THREE.TorusKnotGeometry(1.75, 0.53, 180, 24, 2, 3);
        const knotMaterial = new THREE.MeshStandardMaterial({ color: 0x6257ff, metalness: 0.18, roughness: 0.28 });
        const knot = new THREE.Mesh(knotGeometry, knotMaterial);
        world.add(knot);

        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff6f55, transparent: true, opacity: 0.42, wireframe: true });
        const wire = new THREE.Mesh(knotGeometry, wireMaterial);
        wire.scale.setScalar(1.025);
        world.add(wire);

        const rings: Array<InstanceType<typeof THREE.Mesh>> = [];
        [2.75, 3.25, 3.75].forEach((radius, index) => {
          const geometry = new THREE.TorusGeometry(radius, 0.014 + index * 0.004, 8, 160);
          const material = new THREE.MeshBasicMaterial({
            color: index === 1 ? 0x00b8a9 : 0x6257ff,
            transparent: true,
            opacity: 0.42 - index * 0.06,
          });
          const ring = new THREE.Mesh(geometry, material);
          ring.rotation.set(0.65 + index * 0.38, index * 0.45, -0.35 + index * 0.5);
          rings.push(ring);
          world.add(ring);
        });

        const particlePositions: number[] = [];
        for (let index = 0; index < budget.particleCount; index += 1) {
          const angle = index * 0.42;
          const radius = 2.6 + (index % 23) * 0.075;
          particlePositions.push(
            Math.cos(angle) * radius,
            Math.sin(angle * 0.71) * 2.4,
            Math.sin(angle) * radius * 0.4,
          );
        }
        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
        const particlesMaterial = new THREE.PointsMaterial({ color: 0x00b8a9, size: 0.035, transparent: true, opacity: 0.7 });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        world.add(particles);

        const ambient = new THREE.AmbientLight(0xffffff, 1.6);
        const coralLight = new THREE.PointLight(0xff6f55, 24, 20);
        coralLight.position.set(4, 3, 5);
        const cyanLight = new THREE.PointLight(0x00c9b7, 18, 20);
        cyanLight.position.set(-4, -2, 4);
        scene.add(ambient, coralLight, cyanLight);

        const resize = () => {
          const width = host.clientWidth;
          const height = host.clientHeight;
          renderer.setSize(width, height, false);
          camera.aspect = width / Math.max(height, 1);
          camera.updateProjectionMatrix();
        };
        const onPointerMove = (event: PointerEvent) => {
          const bounds = host.getBoundingClientRect();
          pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.85;
          pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.65;
        };
        const syncTheme = () => {
          const dark = document.documentElement.classList.contains('dark');
          knotMaterial.color.set(dark ? 0x8e86ff : 0x6257ff);
          knotMaterial.metalness = dark ? 0.3 : 0.14;
          ambient.intensity = dark ? 1.15 : 1.7;
          particlesMaterial.opacity = dark ? 0.86 : 0.64;
        };

        const clock = new THREE.Clock();
        const render = (timestamp: number) => {
          frame = 0;
          if (!pageVisible || !inViewport || disposed) return;
          const interval = 1000 / Math.max(budget.targetFps, 1);
          if (timestamp - lastFrameAt >= interval) {
            lastFrameAt = timestamp;
            const time = clock.getElapsedTime();
            world.rotation.y += (pointer.x - world.rotation.y) * 0.018;
            world.rotation.x += (-pointer.y - world.rotation.x) * 0.018;
            knot.rotation.z = time * 0.28;
            knot.rotation.y = Math.sin(time * 0.55) * 0.32;
            wire.rotation.z = -time * 0.22;
            wire.scale.setScalar(1.025 + Math.sin(time * 1.4) * 0.025);
            rings.forEach((ring, index) => { ring.rotation.z += 0.0026 * (index + 1); });
            particles.rotation.y = -time * 0.08;
            world.position.y = Math.sin(time * 0.8) * 0.12;
            renderer.render(scene, camera);
          }
          frame = window.requestAnimationFrame(render);
        };
        const schedule = () => {
          if (motionLevel !== 'full' || frame || !pageVisible || !inViewport) return;
          frame = window.requestAnimationFrame(render);
        };
        const stop = () => {
          if (frame) window.cancelAnimationFrame(frame);
          frame = 0;
        };
        resume = schedule;
        pause = stop;

        const resizeObserver = new ResizeObserver(() => {
          resize();
          renderer.render(scene, camera);
        });
        resizeObserver.observe(host);
        const themeObserver = new MutationObserver(() => {
          syncTheme();
          renderer.render(scene, camera);
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        if (motionLevel === 'full') host.addEventListener('pointermove', onPointerMove, { passive: true });
        const onVisibilityChange = () => {
          pageVisible = !document.hidden;
          if (pageVisible) schedule();
          else stop();
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        resize();
        syncTheme();
        renderer.render(scene, camera);
        schedule();

        teardown = () => {
          stop();
          resizeObserver.disconnect();
          themeObserver.disconnect();
          host.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('visibilitychange', onVisibilityChange);
          knotGeometry.dispose();
          knotMaterial.dispose();
          wireMaterial.dispose();
          rings.forEach((ring) => {
            ring.geometry.dispose();
            (ring.material as InstanceType<typeof THREE.MeshBasicMaterial>).dispose();
          });
          particlesGeometry.dispose();
          particlesMaterial.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
          resume = undefined;
          pause = undefined;
          delete host.dataset.sceneState;
        };
      } catch {
        if (!disposed) host.dataset.sceneState = 'fallback';
      }
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) void start().then(() => resume?.());
      else pause?.();
    }, { rootMargin: '160px', threshold: 0.01 });
    intersectionObserver.observe(host);

    return () => {
      disposed = true;
      intersectionObserver.disconnect();
      teardown?.();
    };
  }, [motionLevel]);

  return (
    <div ref={hostRef} className="spatial-hero-scene">
      <div className="spatial-scene-label" aria-hidden="true">
        <span>KNOWLEDGE IN MOTION</span>
        <strong>WEBGL / ADAPTIVE</strong>
      </div>
    </div>
  );
}
