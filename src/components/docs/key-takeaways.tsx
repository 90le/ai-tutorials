import { Sparkle } from '@phosphor-icons/react/ssr';
import type { ReactNode } from 'react';

interface KeyTakeawaysProps {
  title?: string;
  children: ReactNode;
}

export function KeyTakeaways({ title = '读完这一节，你应该带走什么', children }: KeyTakeawaysProps) {
  return (
    <aside className="docs-takeaways">
      <header>
        <Sparkle aria-hidden="true" />
        <strong>{title}</strong>
      </header>
      <ul>{children}</ul>
    </aside>
  );
}
