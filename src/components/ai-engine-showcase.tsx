'use client';

import { Component, lazy, Suspense, type ErrorInfo, type ReactNode, useState } from 'react';
import { Box, Radio, Route, type LucideIcon } from 'lucide-react';

type EngineMode = 'space' | 'state' | 'atlas';

const modes: Array<{ id: EngineMode; label: string; engine: string; description: string; icon: LucideIcon }> = [
  { id: 'space', label: '空间界面', engine: 'SPLINE', description: '拖动空间模型，感受知识结构如何从平面进入三维。', icon: Box },
  { id: 'state', label: '智能状态', engine: 'RIVE', description: '观察状态动画如何表达智能体的运行、暂停与反馈。', icon: Radio },
  { id: 'atlas', label: '生态地图', engine: 'MAP ENGINE', description: '缩放并聚焦模型、数据、创作和工作流之间的关系。', icon: Route },
];

const EngineLoading = () => (
  <div className="engine-loading" role="status"><i /><span>正在启动实时引擎…</span></div>
);

const SplineStage = lazy(() => import('./engine-stages/spline-stage'));
const RiveStage = lazy(() => import('./engine-stages/rive-stage'));
const EcosystemAtlas = lazy(() => import('./engine-stages/ecosystem-atlas'));

class EngineErrorBoundary extends Component<{
  children: ReactNode;
  resetKey: string;
  onRetry: () => void;
}, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Optional homepage engine failed', error, info.componentStack);
  }

  componentDidUpdate(previous: Readonly<{ resetKey: string }>) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="engine-error" role="alert">
        <strong>这个实时实验暂时没有启动成功。</strong>
        <p>其他内容不受影响，你可以稍后重试。</p>
        <button type="button" onClick={this.props.onRetry}>重新启动</button>
      </div>
    );
  }
}

export function AiEngineShowcase() {
  const [active, setActive] = useState<EngineMode | null>(null);
  const [restart, setRestart] = useState(0);
  const selected = modes.find((mode) => mode.id === active);
  const resetKey = `${active ?? 'idle'}-${restart}`;

  return (
    <div className="engine-showcase">
      <div className="engine-switcher" role="tablist" aria-label="实时视觉引擎">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={active === mode.id}
              className={active === mode.id ? 'is-active' : undefined}
              onClick={() => setActive(mode.id)}
              key={mode.id}
            >
              <Icon size={18} /><span>{mode.label}<small>{mode.engine}</small></span>
            </button>
          );
        })}
      </div>
      <div className="engine-canvas" role="tabpanel" aria-live="polite">
        {active === null ? (
          <div className="engine-idle">
            <span>INTERACTIVE FIELD / ON DEMAND</span>
            <strong>选择一种方式<br />进入 AI 知识现场</strong>
            <p>三个实验按需启动；未选择时不会加载额外的实时引擎。</p>
          </div>
        ) : (
          <EngineErrorBoundary key={resetKey} resetKey={resetKey} onRetry={() => setRestart((value) => value + 1)}>
            <div className="engine-mode-context"><span>{selected?.engine}</span><p>{selected?.description}</p></div>
            <Suspense fallback={<EngineLoading />}>
              {active === 'space' ? <SplineStage /> : null}
              {active === 'state' ? <RiveStage /> : null}
              {active === 'atlas' ? <EcosystemAtlas /> : null}
            </Suspense>
          </EngineErrorBoundary>
        )}
      </div>
    </div>
  );
}
