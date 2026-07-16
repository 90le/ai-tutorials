# Adaptive Reading Canvas Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver responsive document rails, a reusable pan/zoom canvas, a React-native code block toolbar, and four public lab pages containing twelve AI-focused original components.

**Architecture:** Keep Fumadocs as the document shell. CSS state selectors expose prose/wide/full tracks; `PanZoomCanvas` owns all 2D viewer interactions; `DocsCodeBlock` composes Fumadocs CodeBlock APIs; original lab components share a small set of React, ECharts, GSAP and Three.js primitives with static fallbacks.

**Tech Stack:** Next.js 16 static export, React 19, Fumadocs, TypeScript, CSS, Vitest, ECharts 6, GSAP 3, Three.js 0.178.

## Global Constraints

- Preserve GitHub Pages static export compatibility.
- Prose stays at `46rem`; wide/full tracks alone consume released sidebar space.
- No runtime private APIs, login state, cookies or server-only data.
- ECharts and Three.js are dynamically imported and cleaned up.
- One active WebGL context maximum per page.
- Every interactive component has semantic static content and reduced-motion behavior.
- Run focused tests after every task and `npm run check` before completion.

---

### Task 1: Adaptive document rails

**Files:**
- Modify: `src/app/docs/docs-theme.css`
- Modify: `src/components/docs/docs-responsive-css.test.ts`
- Modify: `src/components/docs/docs-toc-header.tsx`

**Interfaces:**
- Consumes: Fumadocs `#nd-docs-layout[data-sidebar-collapsed]`, `#nd-page`, `#nd-toc`.
- Produces: CSS variables `--docs-page-max`, named `prose`, `wide`, `full` tracks.

- [ ] Add failing CSS assertions for zero-width collapsed columns, three page maxima, and named grid tracks.
- [ ] Run `npm test -- src/components/docs/docs-responsive-css.test.ts`; expect the new assertions to fail.
- [ ] Add state-based layout variables and replace symmetric negative bleed with grid-column placement.
- [ ] Add a state/label test for `DocsTocHeader` and correct any collapsed control mismatch.
- [ ] Run focused tests and commit with `feat: make docs rails sidebar aware`.

### Task 2: Reusable pan and zoom canvas

**Files:**
- Create: `src/components/docs/pan-zoom-canvas.tsx`
- Create: `src/components/docs/pan-zoom-canvas.test.tsx`
- Modify: `src/lib/viewer-state.ts`
- Modify: `src/lib/viewer-state.test.ts`
- Modify: `src/components/docs/diagram-viewer.tsx`
- Modify: `src/components/docs/lightbox-viewer.tsx`
- Modify: `src/components/docs/reading-tools.test.tsx`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Produces: `CanvasTransform`, `canvasReducer`, `fitTransform()`, `zoomAtPoint()`, and `<PanZoomCanvas>`.
- Consumes: a labelled React child and optional `minScale`, `maxScale`.

- [ ] Add failing reducer tests for cursor-centred zoom, pan, fit, reset and scale clamping.
- [ ] Run `npm test -- src/lib/viewer-state.test.ts`; expect missing actions/helpers.
- [ ] Implement pure transform helpers and make reducer tests pass.
- [ ] Add failing markup tests for keyboard help, draggable stage and full viewport dialog.
- [ ] Implement pointer capture, wheel, keyboard, ResizeObserver fit and focus restoration in `PanZoomCanvas`.
- [ ] Replace DiagramViewer and LightboxViewer scale-only wrappers with the shared canvas.
- [ ] Run focused tests and commit with `feat: add pan zoom document canvas`.

### Task 3: React-native code block

**Files:**
- Create: `src/components/docs/docs-code-block.tsx`
- Create: `src/components/docs/docs-code-block.test.tsx`
- Modify: `src/components/mdx.tsx`
- Modify: `src/components/docs/mdx-registry.test.tsx`
- Modify: `src/app/docs/[[...slug]]/page.tsx`
- Delete: `src/components/docs/code-block-enhancer.tsx`
- Modify: `src/components/docs/reading-tools.test.tsx`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Produces: `<DocsCodeBlock>` compatible with Fumadocs `pre` MDX props.
- Uses: Fumadocs `CodeBlock`, `Pre`, `Actions` and built-in copy child.

- [ ] Add failing render tests for title/language, wrap, line-number, expand and copy controls.
- [ ] Run focused test and confirm the missing component failure.
- [ ] Implement `DocsCodeBlock` with React state and a dedicated responsive toolbar.
- [ ] Register it as the global MDX `pre` renderer and remove `CodeBlockEnhancer` from the page.
- [ ] Update CSS for sticky header, edge fade, visible scroll region and mobile overflow menu.
- [ ] Run focused tests and commit with `feat: replace code block dom enhancer`.

### Task 4: Original component foundations

**Files:**
- Create: `src/components/docs/experience-lab/lab-shell.tsx`
- Create: `src/components/docs/experience-lab/interactive-timeline.tsx`
- Create: `src/components/docs/experience-lab/metric-control.tsx`
- Create: `src/components/docs/experience-lab/graph-visual.tsx`
- Create: `src/components/docs/experience-lab/original-components.test.tsx`
- Modify: `src/app/docs/docs-theme.css`

**Interfaces:**
- Produces: consistent title/status/fallback shell; play/pause/seek timeline; labelled range control; lazy ECharts graph wrapper.

- [ ] Add failing semantic render tests for status, controls, fallback table and reduced-motion copy.
- [ ] Implement foundations without importing ECharts/GSAP during server render.
- [ ] Test dynamic-load fallback and cleanup markers.
- [ ] Commit with `feat: add interactive lab foundations`.

### Task 5: AI workbench and data components

**Files:**
- Create: `src/components/docs/experience-lab/ai-workbench.tsx`
- Create: `src/components/docs/experience-lab/data-model-visuals.tsx`
- Create: `src/components/docs/experience-lab/semantic-space.tsx`
- Create: `src/components/docs/experience-lab/lab-data.ts`
- Modify: `src/components/mdx.tsx`
- Modify: `src/components/docs/mdx-registry.test.tsx`

**Interfaces:**
- Produces twelve exported MDX components: `AgentFlowStudio`, `PromptDiffLab`, `ContextBudgetComposer`, `RetrievalExplorer`, `ToolCallTrace`, `MultiAgentOrchestration`, `ModelTradeoffMatrix`, `CostLatencySimulator`, `EvidenceNetwork`, `SemanticSpace3D`, `StreamingResponseTimeline`, `FailureStateGallery`.

- [ ] Add failing registry and static-fallback tests for all twelve names.
- [ ] Implement six AI workbench components using shared foundations and deterministic local data.
- [ ] Implement four data/model components using lazy ECharts.
- [ ] Implement SemanticSpace3D with lazy Three.js, visibility pause and disposal.
- [ ] Implement timeline and failure-state gallery with reduced/off behavior.
- [ ] Run focused tests and commit with `feat: add ai interaction lab components`.

### Task 6: Public lab pages and navigation

**Files:**
- Create: `content/docs/reference/experience-lab/canvas-viewers.mdx`
- Create: `content/docs/reference/experience-lab/ai-workbench.mdx`
- Create: `content/docs/reference/experience-lab/data-model-visuals.mdx`
- Create: `content/docs/reference/experience-lab/motion-states.mdx`
- Modify: `content/docs/reference/experience-lab/index.mdx`
- Modify: `content/docs/reference/experience-lab/meta.json`
- Modify: `content/docs/reference/experience-lab/complete-showcase.mdx`
- Modify: `docs/component-catalog.md`
- Modify: `docs/rendering-capability-matrix.md`
- Modify: `src/lib/experience-lab.test.ts`

**Interfaces:**
- Consumes: globally registered MDX components from Task 5.
- Produces: four public routes and knowledge-tree entries.

- [ ] Add failing content assertions for four routes, twelve components and navigation order.
- [ ] Add the pages with real explanations, controls, fallbacks and acceptance notes.
- [ ] Update the index, catalog and matrix; keep complete-showcase as the baseline regression page.
- [ ] Run content tests and commit with `docs: expand rendering interaction lab`.

### Task 7: Performance, accessibility and release QA

**Files:**
- Create: `docs/qa/2026-07-16-adaptive-reading-canvas-lab.md`
- Modify: tests discovered during browser QA only when they reproduce a defect.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: release evidence and a clean feature branch.

- [ ] Run `npm run check`; fix every failure and rerun until exit 0.
- [ ] Verify 390, 768, 1280, 1600 and 2048px with both themes and all sidebar combinations.
- [ ] Verify mouse drag, cursor wheel zoom, keyboard pan/zoom/fit, touch-sized controls, focus return and reduced-motion.
- [ ] Verify all public routes/resources return 200 and console has no errors.
- [ ] Record before/after measurements, known limits and performance behavior in the QA report.
- [ ] Commit with `test: verify adaptive reading canvas lab`.
