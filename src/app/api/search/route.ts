import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { mandarinTokenizer } from '@/lib/mandarin-search';

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  tokenizer: mandarinTokenizer,
});
