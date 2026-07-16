import { Download } from 'lucide-react';
import { DiagramViewer } from './diagram-viewer';
import { MediaFrame, type MediaSource, type MediaStatus } from './media-frame';

type CellValue = string | number | null | undefined;
type DataRow = Record<string, CellValue>;

interface DataColumn {
  key: string;
  label: string;
  align?: 'text' | 'number';
}

function TableMarkup({ title, columns, rows }: { title: string; columns: readonly DataColumn[]; rows: readonly DataRow[] }) {
  return (
    <div className="docs-data-table-scroll" role="region" aria-label={`${title}数据表`} tabIndex={0}>
      <table>
        <caption>{title}</caption>
        <thead><tr>{columns.map((column) => <th scope="col" data-align={column.align ?? 'text'} key={column.key}>{column.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{columns.map((column) => <td data-align={column.align ?? 'text'} key={column.key}>{row[column.key] ?? '—'}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function toCsv(title: string, columns: readonly DataColumn[], rows: readonly DataRow[]) {
  const escape = (value: CellValue) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [
    [title],
    columns.map((column) => column.label),
    ...rows.map((row) => columns.map((column) => row[column.key])),
  ].map((line) => line.map(escape).join(',')).join('\n');
}

export function DataTable({
  title,
  description,
  columns,
  rows,
  source,
  status = 'verified',
  downloadName = 'data.csv',
}: {
  title: string;
  description?: string;
  columns: readonly DataColumn[];
  rows: readonly DataRow[];
  source?: MediaSource;
  status?: MediaStatus;
  downloadName?: string;
}) {
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${toCsv(title, columns, rows)}`)}`;
  const table = <TableMarkup title={title} columns={columns} rows={rows} />;

  return (
    <MediaFrame
      title={title}
      description={description}
      source={source}
      status={status}
      width="wide"
      className="docs-data-table"
      tools={(
        <>
          <DiagramViewer title={title}><div className="docs-data-table-dialog">{table}</div></DiagramViewer>
          <a href={csvHref} download={downloadName} aria-label="下载 CSV" title="下载 CSV"><Download aria-hidden="true" /></a>
        </>
      )}
    >
      {table}
    </MediaFrame>
  );
}
