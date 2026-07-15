# 新建教程

请根据用户给出的主题创建一篇公开 AI 教程。

1. 依据 `AGENTS.md` 选择唯一的内容目录；不确定时使用 `content/docs/notes/`。
2. 使用英文 kebab-case 文件名，并填写 `title`、`description`、`tags`、`published` frontmatter。
3. 文章必须包含适合读者、前置条件、分步操作、可验证结果和下一步阅读建议。
4. 对时效性事实使用一手来源，并注明核验日期。
5. 页面需要更强表现力时，可自由使用 MDX、已有 Fumadocs 组件或新增可复用 React 组件；新增组件放在 `src/components/`，保持 GitHub Pages 静态兼容。
6. 若需要位图封面或插图，使用 ImageGen，并把最终文件保存到 `public/images/<topic>/`；不要引用临时目录。
7. 不修改部署配置或生成目录。
8. 完成后运行 `npm run lint`、`npm run types:check` 和 `npm run build`；如失败，修正后重新运行。
