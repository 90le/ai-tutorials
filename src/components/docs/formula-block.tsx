import type { ReactNode } from 'react';
import { CopyTextButton } from './copy-text-button';

interface FormulaVariable {
  symbol: string;
  meaning: string;
}

export function FormulaBlock({
  title,
  latex,
  variables = [],
  children,
}: {
  title: string;
  latex: string;
  variables?: readonly FormulaVariable[];
  children: ReactNode;
}) {
  return (
    <figure className="docs-formula-block" data-latex={latex}>
      <figcaption>
        <strong>{title}</strong>
        <CopyTextButton text={latex} label="复制 LaTeX" />
      </figcaption>
      <div className="docs-formula-content" aria-label={`公式：${title}`}>{children}</div>
      {variables.length > 0 ? (
        <dl>
          {variables.map((variable) => (
            <div key={variable.symbol}><dt>{variable.symbol}</dt><dd>{variable.meaning}</dd></div>
          ))}
        </dl>
      ) : null}
    </figure>
  );
}
