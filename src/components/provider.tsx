'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{ SearchDialog }}
      i18n={{
        locale: 'zh-CN',
        translations: {
          'Search(search dialog)': '搜索',
          'Search(search trigger)': '搜索知识库',
          'Open Search(search trigger)(aria-label)': '打开搜索',
          'Close Search(search dialog)(aria-label)': '关闭搜索',
          'No results found(search dialog)': '没有找到相关内容',
          'On this page(table of contents)': '本页目录',
          'No Headings(table of contents)': '本页没有小标题',
          'Table of Contents(inline table of contents)': '目录',
          'Open Sidebar(sidebar)(aria-label)': '打开文档导航',
          'Collapse Sidebar(sidebar)(aria-label)': '收起文档导航',
          'Toggle Theme(theme switcher)(aria-label)': '切换主题',
          'Light(theme switcher)(aria-label)': '浅色模式',
          'Dark(theme switcher)(aria-label)': '深色模式',
          'System(theme switcher)(aria-label)': '跟随系统',
          'Copy Markdown(page actions)': '复制 Markdown',
          'Open(page actions)': '更多打开方式',
          'View as Markdown(page actions)': '查看 Markdown',
          'Open in GitHub(page actions)': '在 GitHub 中打开',
          'Copy Anchor Link(heading anchor)(aria-label)': '复制标题链接',
          'Previous Page(pagination)': '上一篇',
          'Next Page(pagination)': '下一篇',
          displayName: '简体中文',
        },
      }}
    >
      {children}
    </RootProvider>
  );
}
