# AI 教程知识库写作规则

## 工作范围

默认只创建或修改 `content/docs/` 中的公开教程。草稿放在 `content/drafts/`，不会被站点构建和发布。

除非任务明确要求，不要修改 `src/`、`next.config.mjs`、`source.config.ts`、`.github/` 或依赖清单；不要修改 `out/`、`.next/`、`.source/` 等生成目录。

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

## 写作标准

- 开头说明适合谁、前置条件和完成后的成果。
- 操作步骤使用有序列表；命令必须放进带语言标记的代码块。
- 说明模型、工具或价格等易变信息时，写明核验日期并链接到一手来源。
- 使用相对 Markdown 链接或以 `/docs/` 开头的站内链接；不要硬编码 GitHub Pages 域名。
- 图片放进 `public/images/<topic>/`，并写出有意义的替代文本。需要新的位图封面、插图、概念图或图片编辑时，使用 ImageGen；不要引用 Codex 临时生成目录。
- 优先延续现有 Fumadocs 设计语言和相邻页面的视觉模式。用户要求视觉探索、重设计或体验审查时，使用 Product Design 工作流；需要新体验时先做出可审阅的方向，再实现为站点组件。
- Dashi PPT 用于长教程的配套演示，而不是替代文档站。发布的静态 HTML deck 放在 `public/decks/<deck-slug>/`，并从对应文档页链接；只有用户明确要求时才同时保存或交付 PPTX/PDF。

## 验证

每次内容、MDX 或组件修改后，在项目根目录执行：

```bash
npm run lint
npm run types:check
npm run build
```

构建失败时，先修正 Markdown、MDX、链接、frontmatter 或组件问题，再继续处理其他内容。发布前检查 Git diff；提交和推送使用已连接的 GitHub 工作流。
