import { insert, search } from '@orama/orama';
import { describe, expect, it } from 'vitest';
import { createMandarinOrama } from './mandarin-search';

describe('Mandarin search', () => {
  it('finds a Chinese compound inside a tutorial title', async () => {
    const database = createMandarinOrama();
    await insert(database, { _: '搭建个人 AI 知识库' });

    const result = await search(database, { term: '知识库' });

    expect(result.count).toBe(1);
  });
});
