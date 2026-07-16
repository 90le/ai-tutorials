# 文档组件目录

组件必须静态导出兼容、响应式、键盘可用，并在没有 JavaScript 时保留核心信息。

| 组件 | 用途 | 不要用于 |
| --- | --- | --- |
| `PromptCard` | 可复制的任务合同或提示词 | 真实代码、命令 |
| `SourcesDisclosure` | 文末来源与补充阅读 | 隐藏核心证据 |
| `KeyTakeaways` | 章节或文章的少量关键判断 | 重复整篇摘要 |
| `MermaidDiagram` | 流程、关系、系统结构 | 装饰性网络图 |
| `ScenarioTabs` | 同一问题的少量互斥场景 | 隐藏顺序步骤 |
| `SourceMixChart` | 带数据表的教学型来源组合 | 伪装行业统计 |
| `ReadingProgress` | 正文阅读进度 | 页面加载进度 |
| `BackToTop` | 长文快速返回顶部 | 首屏固定装饰 |
| `DiagramViewer` | 超宽图示的全屏与缩放 | 普通短文本 |
| `CodeToolbar` | 复制、换行和展开长代码 | 提示词排版 |
| `ArticlePager` | 按知识树翻页 | 按磁盘顺序跳转 |
| `MediaFrame` | 富媒体标题、来源、状态与工具栏 | 把每段正文卡片化 |
| `ArticleImage` / `ImageGallery` | 可解释图片与图片组 | 无意义氛围图 |
| `ArticleVideo` | 有海报、字幕和文字稿的演示 | 自动播放背景视频 |
| `ChartFrame` | 有口径、数据表和降级的图表 | 仅 hover 可读的图形 |
| `FormulaBlock` | 公式、变量解释和 LaTeX 复制 | 公式截图 |
| `DataTable` | 需要比较或下载的数据 | 用卡片破坏比较关系 |
| `DownloadCard` | 静态公开附件 | 私有或运行时生成文件 |

所有真实数据标明来源、时间、单位和口径；示意或生成数据在标题、表格与导出中持续标注。固定控件桌面最多两个，移动端最多保留目录与返回顶部。
