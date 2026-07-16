# 验证与发布

1. 明确发布范围，检查分支与 `git status --short`；有用户改动时只按显式路径暂存。
2. 运行 `npm run check`，不得省略失败项或用旧结果代替。
3. 检查 `out/` 中首页、文档首页和代表文章；在桌面/移动、浅色/深色、reduced/off 下完成浏览器 QA。
4. 使用 `templates/release-report.md` 记录日期、提交、范围、命令、浏览器状态、失败项和限制。
5. 运行 `git diff --check` 和暂存 diff 审查后再提交；只有用户明确要求时才推送或合并。
6. 推送后核验 GitHub Actions 和公开 Pages URL，部署失败时保留证据并修复根因。
