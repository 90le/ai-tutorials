import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Link from 'next/link';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  const githubUrl = gitConfig.user && gitConfig.repo
    ? `https://github.com/${gitConfig.user}/${gitConfig.repo}`
    : undefined;

  return {
    nav: {
      title: (
        <span className="brand-nav-title">
          <span className="brand-nav-mark">AI</span>
          <span>使用教程</span>
        </span>
      ),
      transparentMode: 'top',
    },
    links: [
      { type: 'custom', children: <Link href="/docs/" prefetch={false}>文档首页</Link> },
      { type: 'custom', children: <Link href="/docs/tools/" prefetch={false}>工具与模型</Link> },
      { type: 'custom', children: <Link href="/docs/playbooks/" prefetch={false}>工作流</Link> },
      { type: 'custom', secondary: true, children: <Link className="brand-doc-cta" href="/docs/start-here/" prefetch={false}>开始学习</Link> },
    ],
    githubUrl,
  };
}

export function docsOptions(): BaseLayoutProps {
  const options = baseOptions();

  return {
    ...options,
    nav: {
      ...options.nav,
      transparentMode: 'none',
    },
    // The docs tree already contains every content destination. Repeating the
    // marketing navigation above it made the desktop sidebar longer and harder
    // to scan, so the reading shell deliberately keeps a single navigation model.
    links: [],
  };
}
