import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="brand-nav-title">
          <span className="brand-nav-mark">AI</span>
          <span>{siteConfig.brand.name.replace(/^AI\s*/, '')}</span>
        </span>
      ),
      transparentMode: 'top',
    },
    links: [
      ...siteConfig.navigation.slice(0, -1).map((item) => ({
        type: 'custom' as const,
        children: <Link href={item.href} prefetch={false}>{item.label}</Link>,
      })),
      { type: 'custom', secondary: true, children: <Link className="brand-doc-cta" href={siteConfig.navigation.at(-1)!.href} prefetch={false}>{siteConfig.navigation.at(-1)!.label}</Link> },
    ],
    githubUrl: siteConfig.repository.url,
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
