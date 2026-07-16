# AI Knowledge Platform Complete Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 AI 使用教程升级为治理统一、首页稳定、阅读顺畅并支持完整富媒体内容的 AI 知识与实践平台。

**Architecture:** 以 `src/config/site.ts` 作为品牌与站点信息的单一来源；首页动效由可测试的偏好策略和单一运行时控制器管理；文档页通过共享阅读控制器与 `MediaFrame` 组件族增强。所有重型渲染器动态加载，所有交互都有静态导出、无 JavaScript、移动端和无障碍降级。

**Tech Stack:** Next.js 16、React 19、Fumadocs、TypeScript、Vitest、GSAP、Lenis、Three.js、Mermaid、ECharts、KaTeX/MathML、GitHub Pages 静态导出。

## Global Constraints

- 保留公开品牌名“AI 使用教程”，统一产品描述为“AI 知识与实践中心”。
- 不迁移现有公开文章 URL，不修改 `.next/`、`out/` 或 `.source/`。
- 每个行为变更必须先写失败测试并确认按预期失败，再写最小实现。
- 图片、图表、视频和公式必须有文字语义、来源/口径和静态降级。
- 首屏最多一个 WebGL 上下文；`auto`、`reduced`、`off` 三种动效模式必须独立可用。
- 当前工作区包含既有未提交改动；每次只按显式路径暂存，禁止 `git add .`。
- 每个批次运行相关 Vitest；最终运行 `npm run check` 和浏览器 QA。

---

### Task 1: 建立站点单一配置源

**Files:**
- Create: `src/config/site.ts`
- Create: `src/config/site.test.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/lib/shared.ts`
- Modify: `src/lib/site-content.ts`
- Modify: `src/lib/layout.shared.tsx`
- Modify: `src/components/author-contact-card.tsx`
- Modify: `src/app/(home)/page.tsx`

**Interfaces:**
- Produces: `siteConfig`, `SiteConfig`, `resolveSiteUrl()` and compatibility exports used by existing pages.
- Consumes: `GITHUB_REPOSITORY` and `NEXT_PUBLIC_SITE_URL` environment variables.

- [ ] **Step 1: Write the failing configuration test**

```ts
import { describe, expect, it } from 'vitest';
import { resolveSiteUrl, siteConfig } from './site';

describe('siteConfig', () => {
  it('keeps brand, author and primary navigation in one typed source', () => {
    expect(siteConfig.brand.name).toBe('AI 使用教程');
    expect(siteConfig.brand.descriptor).toBe('AI 知识与实践中心');
    expect(siteConfig.author.wechat).toBe('binStudy');
    expect(siteConfig.navigation.map((item) => item.href)).toContain('/docs/');
  });

  it('resolves project Pages and explicit site URLs', () => {
    expect(resolveSiteUrl({ githubRepository: '90le/ai-tutorials' }))
      .toBe('https://90le.github.io/ai-tutorials');
    expect(resolveSiteUrl({ explicitUrl: 'https://ai.example.com/' }))
      .toBe('https://ai.example.com');
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/config/site.test.ts`

Expected: FAIL because `src/config/site.ts` does not exist.

- [ ] **Step 3: Implement the typed config and compatibility exports**

Define `siteConfig` with `as const satisfies SiteConfig`; include brand, SEO, author contacts, repository, navigation and footer. Implement `resolveSiteUrl()` as a pure function, then make `src/lib/shared.ts` and `src/lib/site-content.ts` derive their existing exports from it so the migration is atomic.

- [ ] **Step 4: Replace duplicated metadata and navigation strings**

Make root metadata, Fumadocs navigation, homepage author/footer text and `AuthorContactCard` consume `siteConfig`. Keep visible copy unchanged except for the approved descriptor.

- [ ] **Step 5: Verify GREEN and commit only Task 1 files**

Run: `npm test -- src/config/site.test.ts src/lib/docs-navigation.test.ts`

Expected: PASS.

Commit: `feat: centralize site configuration`

---

### Task 2: 升级项目治理、内容模型和 Codex 路由

**Files:**
- Modify: `AGENTS.md`
- Modify: `.codex/README.md`
- Modify: `.codex/workflows/new-tutorial.md`
- Modify: `.codex/workflows/enhance-document-page.md`
- Create: `.codex/workflows/research-and-write-article.md`
- Create: `.codex/workflows/review-and-refactor-content.md`
- Create: `.codex/workflows/enhance-reading-experience.md`
- Create: `.codex/workflows/performance-and-motion-audit.md`
- Create: `.codex/workflows/release.md`
- Create: `.codex/templates/article-brief.md`
- Create: `.codex/templates/research-plan.md`
- Create: `.codex/templates/component-brief.md`
- Create: `.codex/templates/release-report.md`
- Create: `docs/content-model.md`
- Create: `docs/component-catalog.md`
- Move: `design-qa.md` to `docs/qa/archive/2026-07-15-design-qa.md`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: `package.json`

**Interfaces:**
- Produces: task routing table, five content types, component usage contract and dated release report format.
- Consumes: approved governance specification and existing four workflows.

- [ ] **Step 1: Write a failing governance structure test**

Create `src/lib/project-governance.test.ts` that reads the repository files and asserts the five content types, required workflow paths, template paths, `npm run check`, and absence of root `design-qa.md`.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/lib/project-governance.test.ts`

Expected: FAIL listing missing workflows/templates and missing `check` script.

- [ ] **Step 3: Implement the routing and templates**

Write each workflow with inputs, required sources, execution sequence, quality gates and exact deliverables. Ensure `new-tutorial.md` routes by `contentType` instead of forcing steps and a page-level acceptance checklist.

- [ ] **Step 4: Implement content and component documentation**

Document `tutorial`, `explainer`, `case-study`, `reference` and `experiment`; include frontmatter examples, source rules, visual evidence rules and anti-patterns. Catalogue every current MDX component plus the planned reading/media components.

- [ ] **Step 5: Add `npm run check` and archive stale QA**

Add `"check": "npm test && npm run lint && npm run types:check && npm run build"`. Move the stale QA file with `Move-Item -LiteralPath` after resolving both paths inside the workspace.

- [ ] **Step 6: Run GREEN and commit explicit paths**

Run: `npm test -- src/lib/project-governance.test.ts`

Expected: PASS.

Commit: `docs: establish project governance system`

---

### Task 3: 建立三档首页动效偏好

**Files:**
- Create: `src/lib/motion-preference.ts`
- Create: `src/lib/motion-preference.test.ts`
- Modify: `src/components/home-motion-controller.tsx`
- Modify: `src/app/global.css`

**Interfaces:**
- Produces: `MotionMode = 'auto' | 'reduced' | 'off'`, `resolveMotionLevel()` and versioned storage key `ai-tutorials:motion:v2`.
- Consumes: `prefers-reduced-motion`, coarse pointer, document visibility and stored user choice.

- [ ] **Step 1: Write failing pure policy tests**

Cover auto/full desktop, auto/reduced system preference, explicit reduced, explicit off and invalid stored values.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/lib/motion-preference.test.ts`

Expected: FAIL because the policy module is missing.

- [ ] **Step 3: Implement the pure policy**

Return a resolved level of `full`, `reduced` or `off` without accessing `window`, so behavior can be tested and reused by WebGL.

- [ ] **Step 4: Refactor `HomeMotionController`**

Remove static GSAP/Lenis imports. Dynamically import them only for `full`; do not enable Lenis on coarse pointers. Write `data-motion-mode` and `data-motion-level` to `<html>`, provide an accessible three-state control, and make all listeners/tickers idempotently disposable.

- [ ] **Step 5: Add stable CSS fallbacks**

Ensure content is visible before hydration. Under `reduced`, stop parallax and continuous decorative animation; under `off`, remove all non-essential transitions while keeping hover/focus feedback.

- [ ] **Step 6: Verify and commit**

Run: `npm test -- src/lib/motion-preference.test.ts`

Expected: PASS.

Commit: `feat: add resilient homepage motion modes`

---

### Task 4: 限制首页 WebGL 生命周期并清理无用引擎

**Files:**
- Create: `src/lib/render-budget.ts`
- Create: `src/lib/render-budget.test.ts`
- Modify: `src/components/kinetic-knowledge-scene.tsx`
- Delete after reference verification: `src/components/physics-knowledge-field.tsx`
- Delete after reference verification: `src/components/knowledge-map-chart.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `getRenderBudget()` with DPR, target FPS and particle count; WebGL scene listens to resolved motion level.
- Consumes: viewport width, device pixel ratio, coarse pointer, visibility and intersection state.

- [ ] **Step 1: Write failing render-budget tests**

Assert DPR is capped at 1.75 on desktop, 1.25 on coarse/mobile, reduced mode returns zero continuous FPS, and off returns no WebGL budget.

- [ ] **Step 2: Verify RED and implement the policy**

Run: `npm test -- src/lib/render-budget.test.ts`

Expected before implementation: FAIL. Expected after implementation: PASS.

- [ ] **Step 3: Refactor the Three.js scene**

Dynamically import Three.js after intersection and resolved full motion. Pause on hidden/offscreen; cap frame rate with elapsed-time checks; dispose geometries, materials, renderer, observers and listeners. Render one static frame for reduced mode and use the CSS fallback for off or WebGL failure.

- [ ] **Step 4: Remove confirmed unused engine code**

Run `rg -n "PhysicsKnowledgeField|KnowledgeMapChart|matter-js" src content`. Only when the two components have no consumer, delete them and uninstall `matter-js` plus `@types/matter-js` with `npm uninstall matter-js @types/matter-js`.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- src/lib/render-budget.test.ts src/lib/motion-preference.test.ts`

Run: `npm run types:check`

Expected: PASS with no Three/Matter type references.

Commit: `perf: bound homepage rendering lifecycle`

---

### Task 5: 添加阅读进度、返回顶部和知识树翻页

**Files:**
- Create: `src/lib/reading-progress.ts`
- Create: `src/lib/reading-progress.test.ts`
- Create: `src/components/docs/docs-reading-controls.tsx`
- Create: `src/components/docs/article-pager.tsx`
- Modify: `src/lib/docs-navigation.ts`
- Modify: `src/lib/docs-navigation.test.ts`
- Modify: `src/app/docs/[[...slug]]/page.tsx`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Produces: `calculateReadingProgress()`, `getArticleNeighbors(url)`, `DocsReadingControls` and `ArticlePager`.
- Consumes: article URL and the approved knowledge-tree order.

- [ ] **Step 1: Write failing progress and neighbor tests**

Test progress clamping at 0/1 and article neighbors at first, middle and last routes. Neighbor output is `{ previous?: KnowledgePage; next?: KnowledgePage }`.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/lib/reading-progress.test.ts src/lib/docs-navigation.test.ts`

Expected: FAIL for missing APIs.

- [ ] **Step 3: Implement pure helpers and server pager**

Use the same route registry as `buildKnowledgePageTree`; do not infer order from disk. Render group label, title and direction with real links.

- [ ] **Step 4: Implement client reading controls**

Use passive scroll plus `requestAnimationFrame` coalescing. Progress measures `.docs-page-content`; return-to-top appears after one viewport and calls native smooth scroll unless reduced motion is active.

- [ ] **Step 5: Integrate and style**

Render controls once per article and pager after `DocsBody`. Keep at most the TOC trigger and return-to-top fixed on mobile.

- [ ] **Step 6: Verify and commit**

Run: `npm test -- src/lib/reading-progress.test.ts src/lib/docs-navigation.test.ts`

Commit: `feat: add knowledge-aware reading navigation`

---

### Task 6: 添加图示查看器和代码块工具栏

**Files:**
- Create: `src/lib/viewer-state.ts`
- Create: `src/lib/viewer-state.test.ts`
- Create: `src/components/docs/diagram-viewer.tsx`
- Create: `src/components/docs/code-block-enhancer.tsx`
- Modify: `src/components/docs/mermaid-diagram.tsx`
- Modify: `src/components/docs/docs-reading-primitives.test.tsx`
- Modify: `src/app/docs/[[...slug]]/page.tsx`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Produces: zoom reducer with `zoomIn`, `zoomOut`, `reset`, `fit`; reusable modal shell; code wrap/expand state stored per code block in the DOM only.
- Consumes: Mermaid-rendered SVG and Fumadocs/Shiki `figure.shiki` markup.

- [ ] **Step 1: Write failing zoom and semantic markup tests**

Assert zoom clamps between 0.5 and 4, reset returns 1, `DiagramViewer` exposes labelled full-screen action, and code enhancer has a descriptive live region.

- [ ] **Step 2: Verify RED and implement pure state**

Run: `npm test -- src/lib/viewer-state.test.ts src/components/docs/docs-reading-primitives.test.tsx`

Expected before implementation: FAIL; after reducer and markup: PASS.

- [ ] **Step 3: Implement accessible modal behavior**

Use a native `<dialog>` where supported, focus the close button on open, close on Escape, restore trigger focus, and expose zoom controls with text labels/tooltips. Pan only when scale exceeds fit.

- [ ] **Step 4: Enhance Shiki blocks**

Add wrap and expand buttons after hydration without removing Fumadocs copy behavior. Re-running the enhancer must not duplicate controls. Under print/no JS, code remains fully readable.

- [ ] **Step 5: Verify and commit**

Run the two focused test files and `npm run types:check`.

Commit: `feat: add diagram and code reading tools`

---

### Task 7: 建立统一 MediaFrame 与图片灯箱

**Files:**
- Create: `src/components/docs/media-frame.tsx`
- Create: `src/components/docs/article-image.tsx`
- Create: `src/components/docs/image-gallery.tsx`
- Create: `src/components/docs/lightbox-viewer.tsx`
- Create: `src/components/docs/image-compare.tsx`
- Create: `src/components/docs/media-components.test.tsx`
- Modify: `src/components/mdx.tsx`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Produces: `MediaFrameProps`, `ArticleImageProps`, `GalleryImage`, `ImageCompareProps` and shared `LightboxViewer`.
- Consumes: static public image URLs, dimensions, alt, caption, source and optional provenance status.

- [ ] **Step 1: Write failing semantic component tests**

Render each component to static markup and assert figure/figcaption, dimensions, alt, source, lightbox button label, gallery position and keyboard-operable comparison range.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/components/docs/media-components.test.tsx`

Expected: FAIL because components do not exist.

- [ ] **Step 3: Implement `MediaFrame` and `ArticleImage`**

The frame owns title, description, source, status, width lane and toolbar slot. Image owns responsive `sizes`, intrinsic dimensions, lazy loading and the viewer trigger.

- [ ] **Step 4: Implement shared lightbox and gallery**

Reuse the Task 6 viewer reducer. Add fit/100%/zoom/pan, previous/next, thumbnail list, focus lock and background scroll lock. Do not auto-advance.

- [ ] **Step 5: Implement accessible comparison**

Use an input range with visible labels and independent “查看原图” actions. Keep both alt descriptions available without dragging.

- [ ] **Step 6: Verify and commit**

Run focused tests and `npm run types:check`.

Commit: `feat: add article image and lightbox system`

---

### Task 8: 添加视频、公式、数据表和下载附件

**Files:**
- Create: `src/components/docs/article-video.tsx`
- Create: `src/components/docs/formula-block.tsx`
- Create: `src/components/docs/data-table.tsx`
- Create: `src/components/docs/download-card.tsx`
- Modify: `src/components/docs/media-components.test.tsx`
- Modify: `src/components/mdx.tsx`
- Modify: `source.config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/docs/docs-theme.css`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: native video wrapper, formula semantic wrapper, progressively enhanced table and static attachment card.
- Consumes: video/poster/track URLs, LaTeX source, serializable row data and public attachment metadata.

- [ ] **Step 1: Write failing semantic tests**

Assert video has poster/title/transcript link and no autoplay; formula exposes copyable source and variable explanation; data table has caption/headers; download card has type/size/update metadata.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/components/docs/media-components.test.tsx`

Expected: FAIL for missing components.

- [ ] **Step 3: Install build-time math support**

Run: `npm install remark-math rehype-katex katex`

Register remark/rehype plugins in `source.config.ts` and import `katex/dist/katex.min.css` once from the root layout.

- [ ] **Step 4: Implement the four components**

Use native video controls and optional WebVTT tracks; use `MediaFrame` for shared context; keep table sorting client-side only when `sortable` is true; attachment URLs must remain static and public.

- [ ] **Step 5: Verify and commit**

Run focused tests, `npm run types:check` and a production build to verify MDX math output.

Commit: `feat: add rich technical media components`

---

### Task 9: 统一图表外壳、数据降级和按需加载

**Files:**
- Create: `src/components/docs/chart-frame.tsx`
- Create: `src/components/docs/chart-frame.test.tsx`
- Modify: `src/components/docs/source-mix-chart.tsx`
- Modify: `src/components/docs/mermaid-diagram.tsx`
- Modify: `src/components/mdx.tsx`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Produces: `ChartFrame` with insight title, source, caveat, data table, fullscreen and optional CSV/SVG/PNG actions.
- Consumes: truthful serializable data and a renderer child; existing ECharts remains dynamically imported.

- [ ] **Step 1: Write failing chart contract tests**

Assert title, source, caveat, visible key values, accessible data table, “示意数据” status and full-screen action are present without hover.

- [ ] **Step 2: Verify RED and implement the frame**

Run: `npm test -- src/components/docs/chart-frame.test.tsx`

Expected before implementation: FAIL; after frame: PASS.

- [ ] **Step 3: Migrate ECharts and Mermaid**

Initialize ECharts only after intersection, dispose on unmount, retain the existing visible values list, and render through `ChartFrame`. Let Mermaid share the viewer controls while preserving its source disclosure.

- [ ] **Step 4: Add export and fallback behavior**

CSV includes title/source/status rows; SVG/PNG actions appear only when the renderer exposes an exporter. No-JS markup keeps title, key values, data table and source.

- [ ] **Step 5: Verify and commit**

Run focused tests and `npm run types:check`.

Commit: `feat: standardize interactive data figures`

---

### Task 10: 增加内容模型字段、富媒体示范页和资产检查

**Files:**
- Modify: `source.config.ts`
- Modify: `src/lib/docs-content.ts`
- Modify: `src/lib/docs-content.test.ts`
- Create: `content/drafts/rich-media-system-preview.mdx`
- Create: `scripts/verify-content.mjs`
- Create: `scripts/verify-static-output.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: optional migration-safe `contentType`, draft-only rich-media fixture, deterministic content and static-output checks.
- Consumes: `content/docs`, `content/drafts`, `public` and `out`.

- [ ] **Step 1: Write failing schema and checker tests**

Extend current content tests to accept the five values and reject unknown values. Add script fixtures for missing image, missing alt metadata and missing output route.

- [ ] **Step 2: Verify RED and implement schema**

Run the focused test; confirm unknown type fails for the expected reason. Add optional `contentType` to the source schema and normalized page type.

- [ ] **Step 3: Build the draft preview**

Create one non-published MDX page exercising image, gallery, compare, video poster, Mermaid, ECharts, formula, wide table and attachment. Use existing public assets or purpose-built local fixtures with truthful labels; do not expose the draft through navigation.

- [ ] **Step 4: Implement deterministic checks**

`verify-content.mjs` checks referenced local assets and frontmatter values without imposing article structure. `verify-static-output.mjs` checks `out/index.html`, `out/docs/index.html` and one flagship article route after build.

- [ ] **Step 5: Wire scripts and commit**

Add `verify:content`, `verify:output`, and include them in `check` around build in the correct order.

Commit: `test: add content and static export quality gates`

---

### Task 11: 全量验证、浏览器 QA 与发布报告

**Files:**
- Create: `docs/qa/2026-07-16-platform-upgrade.md`
- Modify if defects are found: only the files that own the failing behavior.

**Interfaces:**
- Produces: dated QA report with commit, scope, commands, desktop/mobile/theme/motion results and known limitations.
- Consumes: local production preview and generated `out/`.

- [ ] **Step 1: Run the full automated gate**

Run: `npm run check`

Expected: all Vitest, ESLint, TypeScript/MDX and static build checks PASS with no unhandled warning.

- [ ] **Step 2: Start the static preview**

Run `npm run start -- --listen 3002` in a hidden background process and verify the terminal reports the local URL.

- [ ] **Step 3: Use the current in-app browser for QA**

Check homepage and a representative article at 1440px and 390px in light/dark. Check motion auto/reduced/off, background tab pause, keyboard-only navigation, TOC, back-to-top, code wrap/expand, image lightbox, chart fullscreen/data view, formula overflow and video fallback.

- [ ] **Step 4: Record and fix defects with TDD**

For every behavioral defect, add a focused failing regression test, verify RED, implement the minimal fix, verify GREEN, then rerun the affected browser state.

- [ ] **Step 5: Write the release report**

Record exact commit hash, commands, browser viewport/state, passed checks, fixed defects and remaining limitations. Do not write a permanent unscoped “passed” statement.

- [ ] **Step 6: Final verification and commit**

Run: `npm run check`

Run: `git diff --check`

Review: `git status --short` and `git diff --stat`.

Commit explicit QA/fix paths with: `test: verify platform upgrade`
