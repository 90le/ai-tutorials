# 增强文档页面

根据用户指定的教程或合集页面，提升信息层级、阅读体验与视觉表现。

1. 先读取根目录 `AGENTS.md`，并检查目标页面、相邻页面和 `src/components/` 中已有的 Fumadocs/MDX 组件。
2. 优先复用已有设计语言；若需求是重设计、体验审查或需要比较多个视觉方向，使用 Product Design 工作流完成可审阅的方向后再实现。
3. 可自由使用 MDX 和新增 React 组件。新组件必须通用、可访问、响应式，并放在 `src/components/`；不要把复杂实现复制到单篇 MDX 中。
4. 保持 GitHub Pages 静态导出兼容。不能假定有登录态、数据库、运行时私有 API 或服务端 AI。
5. 若需要插图，调用 ImageGen 生成真实位图素材并保存到 `public/images/<topic>/`，同时提供准确的替代文本。
6. 完成后运行 `npm run lint`、`npm run types:check` 和 `npm run build`，说明改动、视觉取舍与验证结果。
