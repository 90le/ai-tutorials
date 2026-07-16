# Codex 任务路由

本目录保存可复用的 Codex 项目指引和任务工作流，不保存令牌、环境变量、缓存或自动生成内容。

- 全局内容规则以根目录 `AGENTS.md` 为准。
- `workflows/` 中的 Markdown 是需要按任务主动读取的共享指南，不是自动注册的 Codex 命令。
- 对站点结构或部署配置的修改必须先说明影响，再执行完整验证。

## 先选择任务

| 当前任务 | 必读工作流 | 建议模板 |
| --- | --- | --- |
| 新建普通教程 | `workflows/new-tutorial.md` | `templates/article-brief.md` |
| 多来源研究与旗舰文章 | `workflows/research-and-write-article.md` | `templates/research-plan.md`、`templates/article-brief.md` |
| 删除、合并或重构旧内容 | `workflows/review-and-refactor-content.md` | `templates/article-brief.md` |
| 页面结构、MDX 或视觉增强 | `workflows/enhance-document-page.md` | `templates/component-brief.md` |
| 阅读控件与富媒体 | `workflows/enhance-reading-experience.md` | `templates/component-brief.md` |
| 首页动效与性能问题 | `workflows/performance-and-motion-audit.md` | `templates/component-brief.md` |
| 位图生成或图片编辑 | `workflows/generate-visual-asset.md` | `templates/component-brief.md` |
| Dashi 叙事探索 | `workflows/explore-presentation-direction.md` | `templates/article-brief.md` |
| 验证、提交、推送与部署 | `workflows/release.md` | `templates/release-report.md` |

内部写作与执行提示词保存在 `templates/`；提供给读者复用的公开提示词保存在 `content/docs/reference/`，不要混用。

## 能力选择

| 目标 | 适合的能力 | 项目产物 |
| --- | --- | --- |
| 教程正文、导航与知识结构 | Fumadocs + Markdown/MDX | `content/docs/` |
| 页面布局、交互、视觉重设计或体验审查 | Product Design | 可复用的 `src/components/` 与 MDX 页面 |
| 位图封面、插图、概念图、图片编辑 | ImageGen | `public/images/<topic>/` |
| 演示叙事与视觉方向 | Dashi PPT | 本地参考；提炼后实现为原生页面 |
| 用户明确要求交付的演示 | Dashi PPT | `public/decks/<deck-slug>/` |

默认先复用已有视觉和组件；需要新能力时可扩展 MDX 与 React 组件，但必须保持静态导出兼容。Dashi 不是文档页嵌入器：默认用它形成可审阅的视觉方向，再通过 Product Design 和原生组件落地。每次发布前运行 `npm run check`。
