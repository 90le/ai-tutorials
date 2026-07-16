'use client';

import { useState, type ComponentProps, type HTMLAttributes, type ReactNode } from 'react';
import { CodeBlock } from 'fumadocs-ui/components/codeblock';

type DocsCodeBlockProps = ComponentProps<typeof CodeBlock> & { 'data-language'?: string };

export function DocsCodeBlock({ title, children, ...props }: DocsCodeBlockProps) {
  const [wrapped, setWrapped] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(Boolean(props['data-line-numbers']));
  const language = props['data-language'];
  const heading = title ?? (language ? language.toUpperCase() : '代码');
  const viewportProps = {
    ...props.viewportProps,
    'data-wrap': wrapped || undefined,
  } as HTMLAttributes<HTMLElement> & { 'data-wrap'?: boolean };

  return (
    <CodeBlock
      {...props}
      title={heading}
      data-expanded={expanded || undefined}
      data-line-numbers={lineNumbers || undefined}
      viewportProps={viewportProps}
      Actions={({ className, children: copyButton }) => (
        <div className={`docs-code-toolbar ${className ?? ''}`} aria-label="代码显示选项">
          <button type="button" aria-pressed={wrapped} onClick={() => setWrapped((value) => !value)}>{wrapped ? '保持原行' : '自动换行'}</button>
          <button type="button" aria-pressed={lineNumbers} onClick={() => setLineNumbers((value) => !value)}>{lineNumbers ? '隐藏行号' : '显示行号'}</button>
          <button type="button" aria-pressed={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? '收起代码' : '展开全部'}</button>
          {copyButton as ReactNode}
        </div>
      )}
    >
      {children}
    </CodeBlock>
  );
}
