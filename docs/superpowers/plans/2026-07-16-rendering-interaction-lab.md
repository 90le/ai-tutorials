# Rendering & Interaction Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复文档宽幅媒体在三栏布局中的安全边界，建立公开的“渲染与交互实验室”，并用一篇可操作的展厅文章覆盖站点全部文章渲染、富媒体和交互能力。

**Architecture:** 保留现有 `MediaFrame`、`DiagramViewer`、`ChartFrame` 和 MDX 注册架构，通过 CSS 分级出血解决布局根因；实验室作为 `reference` 下的二级知识分类。能力矩阵同时驱动文章内容与回归测试，所有图片、视频、字幕和下载文件都静态发布到 `public/`。

**Tech Stack:** Next.js 16、React 19、Fumadocs、MDX、Mermaid、ECharts、KaTeX、Vitest、ImageGen、静态视频渲染、GitHub Pages 静态导出。

## Global Constraints

- 公开路径固定为 `/docs/reference/experience-lab/` 与 `/docs/reference/experience-lab/complete-showcase/`。
- `3002` 必须关闭，`3010` 是唯一预览端口。
- 小于 `90rem` 的视口中 `wide/full` 必须回到正文宽度；打印模式始终为正文宽度。
- Mermaid、ECharts、灯箱与视频不得进入首页关键路径。
- 所有位图必须保存到 `public/images/experience-lab/`，视频保存到 `public/videos/experience-lab/`，下载资源保存到 `public/downloads/experience-lab/`。
- 视频不得自动播放，使用 `preload="none"`，MP4 目标不超过 3 MB，并提供海报、中文字幕和文字稿。
- 示例数据持续标注为“教学示意”或“生成内容”，不得伪装成真实行业统计。
- 所有生产代码改动遵循测试先行；最终必须通过 `npm run check` 和浏览器 QA。

---

### Task 1: 收敛唯一预览端口

**Files:**
- No repository file changes.

**Interfaces:**
- Consumes: 当前监听 `3002` 的 PID `37800` 与监听 `3010` 的 PID `23128`。
- Produces: 仅 `http://localhost:3010/` 可访问的单一静态预览服务。

- [ ] **Step 1: 重新确认端口归属**

Run:

```powershell
$ports=3002,3010
Get-NetTCPConnection -State Listen | Where-Object { $ports -contains $_.LocalPort }
```

Expected: 两个端口都由本仓库的 `serve out` 进程监听。

- [ ] **Step 2: 仅停止 3002 的仓库预览进程**

Run:

```powershell
$connection = Get-NetTCPConnection -LocalPort 3002 -State Listen
$process = Get-CimInstance Win32_Process -Filter "ProcessId=$($connection.OwningProcess)"
if ($process.CommandLine -notmatch 'ai-tutorials.+serve.+out') { throw 'Port 3002 is not the expected preview process.' }
Stop-Process -Id $connection.OwningProcess
```

Expected: 只终止本仓库在 `3002` 的静态服务。

- [ ] **Step 3: 验证单端口状态**

Run:

```powershell
Get-NetTCPConnection -State Listen | Where-Object { 3002,3010 -contains $_.LocalPort }
```

Expected: 只返回 `3010`。

---

### Task 2: 用回归测试锁定 Mermaid 安全宽度

**Files:**
- Modify: `src/components/docs/docs-responsive-css.test.ts`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Consumes: `MediaFrame` 的 `data-width="wide|full"`。
- Produces: `wide/full` 的分级出血规则；小于 `90rem` 时为 `100%`，大屏逐级扩宽。

- [ ] **Step 1: 写入失败测试**

在 `src/components/docs/docs-responsive-css.test.ts` 增加：

```ts
it('uses breakpoint based media bleed instead of viewport subtraction', () => {
  expect(docsTheme).not.toContain("max-width: calc(100vw - 34rem)");
  expect(docsTheme).not.toContain("max-width: calc(100vw - 20rem)");
  expect(docsTheme).toContain("@media (min-width: 90rem)");
  expect(docsTheme).toContain("@media (min-width: 112rem)");
  expect(docsTheme).toContain("max-inline-size: 100%");
});
```

- [ ] **Step 2: 验证测试因旧规则失败**

Run:

```bash
npm test -- src/components/docs/docs-responsive-css.test.ts
```

Expected: FAIL，明确命中旧的 `100vw` 减法或缺少新断点。

- [ ] **Step 3: 实现最小 CSS 修复**

将宽幅规则改为：

```css
.docs-media-frame[data-width='wide'],
.docs-media-frame[data-width='full'] {
  width: 100%;
  max-width: 100%;
  margin-left: 0;
  translate: none;
}

.docs-media-body,
.docs-mermaid-canvas { min-width: 0; }
.docs-mermaid-canvas svg { max-inline-size: 100%; }

@media (min-width: 90rem) {
  .docs-media-frame[data-width='wide'] {
    width: min(52rem, calc(100% + 4rem));
    max-width: none;
    margin-left: 50%;
    translate: -50% 0;
  }
  .docs-media-frame[data-width='full'] {
    width: min(56rem, calc(100% + 6rem));
    max-width: none;
    margin-left: 50%;
    translate: -50% 0;
  }
}

@media (min-width: 112rem) {
  .docs-media-frame[data-width='wide'] { width: min(62rem, calc(100% + 10rem)); }
  .docs-media-frame[data-width='full'] { width: min(68rem, calc(100% + 16rem)); }
}
```

保留现有 `@media (max-width: 72rem)` 与打印降级；清除重复或冲突规则。

- [ ] **Step 4: 验证聚焦测试**

Run:

```bash
npm test -- src/components/docs/docs-responsive-css.test.ts
```

Expected: PASS。

- [ ] **Step 5: 提交宽度修复**

```bash
git add src/components/docs/docs-responsive-css.test.ts src/app/docs/docs-theme.css
git commit -m "fix: keep wide media inside docs rails"
```

---

### Task 3: 注册完整 Fumadocs MDX 能力

**Files:**
- Create: `src/components/docs/mdx-registry.test.tsx`
- Modify: `src/components/mdx.tsx`

**Interfaces:**
- Consumes: `fumadocs-ui/components/steps`、`tabs`、`accordion`、`type-table`。
- Produces: MDX 全局组件 `Steps`、`Step`、`Tabs`、`Tab`、`Accordions`、`Accordion`、`TypeTable`。

- [ ] **Step 1: 写入失败测试**

```tsx
import { describe, expect, it } from 'vitest';
import { getMDXComponents } from '../mdx';

describe('MDX component registry', () => {
  it('registers the complete Fumadocs authoring set', () => {
    const components = getMDXComponents();
    for (const name of ['Steps', 'Step', 'Tabs', 'Tab', 'Accordions', 'Accordion', 'TypeTable']) {
      expect(components).toHaveProperty(name);
    }
  });
});
```

- [ ] **Step 2: 验证注册缺失**

Run:

```bash
npm test -- src/components/docs/mdx-registry.test.tsx
```

Expected: FAIL，至少缺少 `Steps`。

- [ ] **Step 3: 注册依赖现有组件**

在 `src/components/mdx.tsx` 中直接导入并注册：

```ts
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Accordions, Accordion } from 'fumadocs-ui/components/accordion';
import { TypeTable } from 'fumadocs-ui/components/type-table';
```

不要创建重复包装组件。

- [ ] **Step 4: 验证测试与类型**

Run:

```bash
npm test -- src/components/docs/mdx-registry.test.tsx
npm run types:check
```

Expected: PASS。

- [ ] **Step 5: 提交注册能力**

```bash
git add src/components/mdx.tsx src/components/docs/mdx-registry.test.tsx
git commit -m "feat: register complete mdx authoring set"
```

---

### Task 4: 建立能力矩阵、分类结构与覆盖测试

**Files:**
- Create: `docs/rendering-capability-matrix.md`
- Create: `src/lib/experience-lab.test.ts`
- Modify: `content/docs/reference/meta.json`
- Create: `content/docs/reference/experience-lab/meta.json`
- Create: `content/docs/reference/experience-lab/index.mdx`
- Create: `content/docs/reference/experience-lab/complete-showcase.mdx`

**Interfaces:**
- Consumes: 设计规格中的能力清单。
- Produces: 可公开导航的分类骨架与一个由测试约束的展厅页面。

- [ ] **Step 1: 写入失败的分类与覆盖测试**

`src/lib/experience-lab.test.ts` 读取仓库文件并断言：

```ts
const requiredMarkers = [
  '<Callout', '<Cards>', '<Steps>', '<Tabs', '<Accordions>', '<TypeTable',
  '<PromptCard', '<KeyTakeaways', '<ScenarioTabs', '<SourcesDisclosure',
  '<MermaidDiagram', '<SourceMixChart', '<FormulaBlock', '<DataTable',
  '<DownloadCard', '<ArticleImage', '<ImageGallery', '<ImageCompare', '<ArticleVideo',
];

for (const marker of requiredMarkers) expect(showcase).toContain(marker);
expect(referenceMeta.pages).toContain('experience-lab');
```

同时断言 frontmatter：

```ts
expect(showcase).toContain('contentType: reference');
expect(showcase).toContain('published: 2026-07-16');
```

- [ ] **Step 2: 验证文件尚不存在**

Run:

```bash
npm test -- src/lib/experience-lab.test.ts
```

Expected: FAIL，原因是实验室页面或标记缺失。

- [ ] **Step 3: 写入能力矩阵**

将设计规格中的 Markdown、Fumadocs、自定义内容组件、富媒体和页面级能力整理到 `docs/rendering-capability-matrix.md`，每行包含：

```text
能力 | 组件/语法 | 展示章节 | 交互 | 无 JS 回退 | 自动测试 | 浏览器 QA
```

不使用“待定”状态；所有行初始标为“计划覆盖”，完成时改为“已验证”。

- [ ] **Step 4: 创建分类元数据和分类首页**

`content/docs/reference/experience-lab/meta.json`：

```json
{
  "title": "渲染与交互实验室",
  "pages": ["index", "complete-showcase"]
}
```

在 `reference/meta.json` 中加入 `experience-lab`。分类首页使用 `reference` frontmatter，并用 Cards 解释展厅、能力矩阵和使用边界。

- [ ] **Step 5: 创建能编译的展厅骨架**

先建立完整章节和所有组件标记；图片与视频组件直接使用规格中确定的最终 `/images/experience-lab/` 与 `/videos/experience-lab/` 路径。此阶段只运行结构测试，资源存在性测试保持失败，直到 Task 6 和 Task 7 写入对应文件。

- [ ] **Step 6: 验证结构测试达到预期阶段**

Run:

```bash
npm test -- src/lib/experience-lab.test.ts
```

Expected: 分类与标记断言 PASS；资源存在性断言仍由 Task 6 的测试负责。

- [ ] **Step 7: 提交信息架构**

```bash
git add docs/rendering-capability-matrix.md content/docs/reference src/lib/experience-lab.test.ts
git commit -m "docs: add rendering interaction lab"
```

---

### Task 5: 创建展厅数据、类型与下载资源

**Files:**
- Create: `src/components/docs/experience-lab/showcase-data.ts`
- Create: `src/components/docs/experience-lab/showcase-types.ts`
- Create: `src/components/docs/experience-lab/showcase-data.test.ts`
- Create: `public/downloads/experience-lab/evidence-matrix.csv`
- Create: `public/downloads/experience-lab/task-contract.json`
- Modify: `content/docs/reference/experience-lab/complete-showcase.mdx`

**Interfaces:**
- Produces: `showcaseColumns`、`showcaseRows`、`showcaseScenarios`、`showcaseType` 与两个静态下载文件。

- [ ] **Step 1: 写入失败的数据一致性测试**

测试要求：

```ts
expect(showcaseRows).toHaveLength(6);
expect(showcaseRows.every((row) => row.claim && row.evidence && row.status)).toBe(true);
expect(showcaseScenarios.map((item) => item.label)).toEqual(['原始材料', '证据卡', '交付稿']);
```

并读取 CSV/JSON，断言它们与页面数据共享相同的标题和字段。

- [ ] **Step 2: 验证测试因模块缺失失败**

Run:

```bash
npm test -- src/components/docs/experience-lab/showcase-data.test.ts
```

Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现可序列化数据与 TypeTable 描述**

`showcase-types.ts` 导出符合 TypeTable 输入的对象：

```ts
export const taskContractType = {
  goal: { description: '最终要交付的结果', type: 'string', required: true },
  audience: { description: '结果的实际使用者', type: 'string', required: true },
  evidence: { description: '允许引用的事实边界', type: 'string[]', required: true },
  constraints: { description: '不可执行或不可推断的事项', type: 'string[]', required: false },
};
```

- [ ] **Step 4: 写入本地 CSV 与 JSON**

CSV 使用 UTF-8 BOM，JSON 使用两个空格缩进；内容与 `showcase-data.ts` 一致。

- [ ] **Step 5: 将数据接入 MDX**

在展厅中导入数据与类型，用于 ScenarioTabs、DataTable、TypeTable 与 DownloadCard；避免在 MDX 内重复大数组。

- [ ] **Step 6: 验证测试**

Run:

```bash
npm test -- src/components/docs/experience-lab/showcase-data.test.ts
npm run types:check
```

Expected: PASS。

- [ ] **Step 7: 提交数据与下载资源**

```bash
git add src/components/docs/experience-lab public/downloads/experience-lab content/docs/reference/experience-lab/complete-showcase.mdx
git commit -m "feat: add experience lab reference data"
```

---

### Task 6: 生成并接入统一图片素材

**Files:**
- Create: `public/images/experience-lab/knowledge-signal.jpg`
- Create: `public/images/experience-lab/collect.jpg`
- Create: `public/images/experience-lab/judge.jpg`
- Create: `public/images/experience-lab/deliver.jpg`
- Create: `public/images/experience-lab/raw-materials.jpg`
- Create: `public/images/experience-lab/evidence-map.jpg`
- Modify: `content/docs/reference/experience-lab/complete-showcase.mdx`
- Modify: `src/lib/experience-lab.test.ts`

**Interfaces:**
- Consumes: ImageGen 输出。
- Produces: 六张 16:9、统一视觉语言、带明确替代文本的本地图片。

- [ ] **Step 1: 先增加失败的资源测试**

```ts
const imageFiles = [
  'knowledge-signal.jpg', 'collect.jpg', 'judge.jpg',
  'deliver.jpg', 'raw-materials.jpg', 'evidence-map.jpg',
];
for (const file of imageFiles) {
  expect(existsSync(join(root, 'public/images/experience-lab', file))).toBe(true);
}
```

- [ ] **Step 2: 验证图片缺失**

Run:

```bash
npm test -- src/lib/experience-lab.test.ts
```

Expected: FAIL，列出缺失图片。

- [ ] **Step 3: 使用 ImageGen 生成素材**

统一艺术方向：暖白纸张质感、深墨色结构、紫色主信号、珊瑚与酸橙辅助、编辑设计感、真实空间与光影、无可读文字、无界面截图、无通用蓝紫机器人。

生成：主视觉、采集、判断、交付、零散材料、证据地图六张图片；检查构图后保存到目标目录。裁切为 1600 × 900 或保持等比例 16:9。

- [ ] **Step 4: 接入单图、图库和前后对比**

`ArticleImage` 使用 `knowledge-signal.jpg`；`ImageGallery` 使用 collect/judge/deliver；`ImageCompare` 使用 raw-materials/evidence-map。所有图片提供具体 alt、宽高、caption、source 和 `status="generated"`。

- [ ] **Step 5: 验证资源与内容**

Run:

```bash
npm test -- src/lib/experience-lab.test.ts
npm run verify:content
```

Expected: PASS。

- [ ] **Step 6: 提交图片素材**

```bash
git add public/images/experience-lab content/docs/reference/experience-lab/complete-showcase.mdx src/lib/experience-lab.test.ts
git commit -m "feat: add experience lab visual assets"
```

---

### Task 7: 制作本地视频、字幕和文字稿

**Files:**
- Create: `public/videos/experience-lab/knowledge-flow.mp4`
- Create: `public/videos/experience-lab/knowledge-flow-poster.jpg`
- Create: `public/videos/experience-lab/knowledge-flow.zh-CN.vtt`
- Create: `public/downloads/experience-lab/knowledge-flow-transcript.md`
- Modify: `content/docs/reference/experience-lab/complete-showcase.mdx`
- Modify: `src/lib/experience-lab.test.ts`

**Interfaces:**
- Consumes: Task 6 的 collect/judge/deliver 图片。
- Produces: 小于 3 MB 的 1280 × 720 H.264 MP4，以及同步字幕和文字稿。

- [ ] **Step 1: 增加失败的视频资源测试**

```ts
for (const file of ['knowledge-flow.mp4', 'knowledge-flow-poster.jpg', 'knowledge-flow.zh-CN.vtt']) {
  expect(existsSync(join(root, 'public/videos/experience-lab', file))).toBe(true);
}
expect(statSync(videoPath).size).toBeLessThan(3 * 1024 * 1024);
expect(readFileSync(vttPath, 'utf8')).toMatch(/^WEBVTT/);
```

- [ ] **Step 2: 验证资源缺失**

Run:

```bash
npm test -- src/lib/experience-lab.test.ts
```

Expected: FAIL，视频、海报、VTT 或文字稿不存在。

- [ ] **Step 3: 制作 8–12 秒静态视频**

使用 HyperFrames 的离线渲染流程，把三张图片编排为“采集 → 判断 → 交付”的轻量镜头运动；输出 1280 × 720 H.264 MP4。视频不得包含需要额外网络加载的字体、音频或远程素材，不自动播放。

- [ ] **Step 4: 写入字幕与文字稿**

VTT 时间轴：

```vtt
WEBVTT

00:00.000 --> 00:03.500
采集：保留材料来源与上下文。

00:03.500 --> 00:07.000
判断：区分事实、推断与待确认信息。

00:07.000 --> 00:10.500
交付：让结果带着证据进入真实工作系统。
```

文字稿包含同样三段内容和“生成内容”说明。

- [ ] **Step 5: 接入 ArticleVideo**

```mdx
<ArticleVideo
  title="从知识信号到可复核交付"
  description="10 秒演示采集、判断与交付三个阶段"
  src="/videos/experience-lab/knowledge-flow.mp4"
  poster="/videos/experience-lab/knowledge-flow-poster.jpg"
  tracks={[{ src: '/videos/experience-lab/knowledge-flow.zh-CN.vtt', srcLang: 'zh-CN', label: '简体中文', default: true }]}
  transcriptHref="/downloads/experience-lab/knowledge-flow-transcript.md"
  source={{ label: '本站生成素材 · 2026-07-16' }}
  status="generated"
/>
```

- [ ] **Step 6: 验证视频资源**

Run:

```bash
npm test -- src/lib/experience-lab.test.ts
npm run verify:content
```

Expected: PASS。

- [ ] **Step 7: 提交视频交付**

```bash
git add public/videos/experience-lab public/downloads/experience-lab content/docs/reference/experience-lab/complete-showcase.mdx src/lib/experience-lab.test.ts
git commit -m "feat: add accessible experience lab video"
```

---

### Task 8: 完成展厅内容、样式与组件文档

**Files:**
- Modify: `content/docs/reference/experience-lab/complete-showcase.mdx`
- Modify: `content/docs/reference/experience-lab/index.mdx`
- Modify: `docs/rendering-capability-matrix.md`
- Modify: `docs/component-catalog.md`
- Modify: `src/app/docs/docs-theme.css`
- Modify: `src/lib/experience-lab.test.ts`

**Interfaces:**
- Consumes: Task 3–7 的组件、数据和资源。
- Produces: 所有能力真实可操作、内容连续、移动端和打印可读的完整展厅。

- [ ] **Step 1: 扩展失败测试覆盖文章语义**

断言展厅包含：

```ts
expect(showcase).toContain('## 基础文章语言');
expect(showcase).toContain('## 结构化说明');
expect(showcase).toContain('## 图示与数据');
expect(showcase).toContain('## 图片与视觉证据');
expect(showcase).toContain('## 视频与替代内容');
expect(showcase).toContain('## 降级与验收');
```

同时要求每个自定义组件只用于有意义的内容，不出现 `lorem`、`placeholder` 或无来源数字。

- [ ] **Step 2: 验证不完整内容失败**

Run:

```bash
npm test -- src/lib/experience-lab.test.ts
```

Expected: FAIL，列出缺失章节或标记。

- [ ] **Step 3: 写完整 reference 文章**

按设计规格九个章节完成正文。每个示例前说明用途，示例后提供一行“检查什么”；避免把每段文字都卡片化。

- [ ] **Step 4: 完善展厅专项样式**

只新增必要类：

```css
.docs-experience-checklist { ... }
.docs-experience-status { ... }
.docs-experience-swatch { ... }
```

这些类用于能力索引与状态说明，不复制现有 MediaFrame、Callout 或 Card 样式。打印时隐藏纯交互说明，保留内容与结果。

- [ ] **Step 5: 更新组件目录和能力矩阵状态**

`docs/component-catalog.md` 增加 Fumadocs 注册组件和实验室链接；能力矩阵中的实现项改为“已验证”，并写明对应自动测试与浏览器检查。

- [ ] **Step 6: 验证内容、MDX 和静态构建**

Run:

```bash
npm test -- src/lib/experience-lab.test.ts
npm run verify:content
npm run types:check
npm run build
```

Expected: 全部 PASS，展厅路由出现在静态页面列表中。

- [ ] **Step 7: 提交完整展厅**

```bash
git add content/docs/reference/experience-lab docs/rendering-capability-matrix.md docs/component-catalog.md src/app/docs/docs-theme.css src/lib/experience-lab.test.ts
git commit -m "docs: complete rendering capability showcase"
```

---

### Task 9: 浏览器 QA、发布报告与最终质量门

**Files:**
- Create: `docs/qa/2026-07-16-experience-lab.md`
- Modify: `docs/rendering-capability-matrix.md`

**Interfaces:**
- Consumes: `http://localhost:3010/` 静态导出。
- Produces: 可复现的桌面/移动、主题、交互、控制台与边界验收记录。

- [ ] **Step 1: 运行完整质量门**

Run:

```bash
npm run check
```

Expected: 内容校验、全部 Vitest、lint、类型检查、静态构建和产物校验全部 PASS。

- [ ] **Step 2: 确认 3010 服务读取最新 out**

如果 `3010` 未监听，运行：

```bash
npm run start -- --listen 3010
```

先验证端口空闲；不得启动第二个服务。

- [ ] **Step 3: 验证 Mermaid 安全边界**

在 `1280`、`1365`、`1440`、`1638`、`2048` 视口测量：

```text
media.left >= sidebar.right + 24
media.right <= toc.left - 24
scrollWidth <= clientWidth
```

分别检查右侧目录展开和折叠。

- [ ] **Step 4: 验证完整展厅桌面状态**

检查浅色、深色、Tabs、Accordion、代码复制/换行/展开、Mermaid 全屏/缩放、ECharts 场景/数据/下载、图片灯箱、图库切换、对比滑块、视频字幕、DataTable 全屏、阅读进度、返回顶部和上下篇。

- [ ] **Step 5: 验证移动端与可访问性**

在 `390 × 844` 检查无横向溢出、知识树路径、章节目录、全屏弹层、表格局部滚动、视频宽度和下载卡片。用键盘完成 Tabs、Accordion、灯箱、范围滑块和关闭弹层路径。

- [ ] **Step 6: 检查控制台与资源**

首页、原 Mermaid 教程、实验室首页、完整展厅的 console error/warning 必须为空；所有图片 `naturalWidth > 0`，视频 metadata 可加载，站内跳转不产生 RSC 404。

- [ ] **Step 7: 写发布报告并更新矩阵**

报告记录提交范围、测试数量、构建页面数、视口测量、交互结果、控制台结果和已知限制。能力矩阵只有通过自动测试与对应 QA 后才能标为“已验证”。

- [ ] **Step 8: 最终复验并提交**

Run:

```bash
npm run check
git diff --check
git status --short
```

Expected: `npm run check` PASS，`git diff --check` 无输出，只有 QA 报告与矩阵更新待提交。

```bash
git add docs/qa/2026-07-16-experience-lab.md docs/rendering-capability-matrix.md
git commit -m "test: verify rendering interaction lab"
```
