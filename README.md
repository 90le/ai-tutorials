# AI 使用教程

面向中文读者的开源 AI 学习与实践知识库：从工具上手、工作流设计到可复用提示词，持续沉淀能够真正落地的教程。

**在线阅读：<https://90le.github.io/ai-tutorials/>**

内容由 Markdown/MDX 驱动，使用 Fumadocs 构建为静态 HTML，并通过 GitHub Pages 公开发布。

## 这里有什么

- AI 工具的入门、进阶与实战教程
- 有明确目标和步骤的真实任务工作流
- 按主题组织的连续课程与学习路径
- 可复用的提示词、模板、术语与常见问题
- 由 AI 协作产出、可在 Git 中审阅和持续改进的公开知识内容

## 内容结构

- `content/docs/start-here/`：新读者的学习路径。
- `content/docs/tools/`：按 AI 工具组织的教程。
- `content/docs/series/`：有明确顺序的课程合集。
- `content/docs/playbooks/`：按真实任务整理的工作流。
- `content/docs/notes/`：独立短教程、技巧和实验。
- `content/docs/reference/`：提示词、模板、术语与 FAQ。
- `content/drafts/`：未发布草稿，不参与站点构建。

为 AI 编写工具准备的内容规范在 [AGENTS.md](AGENTS.md)，按任务主动读取的 Codex 工作流在 [`.codex/workflows/`](.codex/workflows/)。Dashi 默认用于形成可审阅的视觉与叙事方向，最终以原生 Fumadocs 页面实现；只有明确需要演示成品时才发布独立 deck。

## 阅读与反馈

- 在线站点：[90le.github.io/ai-tutorials](https://90le.github.io/ai-tutorials/)
- 发现错误、希望补充主题或有改进建议，请通过 [Issues](https://github.com/90le/ai-tutorials/issues) 告诉我们。
- 希望直接改进内容，请阅读 [贡献指南](CONTRIBUTING.md)。

## 本地开发

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

构建静态站点：

```bash
npm run build
```

静态产物位于 `out/`。不要手动编辑该目录。

## 发布到 GitHub Pages

将仓库连接到 GitHub 后，在仓库 Settings → Pages 中把发布源设为 **GitHub Actions**。推送到 `main` 会触发 `.github/workflows/deploy-pages.yml`，构建并部署 `out/`。

对普通项目仓库，构建会自动使用 `/<repository>` 作为 GitHub Pages 路径前缀；对于 `<owner>.github.io` 仓库和自定义域名，不使用前缀。

使用自定义域名时，在仓库 Settings → Secrets and variables → Actions 中设置 `SITE_URL` 变量，例如 `https://ai.example.com`，以生成正确的分享和社交预览链接。

## 贡献

欢迎通过 Issue、讨论或 Pull Request 改进教程内容。提交前请阅读 [AGENTS.md](AGENTS.md)，并运行 `npm run lint`、`npm run types:check` 和 `npm run build`。

## 许可证

本项目采用 [MIT License](LICENSE)。
