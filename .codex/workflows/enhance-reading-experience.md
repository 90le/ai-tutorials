# 增强阅读体验

1. 读取目标文章、`docs/component-catalog.md`、相邻页面和现有 `src/components/docs/`。
2. 填写 `templates/component-brief.md`，明确读者问题、必要状态、移动端、键盘、静态降级和性能预算。
3. 先写失败测试；再实现最小可复用组件，并通过 `src/components/mdx.tsx` 注册或显式导入。
4. 图片、视频、图表、公式、表格和附件使用统一富媒体语义；关键内容不依赖 hover 或全屏。
5. 验证桌面/移动、浅色/深色、键盘、reduced-motion、打印与无 JavaScript 降级。
6. 运行聚焦测试和 `npm run check`，记录视觉与性能取舍。
