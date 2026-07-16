import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { verifyContent } from './verify-content.mjs';
import { verifyStaticOutput } from './verify-static-output.mjs';

const temporaryDirectories = [];
const temporaryDirectory = () => {
  const directory = mkdtempSync(join(tmpdir(), 'ai-tutorials-'));
  temporaryDirectories.push(directory);
  return directory;
};

afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory) => rmSync(directory, { recursive: true, force: true }));
});

describe('content verification', () => {
  it('reports missing local images and empty Markdown alt text', () => {
    const root = temporaryDirectory();
    const contentDir = join(root, 'content');
    const publicDir = join(root, 'public');
    mkdirSync(contentDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
    writeFileSync(join(contentDir, 'broken.mdx'), `---\ntitle: Broken\ndescription: Broken page\ntags:\n  - AI\npublished: 2026-07-16\n---\n\n![](/images/missing.png)\n`);

    expect(verifyContent({ contentDir, publicDir })).toEqual([
      'broken.mdx: Markdown 图片缺少替代文本',
      'broken.mdx: 本地资源不存在 /images/missing.png',
    ]);
  });

  it('accepts a valid page and existing local image', () => {
    const root = temporaryDirectory();
    const contentDir = join(root, 'content');
    const publicDir = join(root, 'public');
    mkdirSync(join(publicDir, 'images'), { recursive: true });
    mkdirSync(contentDir, { recursive: true });
    writeFileSync(join(publicDir, 'images', 'valid.png'), 'fixture');
    writeFileSync(join(contentDir, 'valid.mdx'), `---\ntitle: Valid\ndescription: Valid page\ntags:\n  - AI\npublished: 2026-07-16\ncontentType: explainer\n---\n\n![有效图片](/images/valid.png)\n`);

    expect(verifyContent({ contentDir, publicDir })).toEqual([]);
  });
});

describe('static output verification', () => {
  it('reports missing required routes', () => {
    const outDir = temporaryDirectory();
    mkdirSync(join(outDir, 'docs'), { recursive: true });
    writeFileSync(join(outDir, 'index.html'), '<html></html>');

    expect(verifyStaticOutput({ outDir })).toContain('缺少静态页面 docs/index.html');
  });
});
