# Codex 项目配置

本目录保存可复用的 Codex 项目指引和任务提示，不保存令牌、环境变量、缓存或自动生成内容。

- 全局内容规则以根目录 `AGENTS.md` 为准。
- `prompts/` 中的提示词用于创建教程、增强页面、生成视觉素材和制作配套演示。
- 对站点结构或部署配置的修改必须先说明影响，再执行完整验证。

## 能力选择

| 目标 | 适合的能力 | 项目产物 |
| --- | --- | --- |
| 教程正文、导航与知识结构 | Fumadocs + Markdown/MDX | `content/docs/` |
| 页面布局、交互、视觉重设计或体验审查 | Product Design | 可复用的 `src/components/` 与 MDX 页面 |
| 位图封面、插图、概念图、图片编辑 | ImageGen | `public/images/<topic>/` |
| 长教程的配套演示 | Dashi PPT | `public/decks/<deck-slug>/` |

默认先复用已有视觉和组件；需要新能力时可自由扩展 MDX 与 React 组件，但必须保持静态导出兼容。每次发布前运行 `npm run lint`、`npm run types:check` 和 `npm run build`。
