import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Braces,
  Boxes,
  BrainCircuit,
  Clapperboard,
  FlaskConical,
  Orbit,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { AiEngineShowcase } from '@/components/ai-engine-showcase';
import { AuthorContactCard } from '@/components/author-contact-card';
import { HomeMotionController } from '@/components/home-motion-controller';
import { KnowledgeMapChart } from '@/components/knowledge-map-chart';
import { KineticKnowledgeScene } from '@/components/kinetic-knowledge-scene';
import { PhysicsKnowledgeField } from '@/components/physics-knowledge-field';

const universe = [
  { no: '01', title: '模型与能力', text: '理解模型边界、推理能力与选择方法。', icon: BrainCircuit, href: '/docs/tools', tone: 'blue' },
  { no: '02', title: '智能体', text: '从一次问答，走向可持续执行的 Agent。', icon: Bot, href: '/docs/series', tone: 'lime' },
  { no: '03', title: 'AI 创作', text: '图像、视频、声音与新叙事的实践现场。', icon: Clapperboard, href: '/docs/notes', tone: 'rose' },
  { no: '04', title: 'AI 开发', text: '把编程助手变成可靠的工程协作者。', icon: Braces, href: '/docs/tools', tone: 'violet' },
  { no: '05', title: '研究与实验', text: '追踪前沿，也沉淀可以复现的实验。', icon: FlaskConical, href: '/docs/notes', tone: 'cyan' },
  { no: '06', title: '自动化工作流', text: '连接工具、数据与判断，持续完成任务。', icon: Workflow, href: '/docs/playbooks', tone: 'amber' },
] as const;

const fieldNotes = [
  ['FIELD NOTE 001', '把 Codex 变成项目里的长期协作者', '/docs/tools'],
  ['FIELD NOTE 002', '从需求到交付：一次完整的 AI 工作流', '/docs/playbooks'],
  ['FIELD NOTE 003', '值得反复使用的提示词与检查清单', '/docs/reference'],
] as const;

export default function HomePage() {
  return (
    <main className="universe-home">
      <HomeMotionController />

      <section className="universe-hero" aria-labelledby="universe-title">
        <div className="universe-aurora" aria-hidden="true" />
        <div className="universe-grid" aria-hidden="true" />
        <KineticKnowledgeScene />
        <div className="universe-hero-inner">
          <div className="universe-hero-meta"><span>AI KNOWLEDGE UNIVERSE</span><span>OPEN / EVOLVING / PRACTICAL</span></div>
          <div className="universe-copy">
            <p className="universe-eyebrow"><i /> 一个持续生长的中文 AI 世界</p>
            <h1 id="universe-title">探索 AI。<br /><em>建立能力。</em></h1>
            <p className="universe-lead">从模型、智能体和创作工具，到真正改变工作方式的系统方法。这里记录 AI 的现在，也为下一步留出空间。</p>
            <div className="universe-actions">
              <Link href="/docs/start-here" prefetch={false} className="universe-primary" data-magnetic>开始探索 <ArrowRight size={18} /></Link>
              <Link href="/docs" prefetch={false} className="universe-secondary">查看知识地图 <Orbit size={17} /></Link>
            </div>
          </div>
          <div className="universe-orbit-copy" aria-hidden="true"><span>MODELS</span><span>AGENTS</span><span>CREATIVE AI</span><span>WORKFLOWS</span></div>
          <div className="universe-scroll-cue"><i /><span>SCROLL TO ENTER</span></div>
        </div>
      </section>

      <div className="signal-ribbon" aria-hidden="true">
        <div><span>MODELS</span><i /> <span>AGENTS</span><i /> <span>CREATIVE AI</span><i /> <span>CODING</span><i /> <span>RESEARCH</span><i /> <span>AUTOMATION</span><i /> <span>MODELS</span><i /> <span>AGENTS</span><i /> <span>CREATIVE AI</span><i /> <span>CODING</span><i /></div>
      </div>

      <section className="universe-index" aria-labelledby="universe-index-title">
        <header className="universe-section-head">
          <p>01 / THE UNIVERSE</p>
          <h2 id="universe-index-title">不只是一套教程。<br />是一张 AI 能力地图。</h2>
          <span>从你正在解决的问题进入，在连接中建立属于自己的方法。</span>
        </header>
        <div className="universe-bento">
          {universe.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} prefetch={false} className={`universe-node node-${item.tone}`} key={item.title}>
                <span>{item.no}</span><Icon /><ArrowUpRight className="node-arrow" />
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
                <i className="node-scan" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="engine-theatre" aria-labelledby="engine-theatre-title">
        <header className="engine-theatre-head">
          <p>02 / LIVE INTERFACE</p>
          <h2 id="engine-theatre-title">阅读之外，<br />直接进入现场。</h2>
          <span>三个实时引擎，三种探索方式。拖动、切换、缩放，每一个动作都会得到回应。</span>
        </header>
        <AiEngineShowcase />
      </section>

      <section className="method-journey" aria-labelledby="method-journey-title">
        <div className="method-copy">
          <p>03 / FROM SIGNAL TO SYSTEM</p>
          <h2 id="method-journey-title">把新鲜感，<br />变成生产力。</h2>
          <span>我们关心的不是工具列表，而是一个人如何从理解、实践到形成稳定系统。</span>
        </div>
        <div className="method-track">
          <div><small>01 / DISCOVER</small><Boxes /><h3>看见可能</h3><p>从真实问题出发，理解 AI 能在哪些环节提供杠杆。</p></div>
          <div><small>02 / PRACTICE</small><Sparkles /><h3>完成一次</h3><p>跟随可执行步骤，在自己的任务里做出真实结果。</p></div>
          <div><small>03 / SYSTEMIZE</small><Workflow /><h3>形成系统</h3><p>留下模板、检查点和复盘，让经验可以持续复用。</p></div>
        </div>
      </section>

      <section className="signal-laboratory" aria-labelledby="signal-lab-title">
        <header>
          <p>04 / LIVING KNOWLEDGE</p>
          <h2 id="signal-lab-title">知识不是目录。<br />它是一张活的网络。</h2>
        </header>
        <div className="signal-stage">
          <div className="signal-graph"><span>DRAG THE NETWORK</span><KnowledgeMapChart /></div>
          <div className="signal-physics"><span>PUSH THE IDEAS</span><PhysicsKnowledgeField /></div>
        </div>
      </section>

      <section className="field-notes" aria-labelledby="field-notes-title">
        <header><p>05 / FIELD NOTES</p><h2 id="field-notes-title">正在发生</h2><Link href="/docs" prefetch={false}>浏览全部 <ArrowRight size={16} /></Link></header>
        <div>
          {fieldNotes.map(([meta, title, href]) => (
            <Link href={href} prefetch={false} key={meta}><small>{meta}</small><h3>{title}</h3><ArrowUpRight /></Link>
          ))}
        </div>
      </section>

      <AuthorContactCard />

      <footer className="universe-footer">
        <div><p>THE NEXT STEP IS YOURS.</p><h2>进入 AI 世界，<br />从一个真实任务开始。</h2><Link href="/docs/start-here" prefetch={false} data-magnetic>开始探索 <ArrowRight /></Link></div>
        <nav><Link href="/docs/tools" prefetch={false}>工具与模型</Link><Link href="/docs/series" prefetch={false}>系列课程</Link><Link href="/docs/playbooks" prefetch={false}>工作流</Link><Link href="/docs/reference" prefetch={false}>参考资料</Link></nav>
        <div className="universe-footer-meta"><span>AI 使用教程 · 丘彬彬</span><span>OPEN SOURCE / 2026</span><a href="https://github.com/90le/ai-tutorials">GITHUB ↗</a></div>
      </footer>
    </main>
  );
}
