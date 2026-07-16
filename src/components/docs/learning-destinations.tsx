import {
  ArrowUpRight,
  Books,
  Compass,
  Target,
  Toolbox,
} from '@phosphor-icons/react/ssr';
import type { Icon } from '@phosphor-icons/react';
import Link from 'next/link';

const destinations: Array<{
  index: string;
  title: string;
  description: string;
  href: string;
  icon: Icon;
}> = [
  {
    index: '01',
    title: '快速开始',
    description: '从第一个真实任务开始，建立任务简报、证据边界与人工验收。',
    href: '/docs/start-here/',
    icon: Compass,
  },
  {
    index: '02',
    title: '工具教程',
    description: '按工具学习核心能力、适用边界和可复用操作方式。',
    href: '/docs/tools/',
    icon: Toolbox,
  },
  {
    index: '03',
    title: '场景打法',
    description: '围绕研究、写作、知识管理和开发任务组织流程。',
    href: '/docs/playbooks/',
    icon: Target,
  },
  {
    index: '04',
    title: '系列课程',
    description: '沿连续学习路径建立稳定、完整的 AI 工作能力。',
    href: '/docs/series/',
    icon: Books,
  },
];

export function LearningDestinations() {
  return (
    <section className="docs-destinations" aria-labelledby="learning-destinations-title">
      <div className="docs-section-heading">
        <div>
          <span>01 / START HERE</span>
          <h2 id="learning-destinations-title">四大学习目的地</h2>
        </div>
        <p>先按任务选择入口，再进入具体文章；不需要先理解全部分类。</p>
      </div>
      <div className="docs-destination-grid">
        {destinations.map(({ index, title, description, href, icon: IconComponent }) => (
          <Link className="docs-destination" href={href} key={href} prefetch={false}>
            <span>{index}</span>
            <IconComponent aria-hidden="true" weight="regular" />
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <ArrowUpRight aria-hidden="true" className="docs-destination-arrow" weight="bold" />
          </Link>
        ))}
      </div>
    </section>
  );
}
