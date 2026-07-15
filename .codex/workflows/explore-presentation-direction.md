# 用 Dashi 探索演示方向

用 Dashi 探索一篇教程的叙事节奏、信息密度和视觉方向；Fumadocs 文档页仍是主内容，最终效果应以原生 React/MDX 组件实现。

1. 先读取 `AGENTS.md`、目标教程和相邻页面，提炼听众、目标、核心结论与需要表达的数据。没有明确授权时，询问用户希望参考的演示风格以及是否需要图片/视频；用户明确“都你来定”时再自行选择。
2. 使用 Dashi PPT 的 JSON 计划与校验工作流生成本地参考 deck。每页只承载一个主要信息，不复用模板默认文案，也不手写自由 HTML slide。
3. 从参考 deck 提炼可迁移的视觉规则：章节节奏、字体层级、色彩方向、卡片形态、留白和数据展示方式。通过 Product Design 与 `src/components/` 将这些规则实现为原生 Fumadocs 页面；不要复制 Dashi HTML/CSS，也不要在文档中嵌入 iframe。
4. 仅当用户明确需要可演示的成品时，才将独立 HTML deck 及其素材发布到 `public/decks/<deck-slug>/`，并在文档页添加链接。除非用户明确要求，不生成或提交 PPTX/PDF。
5. 如需原创位图插图，使用 ImageGen 生成并按 Dashi 的媒体暂存规则写入参考或交付 deck。
6. 运行 Dashi 要求的 deck 校验；凡是落入站点的页面改动，再运行 `npm run lint`、`npm run types:check` 和 `npm run build`。报告设计提炼结果、主题选择和验证结果。
