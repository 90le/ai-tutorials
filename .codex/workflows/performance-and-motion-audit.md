# 性能与动效审查

1. 记录复现 URL、视口、主题、动效模式、控制台错误和可观察症状。
2. 盘点页面上的 WebGL 上下文、`requestAnimationFrame`、GSAP ticker、ScrollTrigger、观察器和全局监听器。
3. 为问题写失败测试或可重复测量；不要用“删除全部视觉”代替根因修复。
4. 首屏最多一个自动 WebGL 场景；重型库按需导入，离屏/后台暂停，卸载时释放资源。
5. 验证 `auto`、`reduced`、`off`，以及 JavaScript 失败时的静态页面。
6. 运行 `npm run check` 和浏览器 QA，报告修复前后行为与已知限制。
