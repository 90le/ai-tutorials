# Design QA — AI Knowledge Universe

## 当前交付

- 静态预览：`http://localhost:3002/?v=16`
- 方向：AI Knowledge Universe / 活的知识场
- 覆盖状态：桌面浅色、375px 手机、首屏、能力地图、多引擎剧场

## 已验证体验

- Three.js 首屏持续逐帧运行并响应指针。
- `document.documentElement.dataset.motion` 为 `ready`；即使系统返回 reduced-motion，站内默认仍是 `MOTION ON`。
- GSAP 不再把正文设为透明；滚动仅产生连续空间位移，无“懒加载突然弹出”。
- Spline、Rive、MapLibre 三个模式可以切换，均创建真实画布。
- ECharts 网络可拖拽，Matter.js 标签响应指针力。
- 所有首页和导航站内 Link 关闭静态导出不需要的 RSC 预取。
- 桌面与 375px 手机均满足 `scrollWidth === clientWidth`。
- 手机首屏的 3D 场景已下沉，正文位于保护层之上，不再被场景遮挡。
- 深浅主题共享完整变量系统；Three.js 材质随主题变化。

## 设计取舍

- 删除旧版“滚动揭示 + 彩色大卡片轨道”的主体语言。
- 不以库名称作为官网内容；引擎只服务于空间、状态、地图和物理交互。
- 内容从“教程分类”扩展到模型、智能体、AI 创作、开发、研究和自动化六个领域。
- 保留 Fumadocs 作为文档阅读层，首页使用独立品牌体验。

## 验证结果

- [x] `npm run lint`
- [x] `npm run types:check`
- [x] `npm run build`
- [x] 静态导出成功
- [x] 发布产物动效状态为 ready
- [x] 动画矩阵在两个采样时刻发生变化
- [x] 三个交互剧场模式逐一切换
- [x] 桌面与手机无横向溢出

final result: passed
