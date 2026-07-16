'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { Crosshair, Minus, Plus } from 'lucide-react';
import { fitTransform, initialViewerState, viewerReducer, type Point } from '../../lib/viewer-state';

export function PanZoomCanvas({
  label,
  children,
  actions,
}: {
  label: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const [viewer, dispatch] = useReducer(viewerReducer, initialViewerState);
  const viewerRef = useRef(viewer);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const gestureRef = useRef<{ distance: number; midpoint: Point } | null>(null);

  useEffect(() => { viewerRef.current = viewer; }, [viewer]);

  const fit = useCallback(() => {
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!stage || !content) return;
    const width = Math.max(content.scrollWidth, content.offsetWidth);
    const height = Math.max(content.scrollHeight, content.offsetHeight);
    if (!width || !height) return;
    dispatch({
      type: 'fit',
      transform: fitTransform(
        { width, height },
        { width: stage.clientWidth, height: stage.clientHeight },
        Math.min(56, Math.max(20, stage.clientWidth * 0.04)),
      ),
    });
  }, []);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(fit);
    const observer = new ResizeObserver(fit);
    if (stageRef.current) observer.observe(stageRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [fit]);

  const localPoint = (clientX: number, clientY: number) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    return { x: clientX - (bounds?.left ?? 0), y: clientY - (bounds?.top ?? 0) };
  };

  const zoom = (factor: number, point?: Point) => {
    const stage = stageRef.current;
    const focus = point ?? { x: (stage?.clientWidth ?? 0) / 2, y: (stage?.clientHeight ?? 0) / 2 };
    dispatch({ type: 'zoom-to', scale: viewerRef.current.scale * factor, point: focus });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, localPoint(event.clientX, event.clientY));
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const next = localPoint(event.clientX, event.clientY);
    pointers.current.set(event.pointerId, next);
    const active = [...pointers.current.values()];
    if (active.length === 1) {
      dispatch({ type: 'pan', dx: next.x - previous.x, dy: next.y - previous.y });
      return;
    }
    const [first, second] = active;
    const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
    const distance = Math.hypot(second.x - first.x, second.y - first.y);
    const gesture = gestureRef.current;
    if (gesture?.distance) {
      dispatch({ type: 'pan', dx: midpoint.x - gesture.midpoint.x, dy: midpoint.y - gesture.midpoint.y });
      dispatch({ type: 'zoom-to', scale: viewerRef.current.scale * (distance / gesture.distance), point: midpoint });
    }
    gestureRef.current = { distance, midpoint };
  };

  const releasePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) gestureRef.current = null;
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, Point> = {
      ArrowUp: { x: 0, y: 32 }, ArrowDown: { x: 0, y: -32 },
      ArrowLeft: { x: 32, y: 0 }, ArrowRight: { x: -32, y: 0 },
    };
    if (moves[event.key]) {
      event.preventDefault();
      dispatch({ type: 'pan', dx: moves[event.key].x, dy: moves[event.key].y });
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault(); zoom(1.2);
    } else if (event.key === '-') {
      event.preventDefault(); zoom(1 / 1.2);
    } else if (event.key === '0') {
      event.preventDefault(); fit();
    } else if (event.key === '1') {
      event.preventDefault();
      const stage = stageRef.current;
      dispatch({ type: 'zoom-to', scale: 1, point: { x: (stage?.clientWidth ?? 0) / 2, y: (stage?.clientHeight ?? 0) / 2 } });
    }
  };

  return (
    <div className="docs-canvas-shell">
      <div
        ref={stageRef}
        className="docs-canvas-stage"
        tabIndex={0}
        role="region"
        aria-label={`${label}。拖动平移，滚轮缩放，按 0 适应窗口。`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onWheel={(event: ReactWheelEvent<HTMLDivElement>) => {
          event.preventDefault();
          zoom(Math.exp(-event.deltaY * 0.0015), localPoint(event.clientX, event.clientY));
        }}
      >
        <div
          ref={contentRef}
          className="docs-canvas-content"
          style={{ transform: `translate3d(${viewer.x}px, ${viewer.y}px, 0) scale(${viewer.scale})` }}
        >
          {children}
        </div>
      </div>
      <div className="docs-canvas-toolbar" aria-label="画布控制">
        <button type="button" onClick={() => zoom(1 / 1.2)} aria-label="缩小"><Minus aria-hidden="true" /></button>
        <output aria-live="polite">{Math.round(viewer.scale * 100)}%</output>
        <button type="button" onClick={() => zoom(1.2)} aria-label="放大"><Plus aria-hidden="true" /></button>
        <button type="button" onClick={fit} aria-label="适应窗口"><Crosshair aria-hidden="true" /></button>
        {actions}
      </div>
      <p className="docs-canvas-help">拖动画布 · 滚轮缩放 · 双指缩放 · 方向键平移 · 0 适应窗口</p>
    </div>
  );
}
