type MatrixRow = { dimension: string; values: string[] };

export function ComparisonMatrix({ title, columns, rows }: { title: string; columns: string[]; rows: MatrixRow[] }) {
  return <div className="docs-guide-card docs-comparison-matrix">
    <table aria-label={title}>
      <caption>{title}</caption>
      <thead><tr><th scope="col">维度</th>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row.dimension}><th scope="row">{row.dimension}</th>{row.values.map((value, index) => <td key={`${row.dimension}-${columns[index] ?? index}`}>{value}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}
