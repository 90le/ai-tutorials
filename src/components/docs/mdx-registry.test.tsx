import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const registry = readFileSync(new URL('../mdx.tsx', import.meta.url), 'utf8');

describe('MDX component registry', () => {
  it('registers the complete Fumadocs authoring set', () => {
    for (const name of ['Steps', 'Step', 'Tabs', 'Tab', 'Accordions', 'Accordion', 'TypeTable']) {
      expect(registry).toMatch(new RegExp(`\\b${name},`));
    }
  });
});
