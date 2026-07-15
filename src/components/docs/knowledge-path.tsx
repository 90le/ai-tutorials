import {
  CheckCircle,
  Code,
  Compass,
  Cube,
  RocketLaunch,
  Wrench,
} from '@phosphor-icons/react/ssr';
import type { Icon } from '@phosphor-icons/react';

const path: Array<{ title: string; description: string; icon: Icon }> = [
  { title: '入门准备', description: '认识能力边界', icon: Compass },
  { title: '工具选择', description: '匹配任务工具', icon: Wrench },
  { title: '核心技能', description: '提示与校验', icon: Cube },
  { title: '进阶应用', description: '组合工作流程', icon: Code },
  { title: '实战落地', description: '交付并复盘', icon: RocketLaunch },
];

export function KnowledgePath() {
  return (
    <section className="docs-knowledge-path" aria-labelledby="knowledge-path-title">
      <div className="docs-section-heading docs-section-heading-inline">
        <div>
          <span>02 / KNOWLEDGE MAP</span>
          <h2 id="knowledge-path-title">探索知识地图</h2>
        </div>
        <p>从基础判断到可验证交付，五步形成完整闭环。</p>
      </div>
      <ol>
        {path.map(({ title, description, icon: IconComponent }, index) => (
          <li key={title}>
            <div className="docs-path-node">
              <IconComponent aria-hidden="true" weight="regular" />
              {index === path.length - 1 ? <CheckCircle aria-hidden="true" weight="fill" /> : null}
            </div>
            <strong>{title}</strong>
            <span>{description}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
