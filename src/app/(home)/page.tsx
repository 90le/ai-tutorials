import Link from 'next/link';
import { ArrowRight, BookOpenText, Lightbulb, Workflow } from 'lucide-react';
import { AuthorContactCard } from '@/components/author-contact-card';
import { LearningEntryCard } from '@/components/learning-entry-card';

export default function HomePage() {
  return (
    <div className="tutorial-home">
      <div className="tutorial-home-atmosphere" aria-hidden="true">
        <span className="tutorial-ambient-orb tutorial-ambient-orb-one" />
        <span className="tutorial-ambient-orb tutorial-ambient-orb-two" />
        <span className="tutorial-ambient-orb tutorial-ambient-orb-three" />
        <span className="tutorial-ambient-grid" />
      </div>

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

      <section className="tutorial-home-section tutorial-home-section-primary" aria-labelledby="primary-routes-title">
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

      <div className="tutorial-flow-bridge" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <section className="tutorial-practice-section" aria-labelledby="practice-title">
        <div className="tutorial-practice-heading">
          <p className="eyebrow">不是收藏，而是完成</p>
          <h2 id="practice-title">每次学习，都留下能继续使用的东西。</h2>
          <p>从一个小任务开始，逐步形成自己的工具选择、工作流和参考资料。</p>
        </div>
        <ol className="tutorial-practice-steps">
          <li><span>01</span><BookOpenText size={22} /><strong>读一篇能解决问题的教程</strong><p>先理解一个清晰、可重复的操作。</p></li>
          <li><span>02</span><Workflow size={22} /><strong>在真实场景里做一遍</strong><p>把工具能力变成自己的工作步骤。</p></li>
          <li><span>03</span><Lightbulb size={22} /><strong>沉淀提示词与复盘</strong><p>下次遇到相似问题时，从已有方法继续。</p></li>
        </ol>
      </section>

      <section className="tutorial-home-section tutorial-home-section-explore" aria-labelledby="explore-routes-title">
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

      <section className="tutorial-topic-marquee" aria-label="探索主题">
        <p>从你此刻最关心的方向开始</p>
        <div className="tutorial-topic-marquee-window">
          <div className="tutorial-topic-marquee-track">
            {[0, 1].map((copy) => (
              <div className="tutorial-topic-marquee-group" aria-hidden={copy === 1} key={copy}>
                <Link href="/docs/tools" tabIndex={copy === 1 ? -1 : undefined}>工具选择</Link>
                <span>✦</span>
                <Link href="/docs/playbooks" tabIndex={copy === 1 ? -1 : undefined}>真实工作流</Link>
                <span>✦</span>
                <Link href="/docs/reference" tabIndex={copy === 1 ? -1 : undefined}>提示词与模板</Link>
                <span>✦</span>
                <Link href="/docs/series" tabIndex={copy === 1 ? -1 : undefined}>连续课程</Link>
                <span>✦</span>
                <Link href="/docs/notes" tabIndex={copy === 1 ? -1 : undefined}>实验与复盘</Link>
                <span>✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AuthorContactCard />
    </div>
  );
}
