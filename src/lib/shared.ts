export const appName = 'AI 使用教程';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

const [user, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const projectPath = repo && repo !== `${user}.github.io` ? `/${repo}` : '';

export const gitConfig = {
  user: user ?? '',
  repo: repo ?? '',
  branch: 'main',
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (
  user && repo ? `https://${user}.github.io${projectPath}` : 'http://localhost:3000'
);
