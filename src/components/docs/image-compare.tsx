'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import type { ViewerImage } from './lightbox-viewer';
import { MediaFrame, type MediaSource } from './media-frame';

export function getNextComparePosition(position: number, key: string) {
  if (key === 'Home') return 0;
  if (key === 'End') return 100;
  if (key === 'ArrowLeft' || key === 'ArrowDown') return Math.max(0, position - 1);
  if (key === 'ArrowRight' || key === 'ArrowUp') return Math.min(100, position + 1);
  return position;
}

export function ImageCompare({
  title,
  description,
  before,
  after,
  source,
}: {
  title: string;
  description?: string;
  before: ViewerImage;
  after: ViewerImage;
  source?: MediaSource;
}) {
  const [position, setPosition] = useState(50);

  return (
    <MediaFrame title={title} description={description} source={source} width="wide" className="docs-image-compare">
      <div className="docs-compare-stage">
        <img src={before.src} alt={before.alt} width={before.width} height={before.height} />
        <img
          className="docs-compare-after"
          src={after.src}
          alt={after.alt}
          width={after.width}
          height={after.height}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <i aria-hidden="true" style={{ left: `${position}%` }} />
        <span className="docs-compare-label docs-compare-before">{before.caption ?? '优化前'}</span>
        <span className="docs-compare-label docs-compare-after-label">{after.caption ?? '优化后'}</span>
      </div>
      <label className="docs-compare-control">
        <span>对比位置</span>
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          aria-label={`调整${title}对比位置`}
          onChange={(event) => setPosition(Number(event.target.value))}
          onKeyDown={(event) => {
            const nextPosition = getNextComparePosition(position, event.key);

            if (nextPosition === position && !['Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            setPosition(nextPosition);
          }}
        />
        <output>{position}%</output>
      </label>
    </MediaFrame>
  );
}
