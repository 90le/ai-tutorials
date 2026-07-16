'use client';

import { useEffect, useState } from 'react';

export function CodeBlockEnhancer() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const teardowns: Array<() => void> = [];
    const figures = document.querySelectorAll<HTMLElement>('.docs-page-content figure.shiki');

    figures.forEach((figure) => {
      if (figure.querySelector('.docs-code-tools')) return;
      const region = figure.querySelector<HTMLElement>('[role="region"]') ?? figure.querySelector<HTMLElement>('pre');
      if (!region) return;

      const tools = document.createElement('div');
      tools.className = 'docs-code-tools';
      tools.setAttribute('aria-label', '代码显示选项');
      const wrapButton = document.createElement('button');
      wrapButton.type = 'button';
      wrapButton.textContent = '自动换行';
      wrapButton.setAttribute('aria-pressed', 'false');
      const expandButton = document.createElement('button');
      expandButton.type = 'button';
      expandButton.textContent = '展开全部';
      expandButton.setAttribute('aria-pressed', 'false');

      const toggleWrap = () => {
        const wrapped = region.dataset.wrap !== 'true';
        region.dataset.wrap = String(wrapped);
        wrapButton.setAttribute('aria-pressed', String(wrapped));
        wrapButton.textContent = wrapped ? '保持原行' : '自动换行';
        setStatus(wrapped ? '代码已自动换行' : '代码已恢复原始行宽');
      };
      const toggleExpanded = () => {
        const expanded = figure.dataset.expanded !== 'true';
        figure.dataset.expanded = String(expanded);
        expandButton.setAttribute('aria-pressed', String(expanded));
        expandButton.textContent = expanded ? '收起代码' : '展开全部';
        setStatus(expanded ? '代码块已展开' : '代码块已收起');
      };

      wrapButton.addEventListener('click', toggleWrap);
      expandButton.addEventListener('click', toggleExpanded);
      tools.append(wrapButton, expandButton);
      const caption = figure.querySelector('figcaption');
      (caption ?? figure).append(tools);

      teardowns.push(() => {
        wrapButton.removeEventListener('click', toggleWrap);
        expandButton.removeEventListener('click', toggleExpanded);
        tools.remove();
        delete region.dataset.wrap;
        delete figure.dataset.expanded;
      });
    });

    return () => teardowns.forEach((teardown) => teardown());
  }, []);

  return <span className="docs-code-status" aria-live="polite" aria-atomic="true">{status}</span>;
}
