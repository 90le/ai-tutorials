import type { ReactNode } from 'react';
import { CopyTextButton } from './copy-text-button';

interface PromptCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PromptCard({ title, description, children }: PromptCardProps) {
  const copyText = typeof children === 'string' ? children : '';

  return (
    <figure className="docs-prompt-card">
      <figcaption>
        <span>
          <strong>{title}</strong>
          {description ? <small>{description}</small> : null}
        </span>
        <CopyTextButton text={copyText} label="复制提示词" />
      </figcaption>
      <div className="docs-prompt-content">{children}</div>
    </figure>
  );
}
