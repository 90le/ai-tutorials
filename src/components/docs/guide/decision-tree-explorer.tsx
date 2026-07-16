'use client';

import { useState } from 'react';

type DecisionOption = { label: string; result: string; description: string };

export function DecisionTreeExplorer({ title, question, options }: { title: string; question: string; options: DecisionOption[] }) {
  const [selected, setSelected] = useState(0);
  const current = options[selected];
  return <section className="docs-guide-card docs-decision-tree" aria-labelledby={`${title}-decision`}>
    <h3 id={`${title}-decision`}>{title}</h3>
    <div role="group" aria-label={question}>
      <p>{question}</p>
      <div className="docs-choice-row">{options.map((option, index) => <button type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} key={option.label}>{option.label}</button>)}</div>
    </div>
    <output aria-live="polite"><strong>{current.result}</strong><span>{current.description}</span></output>
  </section>;
}
