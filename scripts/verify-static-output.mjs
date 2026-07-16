import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const requiredRoutes = [
  'index.html',
  'docs/index.html',
  'docs/start-here/ai-task-operating-system/index.html',
];

export function verifyStaticOutput({ outDir }) {
  return requiredRoutes
    .filter((route) => !existsSync(join(outDir, ...route.split('/'))))
    .map((route) => `缺少静态页面 ${route}`);
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const errors = verifyStaticOutput({ outDir: join(root, 'out') });
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Static output verification passed.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
