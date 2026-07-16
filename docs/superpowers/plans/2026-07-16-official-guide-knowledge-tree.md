# Official Guide Knowledge Tree Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a top-level multi-page “官方指南” knowledge tree that documents and demonstrates every supported Markdown, MDX, media, data, AI interaction, motion and quality capability, then merge and publish only `main`.

**Architecture:** Keep Fumadocs as the shell and express hierarchy through nested `meta.json` files under `content/docs/help/`. Reuse existing reading/media components, add eight focused general-purpose MDX components in `src/components/docs/guide/`, and turn the old experience-lab routes into lightweight migration pages. Heavy renderers remain lazy and the complete regression page links to focused pages instead of mounting every heavyweight demo at once.

**Tech Stack:** Next.js 16 static export, React 19, Fumadocs, MDX, TypeScript, CSS, Vitest, ECharts 6, Mermaid 11, Three.js 0.178.

## Global Constraints

- Preserve GitHub Pages static export compatibility and `/docs/` internal links.
- Do not modify generated `.next/`, `.source/` or `out/` files.
- Every control supports keyboard, visible focus, mobile touch and reduced motion.
- Critical content must have semantic text or table fallback.
- ECharts, Mermaid and Three.js stay dynamically loaded and clean up runtime resources.
- Run focused tests during development and `npm run check` before release.
- Stage only explicit project files; merge and push only after clean verification.

---

### Task 1: Capture architecture, component brief and navigation contract

**Files:**
- Create: `docs/superpowers/specs/2026-07-16-official-guide-knowledge-tree-design.md`
- Create: `docs/component-briefs/official-guide-primitives.md`
- Modify: `src/lib/experience-lab.test.ts`

**Interfaces:**
- Produces the exact `help` tree and eight public component names consumed by later tasks.

- [ ] Add failing assertions that root `meta.json` contains `help`, that all five help subfolders have `meta.json`, and that every planned page path exists.
- [ ] Run `npm test -- src/lib/experience-lab.test.ts`; expect missing `help` paths.
- [ ] Write the component brief with user value, inputs, states, responsive behavior, keyboard, reduced motion, performance and static-export constraints for all eight primitives.
- [ ] Commit the approved spec and plan with `docs: specify official guide knowledge tree`.

### Task 2: Build the top-level official guide tree

**Files:**
- Modify: `content/docs/meta.json`
- Create: `content/docs/help/meta.json`
- Create: `content/docs/help/index.mdx`
- Create: `content/docs/help/{reading-navigation,content-layout,visual-media,ai-interactions,design-quality}/meta.json`

**Interfaces:**
- Produces public `/docs/help/` navigation and five nested categories.

- [ ] Create the root and nested metadata in the approved order.
- [ ] Add a guide landing page with category summaries, selection guidance and links.
- [ ] Run the focused navigation/content test until it passes.
- [ ] Commit with `docs: add official guide knowledge tree`.

### Task 3: Add eight reusable guide primitives

**Files:**
- Create: `src/components/docs/guide/metric-board.tsx`
- Create: `src/components/docs/guide/narrative-timeline.tsx`
- Create: `src/components/docs/guide/comparison-matrix.tsx`
- Create: `src/components/docs/guide/decision-tree-explorer.tsx`
- Create: `src/components/docs/guide/annotated-image.tsx`
- Create: `src/components/docs/guide/glossary-grid.tsx`
- Create: `src/components/docs/guide/citation-cluster.tsx`
- Create: `src/components/docs/guide/reveal-sequence.tsx`
- Create: `src/components/docs/guide/guide-primitives.test.tsx`
- Modify: `src/components/mdx.tsx`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Produces `MetricBoard`, `NarrativeTimeline`, `ComparisonMatrix`, `DecisionTreeExplorer`, `AnnotatedImage`, `GlossaryGrid`, `CitationCluster`, and `RevealSequence` as global MDX components.

- [ ] Write a failing static-render test that imports and renders all eight names, asserting semantic headings, tables/lists, labelled controls and fallback content.
- [ ] Run `npm test -- src/components/docs/guide/guide-primitives.test.tsx`; expect missing modules.
- [ ] Implement the eight components with local deterministic data, native buttons/ranges, no new dependencies and shared Fumadocs tokens.
- [ ] Register all eight in `src/components/mdx.tsx`; add responsive and reduced-motion CSS.
- [ ] Run focused tests, lint and types; commit with `feat: add official guide content primitives`.

### Task 4: Publish reading, Markdown and structured-content guides

**Files:**
- Create: `content/docs/help/reading-navigation/using-the-knowledge-base.mdx`
- Create: `content/docs/help/reading-navigation/search-toc-reading-tools.mdx`
- Create: `content/docs/help/content-layout/markdown-complete-reference.mdx`
- Create: `content/docs/help/content-layout/structured-content-components.mdx`
- Create: `content/docs/help/content-layout/code-formula-table-assets.mdx`

**Interfaces:**
- Consumes existing Fumadocs primitives, `DocsCodeBlock`, `FormulaBlock`, `DataTable`, `DownloadCard`, and new guide primitives.

- [ ] Extend the failing content test with the five routes and required Markdown/MDX markers.
- [ ] Write each page using the common template: use case, live examples, recommended boundary, copyable source, responsive/accessibility/performance notes and related links.
- [ ] Ensure the Markdown reference covers H2–H6, emphasis, deletion, mark, links, lists, tasks, quotes, divider, footnotes, abbreviation, sub/sup, kbd, math, code, tables and details.
- [ ] Run content verification and commit with `docs: add official content and reading guides`.

### Task 5: Publish visualization and rich-media guides

**Files:**
- Create: `content/docs/help/visual-media/mermaid-infinite-canvas.mdx`
- Create: `content/docs/help/visual-media/data-charts-visualization.mdx`
- Create: `content/docs/help/visual-media/images-gallery-video-annotation.mdx`
- Modify: `src/components/docs/source-mix-chart.tsx`
- Create: `src/components/docs/source-mix-chart.test.ts`
- Modify: `src/app/docs/docs-theme.css`
- Modify: `src/components/docs/docs-responsive-css.test.ts`

**Interfaces:**
- Consumes Mermaid, ChartFrame, DataTable, image/video/lightbox and AnnotatedImage.
- Fixes full-screen ECharts SVG scoping and exposes narrow-safe `getSourceMixSeries()`.

- [ ] Keep the existing red/green regressions for dialog SVG scoping and pie-label geometry.
- [ ] Write the three rich pages with multiple live examples and canvas interaction instructions.
- [ ] Run focused chart, CSS and content tests; rebuild static output and verify full-screen chart dimensions in the in-app browser.
- [ ] Commit with `fix: restore full screen chart rendering`.

### Task 6: Publish AI interaction guides

**Files:**
- Create: `content/docs/help/ai-interactions/agents-tool-calls.mdx`
- Create: `content/docs/help/ai-interactions/prompts-context-retrieval.mdx`
- Create: `content/docs/help/ai-interactions/models-cost-evidence-3d.mdx`

**Interfaces:**
- Consumes the twelve globally registered experience-lab components and links to focused media/data guides.

- [ ] Add failing route and component-marker assertions for all three pages and all twelve AI components.
- [ ] Write focused pages with explanatory prose, interactive controls, static interpretation, failure states and copyable MDX.
- [ ] Run focused tests and commit with `docs: add official ai interaction guides`.

### Task 7: Publish design, quality, selection and regression guides

**Files:**
- Create: `content/docs/help/design-quality/themes-motion-effects.mdx`
- Create: `content/docs/help/design-quality/mobile-accessibility-print.mdx`
- Create: `content/docs/help/design-quality/component-selection-guide.mdx`
- Create: `content/docs/help/design-quality/complete-regression-check.mdx`
- Modify: `docs/component-catalog.md`
- Modify: `docs/rendering-capability-matrix.md`

**Interfaces:**
- Produces the authoritative component decision table and focused regression route.

- [ ] Add failing checks for the four routes, all 51 component/semantic capabilities and regression sections.
- [ ] Write the four pages with theme states, motion examples, accessibility criteria, decision trees and release checklist.
- [ ] Update catalog and capability matrix to point at focused official-guide routes.
- [ ] Run focused tests and commit with `docs: add official design and quality guides`.

### Task 8: Migrate the old experience lab without duplication

**Files:**
- Modify: `content/docs/reference/meta.json`
- Modify: `content/docs/reference/experience-lab/index.mdx`
- Modify: `content/docs/reference/experience-lab/{complete-showcase,ai-workbenches,infinite-canvas,quality-matrix}.mdx`
- Modify: `content/docs/reference/experience-lab/meta.json`

**Interfaces:**
- Keeps legacy routes readable while removing them from the active left tree.

- [ ] Add failing tests that reference meta excludes `experience-lab` and legacy pages link to their new canonical official-guide routes.
- [ ] Replace legacy bodies with concise migration notices and canonical links; do not duplicate examples.
- [ ] Run content/link tests and commit with `docs: migrate rendering lab to official guides`.

### Task 9: Full validation, merge, publish and cleanup

**Files:**
- Create: `docs/qa/2026-07-16-official-guide-release.md`
- Create: `docs/releases/2026-07-16-official-guide.md`

**Interfaces:**
- Produces a verified `main`, successful Pages deployment and no non-main branches.

- [ ] Run `npm run check` and `git diff --check`; resolve every failure and rerun from the start.
- [ ] In the in-app browser verify guide tree navigation, representative pages, full-screen chart, desktop/mobile, both themes, reduced motion, keyboard and zero horizontal overflow/error overlays.
- [ ] Record exact commands, routes, browser states, limitations and commit in the QA/release reports.
- [ ] Commit all scoped changes, switch to `main`, pull fast-forward, merge the feature branch and rerun `npm run check` on merged `main`.
- [ ] Push `main`, monitor GitHub Actions/Pages to success, then delete every local and remote branch except `main`.

