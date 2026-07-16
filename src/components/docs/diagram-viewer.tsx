'use client';

import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { initialViewerState, viewerReducer } from '../../lib/viewer-state';

export function DiagramViewer({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [viewer, dispatch] = useReducer(viewerReducer, initialViewerState);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
    dispatch({ type: 'reset' });
    triggerRef.current?.focus();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '+' || event.key === '=') dispatch({ type: 'zoom-in' });
      if (event.key === '-') dispatch({ type: 'zoom-out' });
      if (event.key === '0') dispatch({ type: 'reset' });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="docs-viewer-trigger"
        aria-label={`全屏查看${title}`}
        title="全屏查看"
        onClick={() => setOpen(true)}
      >
        <Maximize2 aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        className="docs-viewer-dialog"
        aria-labelledby="docs-viewer-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="docs-viewer-panel">
          <header>
            <strong id="docs-viewer-title">{title}</strong>
            <div className="docs-viewer-toolbar" aria-label="查看控制">
              <button type="button" aria-label="缩小" title="缩小" onClick={() => dispatch({ type: 'zoom-out' })}><ZoomOut aria-hidden="true" /></button>
              <span aria-live="polite">{Math.round(viewer.scale * 100)}%</span>
              <button type="button" aria-label="放大" title="放大" onClick={() => dispatch({ type: 'zoom-in' })}><ZoomIn aria-hidden="true" /></button>
              <button type="button" aria-label="适应窗口" title="适应窗口" onClick={() => dispatch({ type: 'fit' })}><RotateCcw aria-hidden="true" /></button>
              <button ref={closeRef} type="button" aria-label="关闭全屏查看" title="关闭" onClick={close}><X aria-hidden="true" /></button>
            </div>
          </header>
          <div className="docs-viewer-stage">
            <div className="docs-viewer-content" style={{ transform: `scale(${viewer.scale})` }}>
              {children}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
