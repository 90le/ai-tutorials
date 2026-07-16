'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, type RefObject } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { PanZoomCanvas } from './pan-zoom-canvas';

export interface ViewerImage { src: string; alt: string; width: number; height: number; caption?: string }

export function LightboxViewer({ title, images, open, activeIndex, onOpenChange, onActiveIndexChange, returnFocusRef }: {
  title: string; images: readonly ViewerImage[]; open: boolean; activeIndex: number;
  onOpenChange: (open: boolean) => void; onActiveIndexChange: (index: number) => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const image = images[activeIndex] ?? images[0];
  const close = () => { dialogRef.current?.close(); onOpenChange(false); returnFocusRef?.current?.focus(); };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);
  if (!image) return null;

  const show = (offset: number) => onActiveIndexChange((activeIndex + offset + images.length) % images.length);
  return (
    <dialog ref={dialogRef} className="docs-lightbox" aria-label={`图片预览：${title}`} onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => onOpenChange(false)}>
      <div className="docs-lightbox-panel">
        <header>
          <span><strong>{title}</strong><small>{image.caption ?? image.alt}</small></span>
          <div className="docs-lightbox-header-actions"><a href={image.src} target="_blank" rel="noreferrer" aria-label="打开原图"><ExternalLink aria-hidden="true" /></a><button type="button" aria-label="关闭图片预览" onClick={close}><X aria-hidden="true" /></button></div>
        </header>
        <div className="docs-lightbox-canvas">
          <PanZoomCanvas key={`${image.src}-${activeIndex}`} label={image.alt}>
            <div className="docs-lightbox-image"><img src={image.src} alt={image.alt} width={image.width} height={image.height} /></div>
          </PanZoomCanvas>
          {images.length > 1 ? <><button type="button" className="docs-lightbox-previous" aria-label="上一张图片" onClick={() => show(-1)}><ChevronLeft aria-hidden="true" /></button><button type="button" className="docs-lightbox-next" aria-label="下一张图片" onClick={() => show(1)}><ChevronRight aria-hidden="true" /></button></> : null}
        </div>
        {images.length > 1 ? <footer><span>{activeIndex + 1} / {images.length}</span><div aria-label="选择图片">{images.map((item, index) => <button type="button" aria-pressed={index === activeIndex} aria-label={`查看第 ${index + 1} 张：${item.caption ?? item.alt}`} onClick={() => onActiveIndexChange(index)} key={`${item.src}-${index}`}><img src={item.src} alt="" width={72} height={48} /></button>)}</div></footer> : null}
      </div>
    </dialog>
  );
}
