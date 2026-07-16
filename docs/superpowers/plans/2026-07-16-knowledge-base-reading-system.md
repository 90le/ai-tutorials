# Knowledge Base Reading System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the six flagship tutorials into editorial long-form articles and replace the filesystem-shaped docs navigation with a stable knowledge-base reading system.

**Architecture:** Keep every public article URL unchanged. Transform the Fumadocs page tree with a pure tested function, add small reusable MDX reading primitives, and inject a client-only TOC header while leaving Fumadocs responsible for active-section tracking. Article-shape tests protect the editorial structure from returning to a repeated SOP template.

**Tech Stack:** Next.js 16, React 19, TypeScript, Fumadocs, MDX, Vitest, CSS.

## Global Constraints

- Preserve the current six public article URLs.
- Keep static export and GitHub Pages compatibility.
- Use the existing brand variables; do not create a second color system.
- Do not add heavy frontend dependencies.
- Each flagship article has 5–7 H2 headings and no page-level “验收清单” or “可验证成果”.

---

### Task 1: Stable knowledge navigation

**Files:**
- Create: `src/lib/docs-navigation.test.ts`
- Create: `src/lib/docs-navigation.ts`
- Modify: `src/app/docs/layout.tsx`

**Interfaces:**
- Consumes: `PageTree.Root` from `fumadocs-core/page-tree`.
- Produces: `buildKnowledgePageTree(root): PageTree.Root`.

- [ ] Write fixture tests that expect `知识库首页`, `开始`, `专题`, `工程`, stable group order, unique URLs, and omission of missing pages.
- [ ] Run `npm test -- src/lib/docs-navigation.test.ts` and verify it fails because `docs-navigation` does not exist.
- [ ] Implement URL lookup and the three fixed folder nodes without changing page URLs.
- [ ] Pass the transformed tree to `DocsLayout` and change `defaultOpenLevel` from `1` to `0`.
- [ ] Run `npm test -- src/lib/docs-navigation.test.ts` and verify all navigation tests pass.

### Task 2: Reading primitives and collapsible TOC

**Files:**
- Create: `src/components/docs/docs-reading-primitives.test.tsx`
- Create: `src/components/docs/copy-text-button.tsx`
- Create: `src/components/docs/prompt-card.tsx`
- Create: `src/components/docs/sources-disclosure.tsx`
- Create: `src/components/docs/docs-toc-header.tsx`
- Modify: `src/components/mdx.tsx`
- Modify: `src/app/docs/[[...slug]]/page.tsx`

**Interfaces:**
- `PromptCard({ title, description?, children })` renders a labelled prompt container and copy action.
- `SourcesDisclosure({ children, label? })` renders a native closed disclosure.
- `DocsTocHeader()` renders the desktop TOC title and persistent collapse button.

- [ ] Write server-render tests for accessible labels, native disclosure markup, and the TOC button's initial expanded state.
- [ ] Run `npm test -- src/components/docs/docs-reading-primitives.test.tsx` and verify it fails because the components do not exist.
- [ ] Implement the three components and a reusable clipboard button with no server dependency.
- [ ] Register `PromptCard` and `SourcesDisclosure` in the MDX component map.
- [ ] Inject `DocsTocHeader` through `DocsPage.tableOfContent.header`.
- [ ] Run the focused test and verify it passes.

### Task 3: Editorial article rewrite

**Files:**
- Create: `src/lib/docs-article-shape.test.ts`
- Modify: `content/docs/start-here/ai-task-operating-system.mdx`
- Modify: `content/docs/tools/chatgpt/deep-research-workflow.mdx`
- Modify: `content/docs/playbooks/ai-second-brain.mdx`
- Modify: `content/docs/tools/codex/agentic-repository-delivery.mdx`
- Modify: `content/docs/reference/agent-ready-toolkit.mdx`
- Modify: `content/docs/playbooks/ai-visual-production.mdx`

**Interfaces:**
- Articles consume the globally registered `PromptCard` and `SourcesDisclosure` components.

- [ ] Write a test that reads all six MDX files and asserts 5–7 H2 headings, no numbered-step sequence, no page-level checklist/result headings, a `PromptCard`, and a `SourcesDisclosure`.
- [ ] Run `npm test -- src/lib/docs-article-shape.test.ts` and verify it fails against the current SOP-shaped articles.
- [ ] Rewrite each article around its approved narrative skeleton, preserving useful facts, examples, links, frontmatter, and explanatory images.
- [ ] Convert natural-language templates to `PromptCard`; keep only real commands/configuration in fenced code blocks with titles.
- [ ] Move sources into `SourcesDisclosure` and run the focused test until it passes.

### Task 4: Unified reading visuals

**Files:**
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Styles consume existing `--brand-*` variables and component class names from Tasks 1–2.

- [ ] Restyle sidebar folder hierarchy, active page, spacing, and collapsed desktop sidebar without changing Fumadocs behavior.
- [ ] Implement TOC expanded/collapsed widths, hide list content only in collapsed state, and widen the article grid.
- [ ] Restyle prose rhythm, code header/copy affordance, prompt cards, disclosures, tables, and blockquotes in light and dark themes.
- [ ] Add responsive rules for 1024px and 390px plus reduced-motion behavior.
- [ ] Run `npm run lint` and correct any component or CSS-linked source issues.

### Task 5: Verification and visual QA

**Files:**
- Modify only files required to fix verified regressions.

**Interfaces:**
- Consumes the complete reading system and emitted static site.

- [ ] Run `npm test`, `npm run lint`, `npm run types:check`, and `npm run build` with zero failures.
- [ ] Inspect 1440px, 1024px, and 390px layouts in the in-app browser.
- [ ] Verify sidebar grouping, current-page state, folder toggles, TOC collapse persistence, code overflow, mobile TOC, theme switching, keyboard focus, and console output.
- [ ] Fix visible regressions and repeat the full command suite.
