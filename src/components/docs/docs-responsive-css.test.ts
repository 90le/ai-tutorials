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
});
