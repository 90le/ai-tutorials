import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { showcaseRows, showcaseScenarios } from './showcase-data';

const root = fileURLToPath(new URL('../../../../', import.meta.url));

describe('experience lab fixtures', () => {
  it('keeps the article examples complete and internally consistent', () => {
    expect(showcaseRows).toHaveLength(6);
    expect(showcaseRows.every((row) => row.claim && row.evidence && row.status)).toBe(true);
    expect(showcaseScenarios.map((item) => item.label)).toEqual(['原始材料', '证据卡', '交付稿']);
  });

  it('publishes matching CSV and JSON downloads', () => {
    const csv = readFileSync(join(root, 'public/downloads/experience-lab/evidence-matrix.csv'), 'utf8');
    const contract = JSON.parse(
      readFileSync(join(root, 'public/downloads/experience-lab/task-contract.json'), 'utf8'),
    ) as Record<string, unknown>;

    expect(csv).toContain('主张,证据,状态');
    for (const row of showcaseRows) expect(csv).toContain(row.claim);
    expect(contract).toMatchObject({
      goal: '把零散 AI 调研材料变成可复核交付',
      audience: '需要据此做出下一步决定的项目成员',
    });
  });
});
