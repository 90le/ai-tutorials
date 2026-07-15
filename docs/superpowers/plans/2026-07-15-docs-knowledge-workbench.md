# AI 文档知识工作台实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/docs/` 升级为真实数据驱动的中文 AI 知识工作台，并补充 8 篇可阅读教程，同时保持 Fumadocs、静态导出、深浅主题与移动端可用。

**Architecture:** 保留 Fumadocs 的页面树、搜索、目录和静态路由，在动态文档路由中为根文档页分流到服务端渲染的 `DocsPortal`。通过纯函数将 MDX 元数据规范化为门户数据，文章页继续使用 `DocsPage`，但替换标题区并加载独立的文档主题样式。

**Tech Stack:** Next.js 16.2、React 19、Fumadocs 16.11、MDX、Tailwind CSS 4、Orama 静态搜索、Vitest、GitHub Pages 静态导出。

## Global Constraints

- 所有页面必须兼容 `output: export`，不得依赖登录、数据库或运行时私有 API。
- 文档门户的数量、日期、标签和精选状态必须来自真实 MDX，不显示虚构统计。
- 文档阅读页不得加载 Three.js、Matter.js、GSAP 或 Lenis。
- 文档专属组件放在 `src/components/docs/`，专属样式放在 `src/app/docs/docs-theme.css`。
- 每篇新增文章必须包含 `title`、`description`、`tags`、`published` 和 `difficulty`。
- 所有新行为遵循测试先行；最终运行 `npm run test`、`npm run lint`、`npm run types:check` 和 `npm run build`。

---

### Task 1: 元数据 schema 与内容聚合

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `source.config.ts`
- Create: `src/lib/docs-content.ts`
- Test: `src/lib/docs-content.test.ts`

**Interfaces:**
- Consumes: `source.getPages()` 返回的页面对象。
- Produces: `normalizeDocPage(page)`、`buildDocsIndex(pages)`、`DocSummary`、`DocsIndex`。

- [ ] **Step 1: 安装 Vitest 并增加测试脚本**

Run: `npm install --save-dev vitest`

在 `package.json` 中增加：

```json
"test": "vitest run"
```

- [ ] **Step 2: 编写失败测试**

测试覆盖：合法日期规范化、规划内容过滤、最近更新降序、精选为空时回退最新内容、真实分类数量。

```ts
import { describe, expect, it } from 'vitest';
import { buildDocsIndex, normalizeDocPage } from './docs-content';

describe('docs content index', () => {
  it('sorts published pages and excludes planned pages', () => {
    const index = buildDocsIndex([publishedNewer, planned, publishedOlder]);
    expect(index.recent.map((item) => item.title)).toEqual(['Newer', 'Older']);
  });
});
```

- [ ] **Step 3: 运行测试确认 RED**

Run: `npm run test`

Expected: FAIL，因为 `src/lib/docs-content.ts` 尚不存在。

- [ ] **Step 4: 扩展 frontmatter schema 并实现纯函数**

使用 Zod 扩展 `pageSchema`，`published` 校验 `YYYY-MM-DD`，`difficulty` 和 `status` 使用枚举。实现内容排序、分类解析和精选回退，不在工具函数中读取文件系统。

- [ ] **Step 5: 运行测试确认 GREEN**

Run: `npm run test`

Expected: 所有元数据测试通过。

- [ ] **Step 6: 提交**

```bash
git add package.json package-lock.json source.config.ts src/lib/docs-content.ts src/lib/docs-content.test.ts
git commit -m "feat: add typed docs content index"
```

### Task 2: 文档门户与知识路径

**Files:**
- Create: `src/components/docs/docs-portal.tsx`
- Create: `src/components/docs/docs-portal-search.tsx`
- Create: `src/components/docs/learning-destinations.tsx`
- Create: `src/components/docs/knowledge-path.tsx`
- Create: `src/components/docs/content-feed.tsx`
- Modify: `src/app/docs/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: `DocsIndex`。
- Produces: 根路由 `/docs/` 的服务器渲染门户；搜索按钮打开现有 Fumadocs 搜索对话框。

- [ ] **Step 1: 编写失败的静态输出断言**

在实现前运行：

```powershell
npm run build
Select-String -Path out/docs/index.html -Pattern '探索知识地图'
```

Expected: 搜索无匹配。

- [ ] **Step 2: 实现根文档页分流**

在 `page.tsx` 中仅对 `page.slugs.length === 0` 渲染 `DocsPortal`；其他路由保持文章渲染路径。

- [ ] **Step 3: 实现门户模块**

门户必须包含：紧凑欢迎区、搜索、四个任务入口、五步知识路径、精选内容、最近更新和右侧上下文。所有链接指向真实站内页面。

- [ ] **Step 4: 构建并确认 GREEN**

Run: `npm run build`

Expected: `out/docs/index.html` 包含“探索知识地图”“最近更新”，且不包含“128 篇”或“40%”。

- [ ] **Step 5: 提交**

```bash
git add src/components/docs src/app/docs/[[...slug]]/page.tsx
git commit -m "feat: build docs knowledge portal"
```

### Task 3: 文档外壳、文章头部与主题

**Files:**
- Create: `src/components/docs/docs-article-header.tsx`
- Create: `src/app/docs/docs-theme.css`
- Modify: `src/app/docs/layout.tsx`
- Modify: `src/app/docs/[[...slug]]/page.tsx`
- Modify: `src/lib/layout.shared.tsx`
- Modify: `src/app/global.css`

**Interfaces:**
- Consumes: 页面 frontmatter、Markdown URL、GitHub URL。
- Produces: 紧凑文章头部、品牌化 Fumadocs 外壳、中文目录样式和响应式布局。

- [ ] **Step 1: 记录当前视觉基线**

使用现有文档审计截图作为变更前证据，并确认当前 `.docs-page-header` 仍为大阴影卡片。

- [ ] **Step 2: 实现 `DocsArticleHeader`**

显示分类路径、标题、说明、发布日期、难度、标签和紧凑页面操作；缺失可选元数据时不渲染空标签。

- [ ] **Step 3: 定制 Fumadocs 外壳**

文档布局使用独立 `docsOptions()`，移除文档区重复 CTA，增加侧栏 footer。使用 Fumadocs slots/公开 props，不复制内部组件源码。

- [ ] **Step 4: 建立文档主题样式**

映射 `--color-fd-*` 到品牌变量，实现浅色/深色、三栏比例、选中态、门户、文章排版、代码块、表格和移动端。删除旧 `.docs-page-header` 大卡片规则。

- [ ] **Step 5: 验证**

Run: `npm run lint && npm run types:check && npm run build`

Expected: 三项命令退出码均为 0。

- [ ] **Step 6: 提交**

```bash
git add src/components/docs/docs-article-header.tsx src/app/docs src/lib/layout.shared.tsx src/app/global.css
git commit -m "feat: redesign docs reading shell"
```

### Task 4: 新增真实教程并更新目录树

**Files:**
- Create: `content/docs/start-here/first-ai-task.mdx`
- Create: `content/docs/tools/chatgpt/workspace-guide.mdx`
- Create: `content/docs/tools/chatgpt/meta.json`
- Create: `content/docs/tools/codex/repository-workflow.mdx`
- Create: `content/docs/tools/codex/meta.json`
- Create: `content/docs/playbooks/research-to-brief.mdx`
- Create: `content/docs/playbooks/build-personal-knowledge-base.mdx`
- Create: `content/docs/notes/prompt-debugging-checklist.mdx`
- Create: `content/docs/reference/prompt-brief-template.mdx`
- Create: `content/docs/series/ai-workflow-foundations/index.mdx`
- Create: `content/docs/series/ai-workflow-foundations/meta.json`
- Modify: `content/docs/start-here/meta.json`
- Modify: `content/docs/start-here/index.mdx`
- Modify: `content/docs/tools/meta.json`
- Modify: `content/docs/tools/index.mdx`
- Modify: `content/docs/playbooks/meta.json`
- Modify: `content/docs/playbooks/index.mdx`
- Modify: `content/docs/notes/meta.json`
- Modify: `content/docs/notes/index.mdx`
- Modify: `content/docs/reference/meta.json`
- Modify: `content/docs/reference/index.mdx`
- Modify: `content/docs/series/meta.json`
- Modify: `content/docs/series/index.mdx`

**Interfaces:**
- Consumes: 站内链接约定和 frontmatter schema。
- Produces: 8 篇可阅读内容及可导航目录。

- [ ] **Step 1: 核验易变事实**

仅使用 OpenAI 官方文档核验 ChatGPT Projects 与 Codex 的当前能力；文章标注核验日期 `2026-07-15`，不写价格和未经验证的配额。

- [ ] **Step 2: 编写 8 篇文章**

每篇包含适合读者、前置条件、完成成果、有序步骤、验证结果和下一步阅读。系列入口链接到相关内容，不复制正文。

- [ ] **Step 3: 更新目录与分类索引**

`meta.json` 按学习顺序列出新文章。分类首页展示真实文章入口，并将未来主题放在明确的“规划中”文本列表。

- [ ] **Step 4: 验证 MDX 和链接**

Run: `npm run types:check && npm run build`

Expected: 所有新增路由进入静态生成列表，无 MDX、frontmatter 或链接错误。

- [ ] **Step 5: 提交**

```bash
git add content/docs
git commit -m "docs: add practical AI workflow tutorials"
```

### Task 5: 中文搜索与交互收尾

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/components/search.tsx`
- Modify: `src/app/api/search/route.ts`
- Modify: `src/components/docs/docs-portal-search.tsx`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Consumes: Fumadocs `SearchDialog` 与 Orama 静态索引。
- Produces: 中文搜索提示、可键盘操作的门户搜索入口、无结果提示和移动端交互状态。

- [ ] **Step 1: 确认当前失败场景**

构建当前索引后搜索新增中文标题，记录英文 tokenizer 的结果。

- [ ] **Step 2: 安装并配置普通话 tokenizer**

Run: `npm install @orama/tokenizers @orama/stopwords`

客户端和服务端共同使用 `@orama/tokenizers/mandarin` 的 `createTokenizer()` 与 `@orama/stopwords/mandarin`，替换当前硬编码的 `language: 'english'`。该方案来自 Orama 官方中文指南，并保持纯静态索引。

- [ ] **Step 3: 完成交互与无障碍状态**

检查搜索按钮、focus-visible、侧栏开关、主题切换、目录、hover/focus、`prefers-reduced-motion` 和移动端无横向滚动。

- [ ] **Step 4: 验证并提交**

Run: `npm run test && npm run lint && npm run types:check && npm run build`

```bash
git add package.json package-lock.json src/components/search.tsx src/app/api/search/route.ts src/components/docs/docs-portal-search.tsx src/app/docs/docs-theme.css
git commit -m "feat: improve Chinese docs discovery"
```

### Task 6: 设计 QA 与最终验证

**Files:**
- Modify: `design-qa.md`
- Modify: P0/P1/P2 修复涉及的文件

**Interfaces:**
- Consumes: 方案 2、方案 3、1440×1024 实现截图及移动/深色截图。
- Produces: `design-qa.md`，最终结果必须为 `passed`。

- [ ] **Step 1: 启动静态预览并捕获实现**

Run: `npm run build`，然后使用 `serve out` 在当前预览端口提供页面。捕获 `/docs/` 和一篇文章的 1440×1024、1280×800、390×844 浅色/深色状态。

- [ ] **Step 2: 组合参考图和实现图进行对比**

在同一比较输入中检查字体、间距、颜色、内容、图标和响应式；保存证据路径到 `design-qa.md`。

- [ ] **Step 3: 修复并复测 P0/P1/P2**

每轮记录旧问题、修复和新截图。只有不存在可操作 P0/P1/P2 时才能写 `final result: passed`。

- [ ] **Step 4: 完整验证**

Run: `npm run test && npm run lint && npm run types:check && npm run build`

检查：控制台无 error/warn、375/390/768/1280/1440 无横向溢出、主要链接返回 200、静态 HTML 不含虚构统计。

- [ ] **Step 5: 提交 QA 结果**

```bash
git add design-qa.md src content package.json package-lock.json source.config.ts
git commit -m "test: verify docs knowledge workbench"
```
