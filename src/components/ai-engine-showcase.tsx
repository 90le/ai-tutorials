'use client';

import { useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { useRive } from '@rive-app/react-canvas';
import type { FeatureCollection, LineString, Point } from 'geojson';
import { Box, Radio, Route } from 'lucide-react';

type EngineMode = 'space' | 'state' | 'atlas';

const modes: Array<{ id: EngineMode; label: string; engine: string; icon: typeof Box }> = [
  { id: 'space', label: '空间界面', engine: 'SPLINE', icon: Box },
  { id: 'state', label: '智能状态', engine: 'RIVE', icon: Radio },
  { id: 'atlas', label: '生态地图', engine: 'MAP ENGINE', icon: Route },
];

function StateMachineStage() {
  const { rive, RiveComponent } = useRive({
    src: 'https://cdn.rive.app/animations/skills.riv',
    autoplay: true,
  });

  return (
    <div className="engine-rive-stage">
      <RiveComponent
        className="engine-rive-canvas"
        onPointerEnter={() => rive?.play()}
        onPointerLeave={() => rive?.pause()}
      />
      <div className="engine-rive-copy">
        <span>AGENT STATE / RUNNING</span>
        <strong>让界面回应状态，<br />而不只是播放装饰。</strong>
        <button type="button" onClick={() => (rive?.isPlaying ? rive.pause() : rive?.play())}>
          切换运行状态
        </button>
      </div>
    </div>
  );
}

function EcosystemAtlas() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let teardown: (() => void) | undefined;
    void import('maplibre-gl').then((maplibregl) => {
      if (disposed) return;
      const points: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: [
          ['模型', 0, 18], ['智能体', 42, 30], ['创作', 58, -4], ['开发', 18, -30],
          ['研究', -28, -24], ['自动化', -52, 2], ['数据', -32, 31], ['工作流', 0, 0],
        ].map(([name, lng, lat]) => ({
          type: 'Feature',
          properties: { name },
          geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        })),
      };
      const lines: FeatureCollection<LineString> = {
        type: 'FeatureCollection',
        features: points.features.slice(0, -1).map((feature) => ({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [[0, 0], feature.geometry.coordinates] },
        })),
      };
      const map = new maplibregl.Map({
        container: host,
        center: [0, 0],
        zoom: 1.35,
        minZoom: 0.75,
        maxZoom: 4,
        attributionControl: false,
        style: {
          version: 8,
          sources: {
            nodes: { type: 'geojson', data: points },
            links: { type: 'geojson', data: lines },
          },
          layers: [
            { id: 'background', type: 'background', paint: { 'background-color': '#15111c' } },
            { id: 'links-glow', type: 'line', source: 'links', paint: { 'line-color': '#8f87ff', 'line-width': 7, 'line-opacity': 0.13, 'line-blur': 5 } },
            { id: 'links', type: 'line', source: 'links', paint: { 'line-color': '#8f87ff', 'line-width': 1.5, 'line-opacity': 0.72, 'line-dasharray': [2, 2] } },
            { id: 'nodes-glow', type: 'circle', source: 'nodes', paint: { 'circle-radius': 22, 'circle-color': '#6257ff', 'circle-opacity': 0.16, 'circle-blur': 0.55 } },
            { id: 'nodes', type: 'circle', source: 'nodes', paint: { 'circle-radius': 7, 'circle-color': ['case', ['==', ['get', 'name'], '工作流'], '#eaff5f', '#30d8c8'], 'circle-stroke-color': '#f6f2ec', 'circle-stroke-width': 1.5 } },
            { id: 'labels', type: 'symbol', source: 'nodes', layout: { 'text-field': ['get', 'name'], 'text-size': 13, 'text-offset': [0, 1.6], 'text-allow-overlap': true }, paint: { 'text-color': '#f6f2ec', 'text-halo-color': '#15111c', 'text-halo-width': 2 } },
          ],
        },
      });
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
      map.on('load', () => map.easeTo({ zoom: 1.65, duration: 1800 }));
      map.on('mouseenter', 'nodes', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'nodes', () => { map.getCanvas().style.cursor = ''; });
      map.on('click', 'nodes', (event) => {
        const feature = event.features?.[0];
        if (feature?.geometry.type === 'Point') map.flyTo({ center: feature.geometry.coordinates as [number, number], zoom: 2.6, speed: 0.8 });
      });
      teardown = () => map.remove();
    });

    return () => { disposed = true; teardown?.(); };
  }, []);

  return (
    <div className="engine-atlas-stage">
      <div ref={hostRef} className="engine-atlas-map" />
      <p>拖动探索 · 滚轮缩放 · 点击节点聚焦</p>
    </div>
  );
}

export function AiEngineShowcase() {
  const [active, setActive] = useState<EngineMode>('space');

  return (
    <div className="engine-showcase" data-reveal>
      <div className="engine-switcher" role="tablist" aria-label="实时视觉引擎">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={active === mode.id}
              className={active === mode.id ? 'is-active' : undefined}
              onClick={() => setActive(mode.id)}
              key={mode.id}
            >
              <Icon size={18} /><span>{mode.label}<small>{mode.engine}</small></span>
            </button>
          );
        })}
      </div>
      <div className="engine-canvas" role="tabpanel">
        {active === 'space' && (
          <div className="engine-spline-stage">
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
            <div className="engine-overlay-copy"><span>REALTIME 3D</span><strong>拖动、旋转，<br />进入空间界面。</strong></div>
          </div>
        )}
        {active === 'state' && <StateMachineStage />}
        {active === 'atlas' && <EcosystemAtlas />}
      </div>
    </div>
  );
}
