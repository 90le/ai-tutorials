# 发布报告

- 日期：2026-07-16
- 分支与提交：`codex/platform-complete-upgrade` @ `6d047ea`
- 发布范围：新增顶级“官方指南”知识树、15 个专题页、8 个通用 MDX 组件；分发 12 个 AI 交互案例；修复 ECharts 全屏渲染；迁移旧实验室路由。
- 生产 URL：https://90le.github.io/ai-tutorials/

## 自动验证

| 命令 | 结果 | 备注 |
| --- | --- | --- |
| `npm run check` | 通过 | 内容验证、23 个测试文件/88 项测试、lint、类型、Next.js 构建和静态输出全部通过 |
| `git diff --check` | 通过 | 无空白错误 |

## 浏览器 QA

| 页面 | 视口 | 主题/动效 | 结果 | 证据 |
| --- | --- | --- | --- | --- |
| `/docs/help/` | 1265px | 深色、浅色 | 通过 | 顶级知识树可见；主题切换生效；横向溢出 0；控制台干净 |
| `/docs/help/design-quality/component-selection-guide/` | 1265px | 深色 | 通过 | 选择器状态、输出与焦点正确 |
| `/docs/help/visual-media/mermaid-infinite-canvas/` | 390 × 844 | 移动、默认动效 | 通过 | 页面与画布无溢出；图形居中；缩放和关闭有效 |
| `/docs/help/visual-media/data-charts-visualization/` | 1265px | 深色 | 通过 | 页面内与全屏 ECharts 均正常显示；SVG 未被图标 CSS 压缩 |
| `/docs/help/` | 1265px | reduced-motion | 通过 | 偏好命中，非必要过渡为 0s |

## 已知限制与后续

- 移动 QA 使用 Chromium 390 × 844 设备模拟；后续可补充真机 iOS Safari 抽查。
- 推送后以 GitHub Actions Pages 工作流成功和生产 URL 返回 200 作为最终发布完成条件。
