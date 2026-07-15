'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function DocsPortalSearch() {
  const { setOpenSearch } = useSearchContext();

  return (
    <button className="docs-portal-search" type="button" onClick={() => setOpenSearch(true)}>
      <MagnifyingGlass aria-hidden="true" weight="regular" />
      <span>搜索知识库、教程、工具或场景</span>
      <kbd>Ctrl K</kbd>
      <strong>搜索</strong>
    </button>
  );
}
