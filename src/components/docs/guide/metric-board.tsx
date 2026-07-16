type Metric = { label: string; value: string; unit?: string; change?: string; description?: string };

export function MetricBoard({ title, metrics }: { title: string; metrics: Metric[] }) {
  return <section className="docs-guide-card docs-metric-board" aria-labelledby={`${title}-metrics`}>
    <h3 id={`${title}-metrics`}>{title}</h3>
    <dl>{metrics.map((metric) => <div key={metric.label}>
      <dt>{metric.label}</dt>
      <dd><strong>{metric.value}</strong>{metric.unit && <span>{metric.unit}</span>}</dd>
      {metric.change && <small>{metric.change}</small>}
      {metric.description && <p>{metric.description}</p>}
    </div>)}</dl>
  </section>;
}
