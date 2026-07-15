# Design QA — Homepage Product Optimization

## 当前交付

- 静态预览：`http://localhost:3002/?v=19`
- 方向：AI Knowledge Universe / 产品化知识入口
- 覆盖：1280px 桌面、窄屏、深浅主题、动效控制、文档入口

## 已验证体验

- 首页先回答“今天想完成什么”，再提供精选内容、能力地图和方法路径。
- 首屏只启动一个 Three.js 品牌场景，首页其余区域不再创建额外画布。
- 动效开关状态可持久化；首次访问尊重 `prefers-reduced-motion`，页面可进入 `ready` 或 `disabled` 状态。
- 页面失焦后 Three.js 暂停绘制，恢复可见后继续。
- 深浅主题会同步更新首页和导航。
- 1280px 与 375px 均无横向溢出；移动端目标与能力卡片采用双列，精选内容使用横向吸附浏览。
- 首页全新会话控制台无 error 或 warning。
- 文档页保留 Fumadocs 阅读结构，并使用同一品牌紫色、导航标识和主题变量。

## 设计取舍

- 删除首页默认展示的 ECharts 与 Matter.js 实验，降低页面长度与首屏认知负担。
- 将六个能力领域压缩为索引，不再让每张卡片承担主视觉角色。
- 把作者与开源信任信息移到精选内容之后，并在后段保留完整联系方式。
- 删除缺少内容价值的 `OPTIONAL LAB`，让能力地图直接过渡到方法路径。
- 移除 Spline、Rive、MapLibre 组件、样式与依赖，减少 35 个安装包。

## 验证结果

- [x] `npm run lint`
- [x] `npm run types:check`
- [x] `npm run build`
- [x] 静态导出成功
- [x] 首页仅保留 1 个首屏画布
- [x] `OPTIONAL LAB` 与实验组件不存在
- [x] 深浅主题切换生效
- [x] 桌面与手机无横向溢出
- [x] 控制台无错误和警告

final result: passed
