import { oramaStaticClient } from 'fumadocs-core/search/client/orama-static';
import { createMandarinOrama } from './mandarin-search';

export function createMandarinStaticSearchClient() {
  return oramaStaticClient({
    initOrama: createMandarinOrama,
  });
}
