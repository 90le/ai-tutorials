type GlossaryItem = { term: string; definition: string; aliases?: string[]; href?: string };

export function GlossaryGrid({ title, items }: { title: string; items: GlossaryItem[] }) {
  return <section className="docs-guide-card docs-glossary-grid" aria-labelledby={`${title}-glossary`}>
    <h3 id={`${title}-glossary`}>{title}</h3>
    <dl>{items.map((item) => <div key={item.term}><dt>{item.href ? <a href={item.href}>{item.term}</a> : item.term}</dt><dd>{item.definition}{item.aliases?.length ? <small>别名：{item.aliases.join('、')}</small> : null}</dd></div>)}</dl>
  </section>;
}
