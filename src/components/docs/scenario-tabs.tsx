'use client';

import type { ReactNode } from 'react';
import { useId, useState } from 'react';

interface ScenarioItem {
  label: string;
  title: string;
  content: ReactNode;
}

interface ScenarioTabsProps {
  label: string;
  items: ScenarioItem[];
}

export function ScenarioTabs({ label, items }: ScenarioTabsProps) {
  const id = useId().replaceAll(':', '');
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="docs-scenario-tabs">
      <div className="docs-scenario-tablist" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={index === activeIndex}
            tabIndex={index === activeIndex ? 0 : -1}
            key={item.label}
            onClick={() => setActiveIndex(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className="docs-scenario-panels">
        {items.map((item, index) => (
          <article
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            hidden={index !== activeIndex}
            key={item.label}
          >
            <strong>{item.title}</strong>
            <div>{item.content}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
