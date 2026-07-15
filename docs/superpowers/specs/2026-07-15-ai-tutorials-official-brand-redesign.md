# AI Tutorials — AI Knowledge Universe

## 目标

首页是面向未来 AI 全领域的品牌官网，不是文档目录的放大版。它承载模型、智能体、AI 创作、开发、研究与自动化工作流，同时保留文档搜索、主题切换、作者信息和静态导出能力。

## 视觉方向

- 采用“AI Knowledge Universe / 活的知识场”概念。
- 暖白与近黑两套主题共享电光蓝、酸性绿、玫红和青色信号色。
- 大字不是唯一视觉中心；实时场景、轨道标记、信息带、能力节点和互动实验共同建立层次。
- 不做同质化紫色 SaaS、机械机器人插画、假数据面板或库名称陈列。

## 首页结构

1. 实时 Three.js AI 场景与品牌主张。
2. 持续运动的 AI 领域信号带。
3. 六领域 AI 能力地图。
4. Spline / Rive / MapLibre 三模式实时交互剧场。
5. 从发现、实践到系统化的方法路径。
6. ECharts 知识网络与 Matter.js 物理知识场。
7. 内容动态、作者联系和完整品牌页脚。

## 引擎职责

- Three.js：首屏实时 3D 场景、粒子、轨道和指针响应。
- GSAP + ScrollTrigger：首屏入场、连续空间位移、节点微差运动；不隐藏正文。
- Lenis：与 ScrollTrigger 同步的滚动时间轴。
- Spline：可直接拖动的空间界面。
- Rive：可播放、暂停的矢量状态动画。
- MapLibre：无 Token、本地 GeoJSON 的 AI 生态空间图。
- ECharts：可拖拽知识关系网络。
- Matter.js：指针驱动的知识模块物理场。

## 已踩坑与永久规则

1. 不用 `prefers-reduced-motion` 无声关闭整站动态。首页提供明确的 `MOTION ON/OFF` 控件，默认开启；关闭时再统一暂停。
2. 不把核心内容设为 `opacity: 0` 等待 ScrollTrigger。正文始终可见，滚动只改变空间位置、速度和层次，避免“懒加载感”和触发失败后的空白。
3. GSAP、ScrollTrigger 和 Lenis使用客户端确定性打包，不在首屏用运行时 Promise 分包初始化。
4. Next.js 静态导出首页的站内 `<Link>` 必须 `prefetch={false}`，防止普通静态服务器请求 RSC `.txt` 片段产生 404。
5. 移动端不使用超宽轨道和负边距制造“视觉张力”。卡片改为单列，所有断点都要求 `scrollWidth === clientWidth`。
6. 第三方实时场景必须有真实内容和交互；不安装空库、不放空画布、不用 iframe 冒充实现。
7. CSS 动画是环境运动兜底，JS 引擎负责增强；单个引擎失败不应让页面整体静止。

## 验证

- 固定运行 `npm run lint`、`npm run types:check`、`npm run build`。
- 直接验证 `out/` 静态产物，而不是只看开发服务器。
- 检查 `document.documentElement.dataset.motion === 'ready'`。
- 采样同一动画在两个时间点的矩阵，确认逐帧变化。
- 桌面与 375px 手机均要求无横向溢出。
- 三种交互剧场模式逐一切换并确认画布创建。
