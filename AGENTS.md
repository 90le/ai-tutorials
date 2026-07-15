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

默认使用 GitHub Flavored Markdown。只有确实需要 Fumadocs 卡片、标签页或交互组件时才使用 MDX；不要在普通文章中嵌入 JavaScript、密钥或远程追踪脚本。

## 写作标准

- 开头说明适合谁、前置条件和完成后的成果。
- 操作步骤使用有序列表；命令必须放进带语言标记的代码块。
- 说明模型、工具或价格等易变信息时，写明核验日期并链接到一手来源。
- 使用相对 Markdown 链接或以 `/docs/` 开头的站内链接；不要硬编码 GitHub Pages 域名。
- 图片放进 `public/` 的主题目录，并写出有意义的替代文本。

## 验证

每次内容修改后，在项目根目录执行：

```bash
npm run build
```

构建失败时，先修正 Markdown、链接或 frontmatter，再继续处理其他内容。
