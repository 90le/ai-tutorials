import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  AgentFlowStudio,
  ContextBudgetComposer,
  CostLatencySimulator,
  EvidenceNetwork,
  FailureStateGallery,
  ModelTradeoffMatrix,
  MultiAgentOrchestration,
  PromptDiffLab,
  RetrievalExplorer,
  StreamingResponseTimeline,
  ToolCallTrace,
} from './workbench-components';
import { SemanticSpace3D } from './semantic-space-3d';

describe('experience lab original components', () => {
  it('renders twelve named, operable AI demonstrations', () => {
    const components = [
      <AgentFlowStudio key="flow" />, <PromptDiffLab key="prompt" />, <ContextBudgetComposer key="context" />,
      <RetrievalExplorer key="retrieval" />, <ToolCallTrace key="trace" />, <MultiAgentOrchestration key="agents" />,
      <ModelTradeoffMatrix key="models" />, <CostLatencySimulator key="cost" />, <EvidenceNetwork key="evidence" />,
      <SemanticSpace3D key="semantic" />, <StreamingResponseTimeline key="stream" />, <FailureStateGallery key="failure" />,
    ];
    const html = renderToStaticMarkup(<>{components.map((component, index) => <div key={index}>{component}</div>)}</>);

    expect(html).toContain('Agent 流程工作台');
    expect(html).toContain('提示词差异实验');
    expect(html).toContain('上下文预算编排器');
    expect(html).toContain('检索结果探索器');
    expect(html).toContain('工具调用轨迹');
    expect(html).toContain('多智能体编排');
    expect(html).toContain('模型权衡矩阵');
    expect(html).toContain('成本与延迟模拟器');
    expect(html).toContain('证据关系网络');
    expect(html).toContain('语义空间 3D');
    expect(html).toContain('流式响应时间线');
    expect(html).toContain('失败状态画廊');
    expect(html).toContain('<button');
    expect(html).toContain('type="range"');
  });
});
