import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AuthorContactCard } from '@/components/author-contact-card';
import { LearningEntryCard } from '@/components/learning-entry-card';

export default function HomePage() {
  return (
    <div className="tutorial-home">
      <section className="tutorial-hero">
        <div className="tutorial-hero-copy">
          <p className="eyebrow">公开 AI 知识库</p>
          <h1>把 AI 用到<br />真实工作里。</h1>
          <p className="tutorial-hero-summary">
            系统学习 AI 工具、工作流与实践方法。每一篇教程都可独立阅读，也能沿着合集逐步完成学习。
          </p>
          <div className="tutorial-hero-actions">
            <Link href="/docs/start-here" className="tutorial-primary-action">
              从这里开始 <ArrowRight size={18} />
            </Link>
            <Link href="/docs" className="tutorial-secondary-action">浏览全部文档</Link>
          </div>
        </div>
        <div className="tutorial-learning-stage" aria-label="学习路径预览">
          <p className="tutorial-stage-label">你的学习路径</p>
          <div className="tutorial-stage-track" aria-hidden="true" />
          <Link href="/docs/start-here" className="tutorial-stage-card tutorial-stage-card-start">
            <span>01 · 起步</span>
            <strong>选一个真实任务</strong>
            <small>从这里开始</small>
          </Link>
          <Link href="/docs/tools" className="tutorial-stage-card tutorial-stage-card-tool">
            <span>02 · 工具</span>
            <strong>找到顺手的能力</strong>
            <small>工具教程</small>
          </Link>
          <Link href="/docs/playbooks" className="tutorial-stage-card tutorial-stage-card-playbook">
            <span>03 · 实践</span>
            <strong>完成一次工作流</strong>
            <small>场景打法</small>
          </Link>
          <Link href="/docs/reference" className="tutorial-stage-card tutorial-stage-card-reference">
            <span>04 · 沉淀</span>
            <strong>留下可复用的方法</strong>
            <small>参考资料</small>
          </Link>
        </div>
      </section>

      <section className="tutorial-home-section" aria-labelledby="primary-routes-title">
        <div className="tutorial-section-heading">
          <p className="eyebrow">学习入口</p>
          <h2 id="primary-routes-title">从一个明确的问题开始。</h2>
        </div>
        <div className="learning-entry-grid learning-entry-grid-primary">
          <LearningEntryCard title="从这里开始" description="为新读者规划第一条可完成的学习路线。" href="/docs/start-here" priority />
          <LearningEntryCard title="工具教程" description="理解 Codex、Claude、Cursor 等工具如何真正帮上忙。" href="/docs/tools" priority />
          <LearningEntryCard title="场景打法" description="把写作、开发、研究与自动化拆成可复用的步骤。" href="/docs/playbooks" priority />
        </div>
      </section>

      <section className="tutorial-home-section" aria-labelledby="explore-routes-title">
        <div className="tutorial-section-heading">
          <p className="eyebrow">继续探索</p>
          <h2 id="explore-routes-title">把适合自己的方法留下来。</h2>
        </div>
        <div className="learning-entry-grid">
          <LearningEntryCard title="系列课程" description="围绕一个目标连续学习的完整教程合集。" href="/docs/series" />
          <LearningEntryCard title="灵感与实验" description="短技巧、实验与值得留存的实践观察。" href="/docs/notes" />
          <LearningEntryCard title="参考资料" description="提示词、模板、术语与常见问题。" href="/docs/reference" />
        </div>
      </section>

      <AuthorContactCard />
    </div>
  );
}
