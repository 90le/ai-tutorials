import { describe, expect, it } from 'vitest';
import { resolveSiteUrl, siteConfig } from './site';

describe('siteConfig', () => {
  it('keeps brand, author and primary navigation in one typed source', () => {
    expect(siteConfig.brand.name).toBe('AI 使用教程');
    expect(siteConfig.brand.descriptor).toBe('AI 知识与实践中心');
    expect(siteConfig.author.name).toBe('丘彬彬');
    expect(siteConfig.author.wechat).toBe('binStudy');
    expect(siteConfig.author.officialAccount).toBe('彬彬说');
    expect(siteConfig.navigation.map((item) => item.href)).toContain('/docs/');
  });

  it('resolves project Pages and explicit site URLs', () => {
    expect(resolveSiteUrl({ githubRepository: '90le/ai-tutorials' }))
      .toBe('https://90le.github.io/ai-tutorials');
    expect(resolveSiteUrl({ githubRepository: '90le/90le.github.io' }))
      .toBe('https://90le.github.io');
    expect(resolveSiteUrl({ explicitUrl: 'https://ai.example.com/' }))
      .toBe('https://ai.example.com');
  });

  it('falls back to the local development URL without repository context', () => {
    expect(resolveSiteUrl({})).toBe('http://localhost:3000');
  });
});
