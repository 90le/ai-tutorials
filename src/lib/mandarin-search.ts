import { create } from '@orama/orama';
import { stopwords as mandarinStopwords } from '@orama/stopwords/mandarin';
import { createTokenizer } from '@orama/tokenizers/mandarin';

export const mandarinTokenizer = createTokenizer({
  language: 'mandarin',
  stopWords: mandarinStopwords,
});

export function createMandarinOrama() {
  return create({
    schema: { _: 'string' },
    components: { tokenizer: mandarinTokenizer },
  });
}
