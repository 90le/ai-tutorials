'use client';

import { useMemo, useState } from 'react';
import { Check, CircleAlert, Play, RotateCcw, Search, Sparkles } from 'lucide-react';
import type { EChartsOption } from 'echarts';
import { LabShell, LazyEChart, SegmentedControl } from './lab-foundations';

const steps = ['理解任务', '检索证据', '调用工具', '综合判断', '交付结果'];

export function AgentFlowStudio() {
  const [active, setActive] = useState(1);
  return <LabShell number="01" title="Agent 流程工作台" description="点击节点查看一次可控 Agent 运行如何推进。" footer={<span>当前阶段：{steps[active]}</span>}><div className="docs-agent-flow">{steps.map((step, index) => <button type="button" data-state={index < active ? 'done' : index === active ? 'active' : 'idle'} onClick={() => setActive(index)} key={step}><small>{String(index + 1).padStart(2, '0')}</small><strong>{step}</strong><span>{index < active ? <Check aria-hidden="true" /> : index === active ? <Sparkles aria-hidden="true" /> : null}</span></button>)}</div><button className="docs-lab-primary" type="button" onClick={() => setActive((value) => (value + 1) % steps.length)}><Play aria-hidden="true" />运行下一步</button></LabShell>;
}

export function PromptDiffLab() {
  const [version, setVersion] = useState('改进版');
  return <LabShell number="02" title="提示词差异实验" description="比较约束变化如何改变输出的可验收性。"><SegmentedControl label="选择提示词版本" options={['原始版', '改进版']} value={version} onChange={setVersion} /><div className="docs-prompt-diff"><pre><span>任务：总结这份材料。</span>{version === '改进版' ? <><ins>读者：产品负责人</ins><ins>输出：结论 / 证据 / 限制</ins><ins>缺失信息标记为待确认</ins></> : <del>未定义读者、证据边界和完成条件</del>}</pre><aside><small>可验收度</small><strong>{version === '改进版' ? '92' : '38'}<em>/100</em></strong></aside></div></LabShell>;
}

export function ContextBudgetComposer() {
  const [retrieval, setRetrieval] = useState(34);
  const [history, setHistory] = useState(26);
  const fixed = 28;
  const total = fixed + retrieval + history;
  return <LabShell number="03" title="上下文预算编排器" description="拖动预算，观察系统、历史、检索与输出之间的竞争。"><div className="docs-budget-ring" style={{ '--budget': `${Math.min(total, 100)}%` } as React.CSSProperties}><strong>{total}%</strong><span>{total > 100 ? '超出窗口' : '已分配'}</span></div><div className="docs-lab-sliders"><label>检索证据 <output>{retrieval}%</output><input type="range" min="10" max="60" value={retrieval} onChange={(event) => setRetrieval(Number(event.target.value))} /></label><label>对话历史 <output>{history}%</output><input type="range" min="5" max="50" value={history} onChange={(event) => setHistory(Number(event.target.value))} /></label></div><p className={total > 100 ? 'is-warning' : ''}>{total > 100 ? '需要压缩历史或减少检索片段。' : `还剩 ${100 - total}% 机动空间。`}</p></LabShell>;
}

const retrievalSets = {
  '产品决策': [['官方定价页', 96], ['版本说明', 88], ['社区讨论', 61]],
  '技术排障': [['错误日志', 98], ['官方文档', 91], ['相似 Issue', 76]],
} as const;
export function RetrievalExplorer() {
  const [query, setQuery] = useState<keyof typeof retrievalSets>('产品决策');
  return <LabShell number="04" title="检索结果探索器" description="切换查询，观察来源排序、匹配度与证据层级。"><SegmentedControl label="选择检索任务" options={Object.keys(retrievalSets)} value={query} onChange={(value) => setQuery(value as keyof typeof retrievalSets)} /><div className="docs-retrieval-query"><Search aria-hidden="true" /><span>{query === '产品决策' ? '当前方案的价格和限制是什么？' : '为什么构建后页面资源 404？'}</span></div><ol className="docs-ranked-results">{retrievalSets[query].map(([name, score], index) => <li key={name}><span>{index + 1}</span><div><strong>{name}</strong><small>{index === 0 ? '一手证据' : '补充材料'}</small></div><meter min="0" max="100" value={score}>{score}%</meter><b>{score}%</b></li>)}</ol></LabShell>;
}

export function ToolCallTrace() {
  const [active, setActive] = useState(2);
  const calls = [['search.query', '128 ms'], ['browser.open', '342 ms'], ['extract.claims', '86 ms'], ['human.review', '等待']];
  return <LabShell number="05" title="工具调用轨迹" description="逐步检查输入、耗时、返回值与人工边界。"><div className="docs-trace-layout"><ol>{calls.map(([name, time], index) => <li data-active={index === active} key={name}><button type="button" onClick={() => setActive(index)}><span>{index + 1}</span><strong>{name}</strong><small>{time}</small></button></li>)}</ol><div className="docs-trace-inspector"><small>STEP {active + 1}</small><strong>{calls[active][0]}</strong><code>{active === 3 ? 'approval_required: true' : `status: ok\nlatency: ${calls[active][1]}`}</code></div></div></LabShell>;
}

export function MultiAgentOrchestration() {
  const [mode, setMode] = useState('研究');
  const agents = mode === '研究' ? ['检索 Agent', '证据 Agent', '写作 Agent'] : ['规划 Agent', '编码 Agent', '验证 Agent'];
  return <LabShell number="06" title="多智能体编排" description="同一协调器根据任务类型切换团队和交接关系。"><SegmentedControl label="选择编排模式" options={['研究', '开发']} value={mode} onChange={setMode} /><div className="docs-orchestration"><div className="docs-orchestrator"><Sparkles aria-hidden="true" /><strong>协调器</strong><small>拆解 · 路由 · 汇总</small></div><div className="docs-agent-team">{agents.map((agent, index) => <article key={agent}><span>{index + 1}</span><strong>{agent}</strong><small>{index === 0 ? '运行中' : index === 1 ? '等待输入' : '等待交接'}</small></article>)}</div></div></LabShell>;
}

export function ModelTradeoffMatrix() {
  const [goal, setGoal] = useState('质量优先');
  const option = useMemo<EChartsOption>(() => ({ grid: { left: 34, right: 18, top: 18, bottom: 32 }, xAxis: { name: '速度', min: 0, max: 100 }, yAxis: { name: '质量', min: 0, max: 100 }, tooltip: { trigger: 'item' }, series: [{ type: 'scatter', symbolSize: (value: number[]) => 18 + value[2] / 5, data: goal === '质量优先' ? [[58, 94, 70, '深度模型'], [82, 78, 35, '均衡模型'], [96, 61, 12, '轻量模型']] : [[64, 90, 70, '深度模型'], [88, 76, 35, '均衡模型'], [98, 58, 12, '轻量模型']], label: { show: true, formatter: (params: { data: unknown }) => String((params.data as unknown[])[3]), position: 'top' }, itemStyle: { color: '#7558e8' } }] }), [goal]);
  return <LabShell number="07" title="模型权衡矩阵" description="切换目标，在质量、速度和相对成本之间做选择。"><SegmentedControl label="选择决策目标" options={['质量优先', '速度优先']} value={goal} onChange={setGoal} /><LazyEChart option={option} ariaLabel={`${goal}模型权衡散点图`} /></LabShell>;
}

export function CostLatencySimulator() {
  const [tokens, setTokens] = useState(36);
  const [parallel, setParallel] = useState(3);
  const cost = (tokens * 0.017 * parallel).toFixed(2);
  const latency = Math.round(420 + tokens * 9 + parallel * 80);
  return <LabShell number="08" title="成本与延迟模拟器" description="改变上下文与并发量，查看交付成本和等待时间的联动。"><div className="docs-simulator-metrics"><div><small>估算成本</small><strong>¥{cost}</strong></div><div><small>P95 延迟</small><strong>{latency} ms</strong></div></div><div className="docs-lab-sliders"><label>上下文（千 token）<output>{tokens}K</output><input type="range" min="4" max="128" value={tokens} onChange={(event) => setTokens(Number(event.target.value))} /></label><label>并发调用<output>{parallel}</output><input type="range" min="1" max="8" value={parallel} onChange={(event) => setParallel(Number(event.target.value))} /></label></div></LabShell>;
}

export function EvidenceNetwork() {
  const [focus, setFocus] = useState('定价结论');
  const option = useMemo<EChartsOption>(() => ({ tooltip: {}, series: [{ type: 'graph', layout: 'force', roam: true, force: { repulsion: 150, edgeLength: 95 }, label: { show: true, color: '#59525f' }, data: [{ name: '定价结论', symbolSize: focus === '定价结论' ? 56 : 42 }, { name: '官方价格页', symbolSize: 34 }, { name: '版本说明', symbolSize: 34 }, { name: '限制条款', symbolSize: focus === '风险边界' ? 56 : 42 }, { name: '社区反馈', symbolSize: 28 }], links: [{ source: '官方价格页', target: '定价结论' }, { source: '版本说明', target: '定价结论' }, { source: '限制条款', target: '定价结论' }, { source: '社区反馈', target: '限制条款' }], lineStyle: { color: '#9b8bea', width: 2 }, itemStyle: { color: '#b4dc60', borderColor: '#7558e8', borderWidth: 2 } }] }), [focus]);
  return <LabShell number="09" title="证据关系网络" description="拖动、缩放并切换关注点，检查主张与来源之间的连接。"><SegmentedControl label="选择网络关注点" options={['定价结论', '风险边界']} value={focus} onChange={setFocus} /><LazyEChart option={option} ariaLabel="可拖动缩放的证据关系网络" /></LabShell>;
}

export function StreamingResponseTimeline() {
  const [progress, setProgress] = useState(62);
  return <LabShell number="11" title="流式响应时间线" description="拖动时间轴，观察检索、首 token、工具返回和完成事件。"><input className="docs-stream-range" aria-label="响应进度" type="range" min="0" max="100" value={progress} onChange={(event) => setProgress(Number(event.target.value))} /><div className="docs-stream-track" style={{ '--stream': `${progress}%` } as React.CSSProperties}>{[['请求', 0], ['首 token', 18], ['工具返回', 48], ['完成', 100]].map(([label, point]) => <span data-reached={progress >= Number(point)} style={{ left: `${point}%` }} key={label}><i /><b>{label}</b><small>{point}%</small></span>)}</div><p>{progress < 18 ? '正在建立连接…' : progress < 48 ? '模型开始流式输出…' : progress < 100 ? '证据已返回，正在综合…' : '响应完成，可进入人工复核。'}</p></LabShell>;
}

export function FailureStateGallery() {
  const [state, setState] = useState('来源冲突');
  const details: Record<string, [string, string]> = { '来源冲突': ['两个一手来源给出不同版本', '暂停自动总结，展示时间和版本差异。'], '工具超时': ['外部检索超过等待阈值', '保留已有结果并提供重试入口。'], '证据不足': ['关键结论只有单一二手来源', '降级结论强度并请求补充材料。'] };
  return <LabShell number="12" title="失败状态画廊" description="好组件不仅展示成功，也把失败、恢复和人工接管讲清楚。"><SegmentedControl label="选择失败状态" options={Object.keys(details)} value={state} onChange={setState} /><div className="docs-failure-state"><CircleAlert aria-hidden="true" /><div><small>{state}</small><strong>{details[state][0]}</strong><p>{details[state][1]}</p></div><button type="button"><RotateCcw aria-hidden="true" />重新检查</button></div></LabShell>;
}
