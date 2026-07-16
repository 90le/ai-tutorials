'use client';

import { useEffect, useRef, useState } from 'react';
import type { Material, Mesh } from 'three';
import { LabShell, SegmentedControl } from './lab-foundations';

export function SemanticSpace3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cluster, setCluster] = useState('全部');

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let frame = 0;
    let teardown = () => {};
    const intersection = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      intersection.disconnect();
      void import('three').then((THREE) => {
      if (disposed) return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.z = 7;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      mount.replaceChildren(renderer.domElement);
      const group = new THREE.Group();
      const colors = [0x7558e8, 0xb4dc60, 0xef8e62];
      for (let index = 0; index < 42; index += 1) {
        const geometry = new THREE.SphereGeometry(index % 9 === 0 ? 0.12 : 0.065, 12, 12);
        const material = new THREE.MeshBasicMaterial({ color: colors[index % 3] });
        const point = new THREE.Mesh(geometry, material);
        const band = index % 3;
        point.position.set(Math.sin(index * 1.9) * 1.5 + (band - 1) * 1.25, Math.cos(index * 1.3) * 1.35, Math.sin(index * 0.7) * 1.25);
        group.add(point);
      }
      scene.add(group);
      const resize = () => { const width = mount.clientWidth; const height = mount.clientHeight; renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
      const observer = new ResizeObserver(resize); observer.observe(mount); resize();
      const animate = () => { if (document.documentElement.dataset.motionLevel !== 'off') group.rotation.y += 0.0025; renderer.render(scene, camera); frame = requestAnimationFrame(animate); };
      animate();
        teardown = () => { cancelAnimationFrame(frame); observer.disconnect(); group.children.forEach((child) => { const mesh = child as Mesh; mesh.geometry.dispose(); (mesh.material as Material).dispose(); }); renderer.dispose(); };
      });
    }, { rootMargin: '180px' });
    intersection.observe(mount);
    return () => { disposed = true; intersection.disconnect(); teardown(); };
  }, []);

  return <LabShell number="10" title="语义空间 3D" description="拖动筛选语义簇，观察知识片段在向量空间中的邻近关系。"><SegmentedControl label="选择语义簇" options={['全部', '工具', '方法', '案例']} value={cluster} onChange={setCluster} /><div ref={mountRef} className="docs-semantic-space" role="img" aria-label={`${cluster}语义片段的三维空间示意`}><span>3D 语义空间接近视口后加载</span></div><p>当前视图：{cluster} · 42 个教学示意向量点</p></LabShell>;
}
