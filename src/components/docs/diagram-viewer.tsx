'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Maximize2, X } from 'lucide-react';
import { PanZoomCanvas } from './pan-zoom-canvas';

export function DiagramViewer({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  return (
    <>
      <button ref={triggerRef} type="button" className="docs-viewer-trigger" aria-label={`全屏查看${title}`} title="全屏查看" onClick={() => setOpen(true)}>
        <Maximize2 aria-hidden="true" />
      </button>
      <dialog ref={dialogRef} className="docs-viewer-dialog" aria-label={`全屏查看：${title}`} onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => setOpen(false)}>
        <div className="docs-viewer-panel">
          <header><strong>{title}</strong><button type="button" className="docs-viewer-close" aria-label="关闭全屏查看" onClick={close}><X aria-hidden="true" /></button></header>
          <PanZoomCanvas label={title}>{open ? children : null}</PanZoomCanvas>
        </div>
      </dialog>
    </>
  );
}
