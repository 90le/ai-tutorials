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
      { type: 'custom', children: <Link href="/docs/start-here/" prefetch={false}>快速开始</Link> },
      { type: 'custom', children: <Link href="/docs/tools/" prefetch={false}>工具库</Link> },
      { type: 'custom', children: <Link href="/docs/series/" prefetch={false}>系列课程</Link> },
      { type: 'custom', children: <Link href="/docs/playbooks/" prefetch={false}>场景打法</Link> },
      { type: 'custom', secondary: true, children: <Link className="brand-doc-cta" href="/docs/" prefetch={false}>进入文档</Link> },
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
    links: options.links?.filter((link) => !(link.type === 'custom' && link.secondary)),
  };
}
