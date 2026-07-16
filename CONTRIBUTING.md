# 贡献指南

感谢你帮助完善 [AI 使用教程](https://90le.github.io/ai-tutorials/)。在线站点是读者入口，仓库用于追踪内容、讨论改进并发布新版本。

发现错误、希望补充主题或不确定内容放在哪里时，欢迎先提交 [Issue](https://github.com/90le/ai-tutorials/issues)。

## 内容贡献

1. 先阅读根目录 [AGENTS.md](AGENTS.md)，确认文章的唯一归属目录。
2. 新文章使用英文 kebab-case 文件名，并填写规定的 frontmatter。
3. 根据 [内容模型](docs/content-model.md) 选择文章类型；对产品能力、价格或政策等时效性内容，链接到一手来源并注明核验日期。
4. 不在教程中包含密钥、个人数据、受版权保护的大段内容或未经验证的高风险建议。

## 提交前检查

在项目根目录执行：

```bash
npm run check
```

请保持一次提交只解决一个清晰的问题。内容草稿可先放入 `content/drafts/`，确认后再移动到 `content/docs/`。
