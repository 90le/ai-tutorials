'use client';

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { LightboxViewer, type ViewerImage } from './lightbox-viewer';
import { MediaFrame, type MediaSource, type MediaStatus } from './media-frame';

export function ArticleImage({
  title,
  description,
  image,
  source,
  status = 'verified',
  width = 'standard',
}: {
  title: string;
  description?: string;
  image: ViewerImage;
  source?: MediaSource;
  status?: MediaStatus;
  width?: 'standard' | 'wide' | 'full';
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <MediaFrame
      title={title}
      description={description ?? image.caption}
      source={source}
      status={status}
      width={width}
      className="docs-article-image"
    >
      <button ref={triggerRef} type="button" className="docs-image-open" aria-label={`查看大图：${title}`} onClick={() => setOpen(true)}>
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
        <span className="docs-image-zoom" aria-hidden="true"><Maximize2 /></span>
      </button>
      <LightboxViewer
        title={title}
        images={[image]}
        open={open}
        activeIndex={0}
        onOpenChange={setOpen}
        onActiveIndexChange={() => undefined}
        returnFocusRef={triggerRef}
      />
    </MediaFrame>
  );
}
