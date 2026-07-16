'use client';

import { useState } from 'react';

type RevealStep = { title: string; content: string };

export function RevealSequence({ title, steps }: { title: string; steps: RevealStep[] }) {
  const [current, setCurrent] = useState(0);
  return <section className="docs-guide-card docs-reveal-sequence" aria-labelledby={`${title}-reveal`}>
    <header><h3 id={`${title}-reveal`}>{title}</h3><span>{current + 1} / {steps.length}</span></header>
    <ol aria-label={title}>{steps.map((step, index) => <li aria-current={index === current ? 'step' : undefined} key={step.title}><button type="button" onClick={() => setCurrent(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step.title}</strong></button><p>{step.content}</p></li>)}</ol>
    <div className="docs-sequence-controls"><button type="button" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>上一步</button><button type="button" disabled={current === steps.length - 1} onClick={() => setCurrent((value) => value + 1)}>下一步</button></div>
  </section>;
}
