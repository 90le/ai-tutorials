# 自适应阅读、无限画布与原创组件实验室设计规格

## 目标

把文档页从固定宽度文章升级为可随左右侧栏状态重排的阅读系统；把 Mermaid、图表和图片的全屏预览统一为可拖动、光标缩放、触控和键盘可用的二维画布；把代码块工具栏改为 React 原生组件；扩充公开实验室，使其同时承担作者组件手册、AI 交互示例和视觉回归页。

## 已确认问题

1. `#nd-page` 固定 `max-width: 900px`，正文又固定为 `46rem`。侧栏收起只移动文章，没有把释放空间分配给 wide/full 内容。
2. `viewer-state.ts` 仅保存 `scale`；DiagramViewer 没有滚轮、指针或触控平移，`fit` 只是恢复 100%。CSS transform 与滚动几何不一致，造成全屏偏移和内容边缘不可达。
3. `CodeBlockEnhancer` 在 hydration 后扫描 DOM 并绝对定位两个按钮，与 Fumadocs 复制按钮争用标题栏空间。
4. 现有展厅覆盖很多语法和基础组件，但缺少能够解释 AI 系统状态的原创交互组件与可控动画。

## 设计原则

- 保留 Fumadocs 的导航、静态导出和 MDX 体系，不建设第二套文档应用。
- 正文行长保持稳定；只让代码、图表、媒体和工作台利用新增空间。
- 动画必须解释状态变化，不能只承担装饰。
- 所有关键结论均有文本、表格或静态视图回退。
- 重型库按需导入；每页最多一个活动 WebGL 上下文，离屏和后台暂停。
- 支持浅色、深色、键盘、触控、reduced-motion、打印和无 JavaScript 基础内容。

## 自适应阅读轨道

文档正文采用三层命名轨道：

- `prose`：最大 `46rem`，用于标题、正文、列表、提示和普通表格。
- `wide`：用于 Mermaid、图表、代码、图片、视频和复杂表格。
- `full`：用于 AI 工作台和需要最大可用空间的交互组件。

桌面建议上限：两侧展开 `60rem`；收起一侧 `68rem`；两侧收起 `76rem`。`#nd-docs-layout[data-sidebar-collapsed='true']` 必须真正把 `--fd-sidebar-width` 置零；右侧目录折叠时把 `--fd-toc-width` 置零。

## 二维画布

共享状态：

```ts
export interface CanvasTransform {
  scale: number;
  x: number;
  y: number;
  mode: 'fit' | 'manual';
}
```

画布支持：

- 鼠标拖动、Space + 拖动、触控平移。
- 滚轮以光标位置为中心缩放；触控双指缩放。
- `+/-` 缩放，方向键平移，`0` 适应窗口，`1` 恢复 100%。
- 初次打开和 ResizeObserver 尺寸变化时计算真实 fit transform。
- 全屏 dialog 固定 `inset: 0`，使用 `100vw × 100dvh`，不继承文章或侧栏偏移。
- 关闭后焦点返回触发按钮，状态通过 aria-live 播报。

## 代码块

使用 Fumadocs `CodeBlock`、`Pre` 和 `Actions` 实现 `DocsCodeBlock`，通过 `src/components/mdx.tsx` 覆盖 `pre`。工具栏包含文件/语言、换行、行号、展开和复制；移动端把次要操作收进紧凑菜单。删除页面级 `CodeBlockEnhancer` DOM 扫描。

## 实验室信息架构

保留 `complete-showcase.mdx` 作为基础渲染回归页，并新增：

1. `canvas-viewers.mdx`：画布、缩放、平移、键盘和触控。
2. `ai-workbench.mdx`：Agent Flow、Prompt Diff、Context Budget、Retrieval Explorer、Tool Call Trace、Multi-agent Orchestration。
3. `data-model-visuals.mdx`：Model Trade-off、Cost & Latency、Evidence Network、Semantic Space 3D。
4. `motion-states.mdx`：Streaming Timeline、加载/空/错误/断网/reduced-motion 状态。

第一轮实现十二个原创组件，但以少量共享引擎组合，避免十二套互不相干的运行时。

## 性能预算

- ECharts 和 Three.js 使用动态导入。
- WebGL 组件只在用户进入对应页面并接近视口后初始化。
- IntersectionObserver 离屏暂停；`visibilitychange` 后台暂停。
- reduced/off 模式关闭自动播放和非必要插值。
- 文档页不使用 Lenis 或滚动劫持。

## 验收

- 390、768、1280、1600、2048px 无页面级横向滚动。
- 三种侧栏组合均能重新分配文章和 wide/full 轨道。
- Mermaid、图表和图片全屏居中，可拖动、滚轮缩放、触控和键盘操作。
- 代码块在有/无标题、长行、代码页签和移动端均不重叠。
- 原创组件都有静态回退、加载/空/错误状态、深浅主题和 reduced-motion。
- `npm run check` 完整通过，浏览器控制台无错误。
