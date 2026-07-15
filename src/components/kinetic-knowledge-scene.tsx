'use client';

import { useEffect, useRef } from 'react';

export function KineticKnowledgeScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    void import('three').then((THREE) => {
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      const world = new THREE.Group();
      const pointer = { x: 0, y: 0 };
      let pageVisible = !document.hidden;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.prepend(renderer.domElement);
      scene.add(world);
      camera.position.set(0, 0.15, 8.5);

      const knotGeometry = new THREE.TorusKnotGeometry(1.75, 0.53, 180, 24, 2, 3);
      const knotMaterial = new THREE.MeshStandardMaterial({
        color: 0x6257ff,
        metalness: 0.18,
        roughness: 0.28,
      });
      const knot = new THREE.Mesh(knotGeometry, knotMaterial);
      world.add(knot);

      const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff6f55, transparent: true, opacity: 0.42, wireframe: true });
      const wire = new THREE.Mesh(knotGeometry, wireMaterial);
      wire.scale.setScalar(1.025);
      world.add(wire);

      const rings: InstanceType<typeof THREE.Mesh>[] = [];
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
      for (let index = 0; index < 360; index += 1) {
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

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      const themeObserver = new MutationObserver(syncTheme);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      host.addEventListener('pointermove', onPointerMove, { passive: true });
      const onVisibilityChange = () => { pageVisible = !document.hidden; };
      document.addEventListener('visibilitychange', onVisibilityChange);
      resize();
      syncTheme();

      const clock = new THREE.Clock();
      let frame = 0;
      const render = () => {
        const time = clock.getElapsedTime();
        if (document.documentElement.dataset.motion !== 'disabled') {
          world.rotation.y += (pointer.x - world.rotation.y) * 0.018;
          world.rotation.x += (-pointer.y - world.rotation.x) * 0.018;
          knot.rotation.z = time * 0.28;
          knot.rotation.y = Math.sin(time * 0.55) * 0.32;
          wire.rotation.z = -time * 0.22;
          wire.scale.setScalar(1.025 + Math.sin(time * 1.4) * 0.025);
          rings.forEach((ring, index) => { ring.rotation.z += 0.0026 * (index + 1); });
          particles.rotation.y = -time * 0.08;
          world.position.y = Math.sin(time * 0.8) * 0.12;
        }
        if (pageVisible) renderer.render(scene, camera);
        frame = window.requestAnimationFrame(render);
      };
      render();

      teardown = () => {
        window.cancelAnimationFrame(frame);
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
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return (
    <div ref={hostRef} className="spatial-hero-scene">
      <div className="spatial-scene-label" aria-hidden="true">
        <span>KNOWLEDGE IN MOTION</span>
        <strong>LIVE / 08 ENGINES</strong>
      </div>
    </div>
  );
}
