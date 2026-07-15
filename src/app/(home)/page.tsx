import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Braces,
  BrainCircuit,
  Clapperboard,
  Code2,
  FlaskConical,
  GraduationCap,
  Orbit,
  Sparkles,
  WandSparkles,
  Workflow,
  Wrench,
} from 'lucide-react';
import { AiEngineShowcase } from '@/components/ai-engine-showcase';
import { AuthorContactCard } from '@/components/author-contact-card';
import { HomeMotionController } from '@/components/home-motion-controller';
import { KineticKnowledgeScene } from '@/components/kinetic-knowledge-scene';

const goals = [
  { title: '学习 AI', text: '从零建立清晰、持续的学习路径。', href: '/docs/start-here', icon: GraduationCap },
  { title: '使用 AI', text: '选对工具，并在真实任务里完成一次。', href: '/docs/tools', icon: Wrench },
  { title: '创作内容', text: '探索图像、视频、声音与新叙事。', href: '/docs/notes', icon: WandSparkles },
  { title: '开发产品', text: '让 AI 成为可靠的工程协作者。', href: '/docs/tools', icon: Code2 },
] as const;

const featured = [
  { meta: 'START HERE / 入门路径', title: '从这里开始：建立 AI 使用路径', text: '用一条清晰路线完成第一次实践，并建立持续学习习惯。', href: '/docs/start-here', tone: 'lime' },
  { meta: 'TOOLS / 工具实践', title: '把 Codex 变成项目里的长期协作者', text: '理解协作边界、项目上下文与可复用的工作方式。', href: '/docs/tools', tone: 'violet' },
  { meta: 'PLAYBOOK / 工作流', title: '从需求到交付：一次完整的 AI 工作流', text: '把提示、执行、检查与复盘连接成可以重复的过程。', href: '/docs/playbooks', tone: 'rose' },
] as const;

const universe = [
  { no: '01', title: '模型与能力', text: '理解模型边界、推理能力与选择方法。', icon: BrainCircuit, href: '/docs/tools', tone: 'blue' },
  { no: '02', title: '智能体', text: '从一次问答走向可持续执行。', icon: Bot, href: '/docs/series', tone: 'lime' },
  { no: '03', title: 'AI 创作', text: '图像、视频、声音与新叙事。', icon: Clapperboard, href: '/docs/notes', tone: 'rose' },
  { no: '04', title: 'AI 开发', text: '可靠的人机工程协作方法。', icon: Braces, href: '/docs/tools', tone: 'violet' },
  { no: '05', title: '研究与实验', text: '追踪前沿，沉淀可复现实验。', icon: FlaskConical, href: '/docs/notes', tone: 'cyan' },
  { no: '06', title: '自动化工作流', text: '连接工具、数据与判断。', icon: Workflow, href: '/docs/playbooks', tone: 'amber' },
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
            <p className="universe-lead">从模型、智能体和创作工具，到真正改变工作方式的系统方法。找到适合自己的入口，然后完成一个真实任务。</p>
            <div className="universe-actions">
              <Link href="/docs/start-here" prefetch={false} className="universe-primary" data-magnetic>开始学习 <ArrowRight size={18} /></Link>
              <Link href="/docs" prefetch={false} className="universe-secondary">浏览全部内容 <Orbit size={17} /></Link>
            </div>
          </div>
          <div className="universe-orbit-copy" aria-hidden="true"><span>MODELS</span><span>AGENTS</span><span>CREATIVE AI</span><span>WORKFLOWS</span></div>
          <div className="universe-scroll-cue"><i /><span>向下探索</span></div>
        </div>
      </section>

      <div className="signal-ribbon" aria-hidden="true">
        <div><span>MODELS</span><i /><span>AGENTS</span><i /><span>CREATIVE AI</span><i /><span>CODING</span><i /><span>RESEARCH</span><i /><span>AUTOMATION</span><i /><span>MODELS</span><i /><span>AGENTS</span><i /><span>CREATIVE AI</span><i /><span>CODING</span><i /></div>
      </div>

      <section className="goal-entry" aria-labelledby="goal-entry-title">
        <header><p>01 / CHOOSE YOUR GOAL</p><h2 id="goal-entry-title">你今天想用 AI<br />完成什么？</h2><span>不用先理解所有工具，从最接近当前任务的方向开始。</span></header>
        <div className="goal-grid">
          {goals.map((goal) => {
            const Icon = goal.icon;
            return <Link href={goal.href} prefetch={false} key={goal.title}><Icon /><div><h3>{goal.title}</h3><p>{goal.text}</p></div><ArrowUpRight /></Link>;
          })}
        </div>
      </section>

      <section className="featured-content" aria-labelledby="featured-title">
        <header><p>02 / RECOMMENDED</p><h2 id="featured-title">从这些内容开始</h2><Link href="/docs" prefetch={false}>浏览全部 <ArrowRight size={16} /></Link></header>
        <div className="featured-grid">
          {featured.map((item) => (
            <Link href={item.href} prefetch={false} className={`featured-card featured-${item.tone}`} key={item.title}>
              <small>{item.meta}</small><h3>{item.title}</h3><p>{item.text}</p><ArrowUpRight />
            </Link>
          ))}
        </div>
        <div className="trust-strip" aria-label="项目与作者信息">
          <strong>丘彬彬创建</strong><span>GitHub 开源</span><span>持续更新</span><span>微信 binStudy</span><span>公众号 彬彬说</span>
        </div>
      </section>

      <section className="universe-index" aria-labelledby="universe-index-title">
        <header className="universe-section-head"><p>03 / AI CAPABILITY MAP</p><h2 id="universe-index-title">一张持续扩展的<br />AI 能力地图</h2><span>六个领域共同构成知识库的长期结构，也会随着 AI 的发展继续生长。</span></header>
        <div className="universe-bento">
          {universe.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} prefetch={false} className={`universe-node node-${item.tone}`} key={item.title}>
                <span>{item.no}</span><Icon /><ArrowUpRight className="node-arrow" />
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="engine-theatre" aria-labelledby="engine-theatre-title">
        <header className="engine-theatre-head"><p>04 / OPTIONAL LAB</p><h2 id="engine-theatre-title">需要时，<br />再启动实时实验。</h2><span>选择一种方式后才加载对应引擎。未选择时，页面保持轻量。</span></header>
        <AiEngineShowcase />
      </section>

      <section className="method-journey" aria-labelledby="method-journey-title">
        <div className="method-copy"><p>05 / FROM SIGNAL TO SYSTEM</p><h2 id="method-journey-title">把新鲜感，<br />变成生产力。</h2><span>从理解、实践到形成稳定系统。</span></div>
        <div className="method-track">
          <div><small>01 / DISCOVER</small><BrainCircuit /><h3>看见可能</h3><p>理解 AI 能在哪些环节提供杠杆。</p></div>
          <div><small>02 / PRACTICE</small><Sparkles /><h3>完成一次</h3><p>在真实任务里做出可以使用的结果。</p></div>
          <div><small>03 / SYSTEMIZE</small><Workflow /><h3>形成系统</h3><p>留下模板、检查点和复盘。</p></div>
        </div>
      </section>

      <AuthorContactCard />

      <section className="field-notes" aria-labelledby="field-notes-title">
        <header><p>06 / FIELD NOTES</p><h2 id="field-notes-title">正在发生</h2><Link href="/docs" prefetch={false}>浏览全部 <ArrowRight size={16} /></Link></header>
        <div>{fieldNotes.map(([meta, title, href]) => <Link href={href} prefetch={false} key={meta}><small>{meta}</small><h3>{title}</h3><ArrowUpRight /></Link>)}</div>
      </section>

      <footer className="universe-footer">
        <div><p>THE NEXT STEP IS YOURS.</p><h2>从一个真实任务开始。</h2><Link href="/docs/start-here" prefetch={false} data-magnetic>开始学习 <ArrowRight /></Link></div>
        <nav><Link href="/docs/tools" prefetch={false}>工具与模型</Link><Link href="/docs/series" prefetch={false}>系列课程</Link><Link href="/docs/playbooks" prefetch={false}>工作流</Link><Link href="/docs/reference" prefetch={false}>参考资料</Link></nav>
        <div className="universe-footer-meta"><span>AI 使用教程 · 丘彬彬</span><span>OPEN SOURCE / 2026</span><a href="https://github.com/90le/ai-tutorials">GITHUB ↗</a></div>
      </footer>
    </main>
  );
}
