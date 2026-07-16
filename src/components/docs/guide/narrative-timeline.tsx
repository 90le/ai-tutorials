type TimelineItem = { label: string; title: string; description: string; status?: string };

export function NarrativeTimeline({ title, items }: { title: string; items: TimelineItem[] }) {
  return <section className="docs-guide-card docs-narrative-timeline" aria-labelledby={`${title}-timeline`}>
    <h3 id={`${title}-timeline`}>{title}</h3>
    <ol>{items.map((item) => <li key={`${item.label}-${item.title}`}>
      <span className="docs-timeline-label">{item.label}</span>
      <div><h4>{item.title}</h4><p>{item.description}</p>{item.status && <small>{item.status}</small>}</div>
    </li>)}</ol>
  </section>;
}
