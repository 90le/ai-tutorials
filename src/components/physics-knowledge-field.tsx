'use client';

import { useEffect, useRef } from 'react';
import type { Body as MatterBody } from 'matter-js';

const labels = ['工具选择', '真实任务', '提示词', '工作流', '复盘', '模板'];

export function PhysicsKnowledgeField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    void import('matter-js').then(({ Bodies, Body, Composite, Engine, Events }) => {
      if (disposed) return;

      const engine = Engine.create({ gravity: { x: 0, y: 0.28 } });
      const bodies = labels.map((_, index) => Bodies.rectangle(100 + index * 72, 80 + (index % 3) * 76, 132, 52, {
        chamfer: { radius: 4 },
        friction: 0.06,
        frictionAir: 0.012,
        restitution: 0.78,
      }));
      let walls: MatterBody[] = [];
      let frame = 0;
      let previousTime = performance.now();
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const buildWalls = () => {
        Composite.remove(engine.world, walls);
        const width = host.clientWidth;
        const height = host.clientHeight;
        walls = [
          Bodies.rectangle(width / 2, -20, width, 40, { isStatic: true }),
          Bodies.rectangle(width / 2, height + 20, width, 40, { isStatic: true }),
          Bodies.rectangle(-20, height / 2, 40, height, { isStatic: true }),
          Bodies.rectangle(width + 20, height / 2, 40, height, { isStatic: true }),
        ];
        Composite.add(engine.world, walls);
        bodies.forEach((body, index) => {
          if (body.position.x > width || body.position.y > height) {
            Body.setPosition(body, { x: 72 + (index % 3) * Math.max(96, width / 3), y: 72 + Math.floor(index / 3) * 82 });
          }
        });
      };

      Composite.add(engine.world, bodies);
      buildWalls();
      const resizeObserver = new ResizeObserver(buildWalls);
      resizeObserver.observe(host);

      const onPointerMove = (event: PointerEvent) => {
        const bounds = host.getBoundingClientRect();
        const pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
        bodies.forEach((body) => {
          const dx = body.position.x - pointer.x;
          const dy = body.position.y - pointer.y;
          const distance = Math.max(Math.hypot(dx, dy), 1);
          if (distance < 150) Body.applyForce(body, body.position, { x: (dx / distance) * 0.0025, y: (dy / distance) * 0.0025 });
        });
      };
      host.addEventListener('pointermove', onPointerMove, { passive: true });

      const tick = (time: number) => {
        if (!prefersReducedMotion) Engine.update(engine, Math.min(time - previousTime, 16.6));
        previousTime = time;
        bodies.forEach((body, index) => {
          const item = itemRefs.current[index];
          if (item) item.style.transform = `translate3d(${body.position.x - 66}px, ${body.position.y - 26}px, 0) rotate(${body.angle}rad)`;
        });
        if (!prefersReducedMotion) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);

      const onCollision = () => {
        host.dataset.active = 'true';
        window.setTimeout(() => delete host.dataset.active, 120);
      };
      Events.on(engine, 'collisionStart', onCollision);

      teardown = () => {
        window.cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        host.removeEventListener('pointermove', onPointerMove);
        Events.off(engine, 'collisionStart', onCollision);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return (
    <div ref={hostRef} className="physics-knowledge-field" aria-label="可交互的知识模块">
      {labels.map((label, index) => (
        <span
          ref={(element) => { itemRefs.current[index] = element; }}
          className={`physics-tag physics-tag-${(index % 3) + 1}`}
          key={label}
        >
          {label}
        </span>
      ))}
      <p>移动指针，推动知识模块</p>
    </div>
  );
}
