export interface SiteNavigationItem {
  label: string;
  href: string;
}

export interface AuthorContact {
  id: 'wechat' | 'official';
  label: string;
  handle: string;
  imageSrc: string;
  imageAlt: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    shortName: string;
    descriptor: string;
    description: string;
  };
  author: {
    name: string;
    bio: string;
    wechat: string;
    officialAccount: string;
    contacts: readonly AuthorContact[];
  };
  repository: {
    owner: string;
    name: string;
    branch: string;
    url: string;
    issuesUrl: string;
  };
  navigation: readonly SiteNavigationItem[];
  footerNavigation: readonly SiteNavigationItem[];
  siteUrl: string;
}

interface SiteUrlContext {
  explicitUrl?: string;
  githubRepository?: string;
}

export function resolveSiteUrl({ explicitUrl, githubRepository }: SiteUrlContext): string {
  if (explicitUrl) return explicitUrl.replace(/\/$/, '');

  const [owner, repository] = (githubRepository ?? '').split('/');
  if (!owner || !repository) return 'http://localhost:3000';

  const projectPath = repository === `${owner}.github.io` ? '' : `/${repository}`;
  return `https://${owner}.github.io${projectPath}`;
}

const [environmentOwner, environmentRepository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const repositoryOwner = environmentOwner || '90le';
const repositoryName = environmentRepository || 'ai-tutorials';

const contacts = [
  {
    id: 'wechat',
    label: '添加微信',
    handle: 'binStudy',
    imageSrc: '/images/site/wechat-bin-study.png',
    imageAlt: '丘彬彬的微信二维码，微信号 binStudy',
  },
  {
    id: 'official',
    label: '关注公众号',
    handle: '彬彬说',
    imageSrc: '/images/site/wechat-official-binbinshuo.jpg',
    imageAlt: '微信公众号彬彬说的二维码',
  },
] as const satisfies readonly AuthorContact[];

export const siteConfig = {
  brand: {
    name: 'AI 使用教程',
    shortName: 'AI',
    descriptor: 'AI 知识与实践中心',
    description: '面向中文读者的开源 AI 知识与实践中心，覆盖模型、智能体、研究、创作、开发与自动化。',
  },
  author: {
    name: '丘彬彬',
    bio: '把 AI 用进真实工作，并把可复用的方法持续公开。',
    wechat: 'binStudy',
    officialAccount: '彬彬说',
    contacts,
  },
  repository: {
    owner: repositoryOwner,
    name: repositoryName,
    branch: 'main',
    url: `https://github.com/${repositoryOwner}/${repositoryName}`,
    issuesUrl: `https://github.com/${repositoryOwner}/${repositoryName}/issues`,
  },
  navigation: [
    { label: '文档首页', href: '/docs/' },
    { label: '工具与模型', href: '/docs/tools/' },
    { label: '工作流', href: '/docs/playbooks/' },
    { label: '开始学习', href: '/docs/start-here/' },
  ],
  footerNavigation: [
    { label: '工具与模型', href: '/docs/tools/' },
    { label: '系列课程', href: '/docs/series/' },
    { label: '工作流', href: '/docs/playbooks/' },
    { label: '参考资料', href: '/docs/reference/' },
  ],
  siteUrl: resolveSiteUrl({
    explicitUrl: process.env.NEXT_PUBLIC_SITE_URL,
    githubRepository: process.env.GITHUB_REPOSITORY,
  }),
} as const satisfies SiteConfig;
