import { oramaStaticClient } from 'fumadocs-core/search/client/orama-static';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMandarinStaticSearchClient } from './mandarin-search-client';

vi.mock('fumadocs-core/search/client/orama-static', () => ({
  oramaStaticClient: vi.fn((options) => options),
}));

describe('Mandarin static search client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not request a locale-specific database from a single-locale static index', () => {
    createMandarinStaticSearchClient();

    expect(oramaStaticClient).toHaveBeenCalledWith(
      expect.not.objectContaining({ locale: expect.anything() }),
    );
  });
});
