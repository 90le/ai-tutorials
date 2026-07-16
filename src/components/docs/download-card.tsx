import { FileDown } from 'lucide-react';

export function DownloadCard({
  title,
  description,
  href,
  format,
  size,
  updated,
  source,
}: {
  title: string;
  description?: string;
  href: string;
  format: string;
  size: string;
  updated: string;
  source?: string;
}) {
  return (
    <aside className="docs-download-card">
      <FileDown aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        {description ? <p>{description}</p> : null}
        <span>{format} · {size} · 更新于 {updated}{source ? ` · 来源：${source}` : ''}</span>
      </div>
      <a href={href} download>下载文件</a>
    </aside>
  );
}
