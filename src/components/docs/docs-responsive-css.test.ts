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

  it('uses breakpoint based media bleed instead of viewport subtraction', () => {
    expect(docsTheme).not.toContain("max-width: calc(100vw - 34rem)");
    expect(docsTheme).not.toContain("max-width: calc(100vw - 20rem)");
    expect(docsTheme).toContain("@media (min-width: 90rem)");
    expect(docsTheme).toContain("@media (min-width: 112rem)");
    expect(docsTheme).toContain("max-inline-size: 100%");
  });
});
