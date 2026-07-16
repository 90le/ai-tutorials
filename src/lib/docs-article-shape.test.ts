import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const flagshipArticles = [
  'content/docs/start-here/ai-task-operating-system.mdx',
  'content/docs/tools/chatgpt/deep-research-workflow.mdx',
  'content/docs/playbooks/ai-second-brain.mdx',
  'content/docs/tools/codex/agentic-repository-delivery.mdx',
  'content/docs/reference/agent-ready-toolkit.mdx',
  'content/docs/playbooks/ai-visual-production.mdx',
] as const;

function extractH2(source: string) {
  let insideFence = false;
  const headings: string[] = [];

  for (const line of source.split('\n')) {
    if (line.startsWith('```')) {
      insideFence = !insideFence;
      continue;
    }
    if (!insideFence && line.startsWith('## ')) headings.push(line.slice(3).trim());
  }

  return headings;
}

describe.each(flagshipArticles)('%s', (file) => {
  const source = readFileSync(resolve(process.cwd(), file), 'utf8');
  const headings = extractH2(source);

  it('uses an editorial long-form heading structure', () => {
    expect(headings.length).toBeGreaterThanOrEqual(5);
    expect(headings.length).toBeLessThanOrEqual(7);
    expect(headings).not.toContain('验收清单');
    expect(headings).not.toContain('可验证成果');
    expect(headings.every((heading) => !/^第[一二三四五六七八九十]+步/.test(heading))).toBe(true);
  });

  it('separates prompts and sources from code and main narrative', () => {
    expect(source).toContain('<PromptCard');
    expect(source).toContain('<SourcesDisclosure>');
  });

  it('contains a diagram and at least one additional structured reading element', () => {
    expect(source).toContain('<MermaidDiagram');
    expect(source).toMatch(/<(KeyTakeaways|ScenarioTabs|SourceMixChart)/);
  });
});
