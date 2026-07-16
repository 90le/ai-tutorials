'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useReducer, useRef, type RefObject } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { initialViewerState, viewerReducer } from '../../lib/viewer-state';

export interface ViewerImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export function LightboxViewer({
  title,
  images,
  open,
  activeIndex,
  onOpenChange,
  onActiveIndexChange,
  returnFocusRef,
}: {
  title: string;
  images: readonly ViewerImage[];
  open: boolean;
  activeIndex: number;
  onOpenChange: (open: boolean) => void;
  onActiveIndexChange: (index: number) => void;
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [viewer, dispatch] = useReducer(viewerReducer, initialViewerState);
  const image = images[activeIndex] ?? images[0];

  const close = () => {
    dialogRef.current?.close();
    onOpenChange(false);
    dispatch({ type: 'reset' });
    returnFocusRef?.current?.focus();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
  }, [open]);

  if (!image) return null;

  const showPrevious = () => {
    onActiveIndexChange((activeIndex - 1 + images.length) % images.length);
    dispatch({ type: 'reset' });
  };
  const showNext = () => {
    onActiveIndexChange((activeIndex + 1) % images.length);
    dispatch({ type: 'reset' });
  };

  return (
    <dialog
      ref={dialogRef}
      className="docs-lightbox"
      aria-label={`图片预览：${title}`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="docs-lightbox-panel">
        <header>
          <span><strong>{title}</strong><small>{image.caption ?? image.alt}</small></span>
          <div className="docs-viewer-toolbar" aria-label="图片查看控制">
            <button type="button" aria-label="缩小图片" title="缩小" onClick={() => dispatch({ type: 'zoom-out' })}><ZoomOut aria-hidden="true" /></button>
            <span aria-live="polite">{Math.round(viewer.scale * 100)}%</span>
            <button type="button" aria-label="放大图片" title="放大" onClick={() => dispatch({ type: 'zoom-in' })}><ZoomIn aria-hidden="true" /></button>
            <button type="button" aria-label="适应窗口" title="适应窗口" onClick={() => dispatch({ type: 'fit' })}><RotateCcw aria-hidden="true" /></button>
            <a href={image.src} target="_blank" rel="noreferrer" aria-label="打开原图" title="打开原图"><ExternalLink aria-hidden="true" /></a>
            <button ref={closeRef} type="button" aria-label="关闭图片预览" title="关闭" onClick={close}><X aria-hidden="true" /></button>
          </div>
        </header>
        <div
          className="docs-lightbox-stage"
          onWheel={(event) => {
            if (!event.ctrlKey) return;
            event.preventDefault();
            dispatch({ type: event.deltaY < 0 ? 'zoom-in' : 'zoom-out' });
          }}
        >
          {images.length > 1 ? <button type="button" className="docs-lightbox-previous" aria-label="上一张图片" onClick={showPrevious}><ChevronLeft aria-hidden="true" /></button> : null}
          <div className="docs-lightbox-image" style={{ transform: `scale(${viewer.scale})` }}>
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} />
          </div>
          {images.length > 1 ? <button type="button" className="docs-lightbox-next" aria-label="下一张图片" onClick={showNext}><ChevronRight aria-hidden="true" /></button> : null}
        </div>
        {images.length > 1 ? (
          <footer>
            <span>{activeIndex + 1} / {images.length}</span>
            <div aria-label="选择图片">
              {images.map((item, index) => (
                <button type="button" aria-pressed={index === activeIndex} aria-label={`查看第 ${index + 1} 张：${item.caption ?? item.alt}`} onClick={() => onActiveIndexChange(index)} key={`${item.src}-${index}`}>
                  <img src={item.src} alt="" width={72} height={48} />
                </button>
              ))}
            </div>
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
