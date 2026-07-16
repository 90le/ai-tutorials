type Claim = { claim: string; source: string; date: string; status: string; limitation?: string; href?: string };

export function CitationCluster({ title, claims }: { title: string; claims: Claim[] }) {
  return <section className="docs-guide-card docs-citation-cluster" aria-labelledby={`${title}-citations`}>
    <h3 id={`${title}-citations`}>{title}</h3>
    <ul>{claims.map((item) => <li key={`${item.claim}-${item.source}`}>
      <div><strong>{item.claim}</strong><span data-status={item.status}>{item.status}</span></div>
      <p>{item.href ? <a href={item.href}>{item.source}</a> : item.source} · <time>{item.date}</time></p>
      {item.limitation && <small>限制：{item.limitation}</small>}
    </li>)}</ul>
  </section>;
}
