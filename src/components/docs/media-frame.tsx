import type { ReactNode } from 'react';

export interface MediaSource {
  label: string;
  href?: string;
}

export type MediaStatus = 'verified' | 'illustrative' | 'generated';

export interface MediaFrameProps {
  title: string;
  description?: string;
  source?: MediaSource;
  status?: MediaStatus;
  width?: 'standard' | 'wide' | 'full';
  tools?: ReactNode;
  className?: string;
  children: ReactNode;
}

const statusLabels: Record<MediaStatus, string> = {
  verified: '已核验',
  illustrative: '示意',
  generated: '生成内容',
};

export function MediaFrame({
  title,
  description,
  source,
  status = 'verified',
  width = 'standard',
  tools,
  className,
  children,
}: MediaFrameProps) {
  return (
    <figure className={`docs-media-frame${className ? ` ${className}` : ''}`} data-width={width}>
      <figcaption>
        <span className="docs-media-heading">
          <strong>{title}</strong>
          {description ? <small>{description}</small> : null}
        </span>
        <span className="docs-media-meta">
          <span data-status={status}>{statusLabels[status]}</span>
          {source ? (
            source.href ? <a href={source.href}>{source.label}</a> : <span>{source.label}</span>
          ) : null}
          {tools ? <span className="docs-media-tools">{tools}</span> : null}
        </span>
      </figcaption>
      <div className="docs-media-body">{children}</div>
    </figure>
  );
}
