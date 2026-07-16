import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const docsTheme = readFileSync(
  new URL('../../app/docs/docs-theme.css', import.meta.url),
  'utf8',
);

describe('docs responsive controls', () => {
  it('keeps Mermaid viewer tools available on mobile', () => {
    expect(docsTheme).not.toContain(
      '.docs-mermaid figcaption > span:last-child { display: none; }',
    );
  });

  it('uses track based media widths instead of viewport subtraction', () => {
    expect(docsTheme).not.toContain("max-width: calc(100vw - 34rem)");
    expect(docsTheme).not.toContain("max-width: calc(100vw - 20rem)");
    expect(docsTheme).toContain("grid-column: wide");
    expect(docsTheme).toContain("grid-column: full");
    expect(docsTheme).toContain("max-inline-size: 100%");
  });

  it('reclaims collapsed sidebar columns and grows the article shell', () => {
    expect(docsTheme).toContain("#nd-docs-layout[data-sidebar-collapsed='true']");
    expect(docsTheme).toContain("--fd-sidebar-width: 0px !important");
    expect(docsTheme).toContain("--docs-page-max: 60rem");
    expect(docsTheme).toContain("--docs-page-max: 68rem");
    expect(docsTheme).toContain("--docs-page-max: 76rem");
    expect(docsTheme).toContain("#nd-page");
    expect(docsTheme).toContain("max-width: var(--docs-page-max)");
  });

  it('uses prose, wide and full grid tracks instead of negative media bleed', () => {
    expect(docsTheme).toContain("[prose-start]");
    expect(docsTheme).toContain("[wide-start]");
    expect(docsTheme).toContain("[full-start]");
    expect(docsTheme).toContain("grid-column: wide");
    expect(docsTheme).toContain("grid-column: full");
    expect(docsTheme).not.toContain("translate: -50% 0");
  });
});
