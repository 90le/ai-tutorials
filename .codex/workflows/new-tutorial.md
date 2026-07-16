# 新建教程

请根据用户给出的主题创建一篇公开 AI 教程。

1. 依据 `AGENTS.md` 选择唯一的内容目录；先填写 `templates/article-brief.md`，明确读者问题和内容类型。
2. 使用英文 kebab-case 文件名，并填写 `title`、`description`、`tags`、`published`、`contentType` frontmatter。
3. 根据 `docs/content-model.md` 选择结构。只有 `tutorial` 强制使用步骤与可验证结果；解释文、案例、参考和实验不得套用相同模板。
4. 对时效性事实使用一手来源，并注明核验日期。
5. 页面需要更强表现力时，可自由使用 MDX、已有 Fumadocs 组件或新增可复用 React 组件；新增组件放在 `src/components/`，保持 GitHub Pages 静态兼容。
6. 若需要位图封面或插图，使用 ImageGen，并把最终文件保存到 `public/images/<topic>/`；不要引用临时目录。
7. 不修改部署配置或生成目录。
8. 完成后运行聚焦内容检查与 `npm run check`；如失败，修正后重新运行。
