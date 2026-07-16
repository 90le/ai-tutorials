# AI 知识与实践中心协作规则

## 产品定位

公开品牌名为“AI 使用教程”，产品描述为“AI 知识与实践中心”。内容可以覆盖模型、智能体、研究、AI 创作、开发和自动化，不限于工具入门。

## 工作范围

内容任务默认只创建或修改 `content/docs/`；草稿放在 `content/drafts/`，不会被站点构建和发布。页面、交互、性能、治理或发布任务可以按批准规格修改 `src/`、配置、`.codex/`、`docs/` 和依赖清单。

不要修改 `out/`、`.next/`、`.source/` 等生成目录。修改 `next.config.mjs`、`.github/`、依赖或发布流程前必须说明影响，并保持 GitHub Pages 静态导出兼容。

## 内容归属

- 工具学习：`content/docs/tools/<tool-slug>/`。
- 连续课程：`content/docs/series/<series-slug>/`，必须包含 `index.mdx`。
- 明确任务流程：`content/docs/playbooks/`。
- 单篇技巧、实验或短教程：`content/docs/notes/`。
- 可复用提示词、模板、术语和 FAQ：`content/docs/reference/`。

一篇文章只保留一个主文件位置；在其他文章或合集页面中使用链接引用，不复制正文。

## 每篇文章的 frontmatter

```md
---
title: 简洁、可搜索的标题
description: 一句话说明读者能获得什么
tags:
  - 工具或主题
published: YYYY-MM-DD
difficulty: 入门 # 可选：入门、进阶、专家
---
```

默认使用 GitHub Flavored Markdown；当页面表现力受益时，可自由使用 MDX、Fumadocs 组件和项目内 React 组件。这里不设组件白名单，也不把 MDX 限制为纯排版语言。

需要新组件时，优先在 `src/components/` 中实现为可复用、可组合的组件，并通过 `src/components/mdx.tsx` 注册或在页面中明确导入。不要把复杂逻辑、密钥、远程追踪脚本或不可审阅的第三方代码直接塞进文章正文。

所有页面必须兼容静态导出：运行时不得依赖私有服务、Cookie、登录态或服务器 API。需要实时数据、登录或在线 AI 问答时，先单独设计可部署的后端方案。

## Agent 工作流

任务级指南位于 `.codex/workflows/`。开始工作时按需要读取相应文件：

- 新文章：`new-tutorial.md`
- 页面结构、交互或视觉增强：`enhance-document-page.md`
- 位图封面、插图或图片编辑：`generate-visual-asset.md`
- 用 Dashi 探索演示叙事与视觉方向，或明确交付独立 deck：`explore-presentation-direction.md`
- 多来源研究并写作：`research-and-write-article.md`
- 审查和重构内容：`review-and-refactor-content.md`
- 阅读控件或富媒体组件：`enhance-reading-experience.md`
- 首页性能与动效：`performance-and-motion-audit.md`
- 验证、提交和发布：`release.md`

这些文件是项目内的可共享工作流，不是自动注册的 Codex Slash Command；它们补充本文件，不替代本文件。

## 写作标准

- 开头说明适合谁、前置条件和完成后的成果。
- 操作步骤使用有序列表；命令必须放进带语言标记的代码块。
- 说明模型、工具或价格等易变信息时，写明核验日期并链接到一手来源。
- 使用相对 Markdown 链接或以 `/docs/` 开头的站内链接；不要硬编码 GitHub Pages 域名。
- 图片放进 `public/images/<topic>/`，并写出有意义的替代文本。需要新的位图封面、插图、概念图或图片编辑时，使用 ImageGen；不要引用 Codex 临时生成目录。
- 优先延续现有 Fumadocs 设计语言和相邻页面的视觉模式。用户要求视觉探索、重设计或体验审查时，使用 Product Design 工作流；需要新体验时先做出可审阅的方向，再实现为站点组件。
- Dashi PPT 默认用于探索教程的叙事节奏、信息密度与视觉方向；将提炼出的规则实现为原生 Fumadocs/React 页面，不要复制 Dashi HTML/CSS，也不要用 iframe 把 deck 嵌入文档站。只有用户明确需要演示交付时，才把独立静态 HTML deck 发布到 `public/decks/<deck-slug>/` 并从文档页链接；PPTX/PDF 同样需要用户明确要求。

## 研究与来源

- 易变事实优先引用官方文档、论文或产品公告，并写明核验日期。
- 公众号、X、社区和热门文章可用于发现问题、案例与观点，不能替代关键事实的一手来源，也不能复刻其结构和独特表达。
- 图片必须记录来源与授权状态；无法确认时使用自制图、代码生成图或 ImageGen 素材。
- 真实数据必须说明来源、时间、单位和口径；示意或生成数据必须明确标注。

## UI、交互与性能门

- 先复用 `src/components/docs/` 和 `docs/component-catalog.md` 中的现有能力，不为单篇文章复制复杂交互。
- 所有控件必须支持键盘、可见焦点、移动触摸和 `prefers-reduced-motion`。
- 图片、视频、图表和公式必须有文字语义与静态降级；关键内容不得只在 hover、动画或 JavaScript 成功后出现。
- 重型库必须动态加载并在卸载时清理实例、监听器和帧循环；首页最多一个自动 WebGL 场景。

## 验证

每次内容、MDX 或组件修改后，在项目根目录执行：

```bash
npm run check
```

开发时可以先运行聚焦测试；交付前必须运行完整 `npm run check`。发布前检查 `git diff --check`、暂存范围和浏览器桌面/移动、浅色/深色、reduced-motion 状态。当前工作区有用户改动时只按显式路径暂存，禁止无范围地提交。
