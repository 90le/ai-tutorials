import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

describe('project governance', () => {
  it('routes every supported task to a checked-in workflow', () => {
    const workflows = [
      'research-and-write-article.md',
      'review-and-refactor-content.md',
      'enhance-reading-experience.md',
      'performance-and-motion-audit.md',
      'release.md',
    ];

    for (const workflow of workflows) {
      expect(existsSync(resolve(root, '.codex/workflows', workflow)), workflow).toBe(true);
      expect(read(`.codex/README.md`)).toContain(workflow);
    }
  });

  it('keeps reusable execution briefs in the templates directory', () => {
    const templates = [
      'article-brief.md',
      'research-plan.md',
      'component-brief.md',
      'release-report.md',
    ];

    for (const template of templates) {
      expect(existsSync(resolve(root, '.codex/templates', template)), template).toBe(true);
    }
  });

  it('defines five content types without forcing one article structure', () => {
    const model = read('docs/content-model.md');

    for (const type of ['tutorial', 'explainer', 'case-study', 'reference', 'experiment']) {
      expect(model).toContain(`\`${type}\``);
    }
    expect(model).toContain('不强制');
  });

  it('provides one aggregate quality command and archives dated QA', () => {
    const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };

    expect(packageJson.scripts?.check).toBe('npm run verify:content && npm test && npm run lint && npm run types:check && npm run build && npm run verify:output');
    expect(existsSync(resolve(root, 'design-qa.md'))).toBe(false);
    expect(existsSync(resolve(root, 'docs/qa/archive/2026-07-15-design-qa.md'))).toBe(true);
  });
});
