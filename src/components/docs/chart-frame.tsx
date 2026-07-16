import type { ReactNode } from 'react';
import { Download } from 'lucide-react';
import { DiagramViewer } from './diagram-viewer';
import { MediaFrame, type MediaSource, type MediaStatus } from './media-frame';

interface ChartColumn {
  key: string;
  label: string;
}

type ChartRow = Record<string, string | number | null | undefined>;

function chartCsv(title: string, columns: readonly ChartColumn[], rows: readonly ChartRow[]) {
  const escape = (value: string | number | null | undefined) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [
    [title],
    columns.map((column) => column.label),
    ...rows.map((row) => columns.map((column) => row[column.key])),
  ].map((line) => line.map(escape).join(',')).join('\n');
}

function ChartDataTable({ title, columns, rows }: { title: string; columns: readonly ChartColumn[]; rows: readonly ChartRow[] }) {
  return (
    <div className="docs-chart-data-scroll" role="region" aria-label={`${title}数据`} tabIndex={0}>
      <table>
        <caption>{title}的数据</caption>
        <thead><tr>{columns.map((column) => <th scope="col" key={column.key}>{column.label}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}>{columns.map((column) => <td key={column.key}>{row[column.key] ?? '—'}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function ChartFrame({
  title,
  description,
  source,
  status = 'verified',
  caveat,
  columns,
  rows,
  controls,
  summary,
  viewerContent,
  children,
}: {
  title: string;
  description?: string;
  source: MediaSource;
  status?: MediaStatus;
  caveat?: string;
  columns: readonly ChartColumn[];
  rows: readonly ChartRow[];
  controls?: ReactNode;
  summary?: ReactNode;
  viewerContent: ReactNode;
  children: ReactNode;
}) {
  const csv = `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${chartCsv(title, columns, rows)}`)}`;

  return (
    <MediaFrame
      title={title}
      description={description}
      source={source}
      status={status}
      width="wide"
      className="docs-chart-frame"
      tools={(
        <>
          <DiagramViewer title={title}>{viewerContent}</DiagramViewer>
          <a href={csv} download="chart-data.csv" aria-label="下载图表数据 CSV" title="下载数据"><Download aria-hidden="true" /></a>
        </>
      )}
    >
      {controls ? <div className="docs-chart-controls">{controls}</div> : null}
      <div className="docs-chart-visual">{children}</div>
      {summary ? <div className="docs-chart-summary">{summary}</div> : null}
      {caveat ? <p className="docs-chart-caveat">{caveat}</p> : null}
      <details className="docs-chart-data">
        <summary>查看数据</summary>
        <ChartDataTable title={title} columns={columns} rows={rows} />
      </details>
    </MediaFrame>
  );
}
