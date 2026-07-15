import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isProjectPages = Boolean(repository && repository !== `${owner}.github.io`);

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  basePath: isProjectPages ? `/${repository}` : '',
};

export default withMDX(config);
