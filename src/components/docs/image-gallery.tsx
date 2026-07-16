'use client';

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from 'react';
import { LightboxViewer, type ViewerImage } from './lightbox-viewer';
import { MediaFrame, type MediaSource, type MediaStatus } from './media-frame';

export function ImageGallery({
  title,
  description,
  images,
  source,
  status = 'verified',
}: {
  title: string;
  description?: string;
  images: readonly ViewerImage[];
  source?: MediaSource;
  status?: MediaStatus;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const returnFocusRef = useRef<HTMLButtonElement>(null);

  const openAt = (index: number, trigger: HTMLButtonElement) => {
    returnFocusRef.current = trigger;
    setActiveIndex(index);
    setOpen(true);
  };

  return (
    <MediaFrame title={title} description={description} source={source} status={status} width="wide" className="docs-image-gallery">
      <div className="docs-gallery-grid" aria-label={`图片组：${title}`}>
        {images.map((image, index) => (
          <button type="button" aria-label={`查看第 ${index + 1} 张：${image.caption ?? image.alt}`} onClick={(event) => openAt(index, event.currentTarget)} key={`${image.src}-${index}`}>
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
            {image.caption ? <span>{image.caption}</span> : null}
          </button>
        ))}
      </div>
      <LightboxViewer
        title={title}
        images={images}
        open={open}
        activeIndex={activeIndex}
        onOpenChange={setOpen}
        onActiveIndexChange={setActiveIndex}
        returnFocusRef={returnFocusRef}
      />
    </MediaFrame>
  );
}
