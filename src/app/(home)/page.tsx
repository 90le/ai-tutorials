import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-10 px-6 py-20">
      <section className="space-y-5">
        <p className="text-sm font-medium text-fd-muted-foreground">公开 AI 知识库</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">把 AI 用到真实工作里。</h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          系统学习 AI 工具、工作流与实践方法。每一篇教程都可独立阅读，也能沿着合集逐步完成学习。
        </p>
        <Link href="/docs/start-here" className="inline-flex font-medium underline underline-offset-4">
          从这里开始 →
        </Link>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['工具教程', 'Codex、Claude、Cursor 等工具的上手与进阶。', '/docs/tools'],
          ['系列课程', '围绕一个目标连续学习的完整教程合集。', '/docs/series'],
          ['场景打法', '写作、开发、研究与自动化的可复用工作流。', '/docs/playbooks'],
          ['单篇笔记', '短教程、技巧、实验与值得保留的经验。', '/docs/notes'],
          ['参考资料', '提示词、模板、术语与常见问题。', '/docs/reference'],
          ['全部文档', '浏览完整目录，或使用站内搜索。', '/docs'],
        ].map(([title, description, href]) => (
          <Link key={href} href={href} className="rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-fd-muted-foreground">{description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
