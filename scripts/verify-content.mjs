import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const allowedContentTypes = new Set(['tutorial', 'explainer', 'case-study', 'reference', 'experiment']);

function listMarkdownFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(path);
    return /\.mdx?$/.test(entry.name) ? [path] : [];
  });
}

function frontmatterValue(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*([^\\n]+)$`, 'm'));
  return match?.[1]?.trim();
}

export function verifyContent({ contentDir, publicDir }) {
  const errors = [];

  for (const path of listMarkdownFiles(contentDir)) {
    const source = readFileSync(path, 'utf8');
    const name = relative(contentDir, path).replaceAll('\\', '/');
    const published = frontmatterValue(source, 'published');
    const contentType = frontmatterValue(source, 'contentType');
    if (published && !/^\d{4}-\d{2}-\d{2}$/.test(published)) {
      errors.push(`${name}: published 必须使用 YYYY-MM-DD`);
    }
    if (contentType && !allowedContentTypes.has(contentType)) {
      errors.push(`${name}: 不支持的 contentType ${contentType}`);
    }

    const localAssets = new Set();
    for (const match of source.matchAll(/!\[([^\]]*)\]\((\/[^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      if (!match[1]?.trim()) errors.push(`${name}: Markdown 图片缺少替代文本`);
      localAssets.add(match[2]);
    }
    for (const match of source.matchAll(/\bsrc=["'](\/[^"']+)["']/g)) localAssets.add(match[1]);
    for (const match of source.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt=["'][^"']*["']/.test(match[0])) errors.push(`${name}: img 元素缺少 alt`);
    }

    for (const asset of localAssets) {
      const cleanAsset = asset.split(/[?#]/, 1)[0];
      if (!existsSync(resolve(publicDir, `.${cleanAsset}`))) {
        errors.push(`${name}: 本地资源不存在 ${asset}`);
      }
    }
  }

  return errors;
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const errors = verifyContent({ contentDir: join(root, 'content', 'docs'), publicDir: join(root, 'public') });
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Content verification passed.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
