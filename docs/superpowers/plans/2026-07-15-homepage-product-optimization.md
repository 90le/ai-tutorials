# Homepage Product Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current AI Knowledge Universe experiment into a faster, clearer, long-lived AI knowledge product homepage without discarding its established brand identity.

**Architecture:** Keep the server-rendered homepage as the navigation and content source of truth. Restrict automatic runtime enhancement to the Three.js hero and lightweight motion controller, while splitting optional engines into user-triggered client modules and using HTML fallbacks for every canvas. Reorganize the homepage around user goals, recommended content, compact capability taxonomy, and earlier trust signals.

**Tech Stack:** Next.js 16 static export, React 19, Fumadocs, TypeScript, CSS, Three.js, GSAP, Lenis, Spline, Rive, MapLibre, ECharts, Matter.js.

## Global Constraints

- Preserve GitHub Pages static export and all existing real routes.
- Do not introduce authentication, private APIs, runtime databases, or fabricated metrics.
- Primary content and navigation must remain usable when JavaScript or an optional engine fails.
- The homepage must not hide semantic content behind scroll-triggered opacity.
- Desktop and 375px mobile must satisfy `scrollWidth === clientWidth`.
- Do not merge to `main`; publish only the current `codex/visual-upgrade` preview branch.

---

### Task 1: Persistent and Accessible Motion Runtime

**Files:**
- Modify: `src/components/home-motion-controller.tsx`
- Modify: `src/components/kinetic-knowledge-scene.tsx`

**Interfaces:**
- Produces: `localStorage['ai-tutorials:motion:v1']` with value `on` or `off`.
- Produces: `document.documentElement.dataset.motion` values `ready`, `disabled`, or `fallback`.
- Consumes: system `prefers-reduced-motion` only when no saved user preference exists.

- [ ] **Step 1: Add a failing static assertion for the missing persisted preference**

Run:

```powershell
rg "ai-tutorials:motion:v1" src/components/home-motion-controller.tsx
```

Expected: no match and exit code 1.

- [ ] **Step 2: Implement lazy initial state and persistence**

Use this state contract in `HomeMotionController`:

```tsx
const MOTION_KEY = 'ai-tutorials:motion:v1';
const [motionEnabled, setMotionEnabled] = useState(() => {
  if (typeof window === 'undefined') return true;
  const saved = window.localStorage.getItem(MOTION_KEY);
  if (saved) return saved === 'on';
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
});

const toggleMotion = () => {
  setMotionEnabled((current) => {
    const next = !current;
    window.localStorage.setItem(MOTION_KEY, next ? 'on' : 'off');
    return next;
  });
};
```

Keep progress tracking active, but create Lenis and GSAP timelines only when motion is enabled.

- [ ] **Step 3: Pause the Three.js render loop while the page is hidden**

Add a `pageVisible` flag and a `visibilitychange` listener. The animation loop must render only when visible and must remove the listener during teardown.

- [ ] **Step 4: Verify the contract**

Run:

```powershell
rg "ai-tutorials:motion:v1|visibilitychange" src/components/home-motion-controller.tsx src/components/kinetic-knowledge-scene.tsx
npm run types:check
```

Expected: both patterns match and TypeScript exits 0.

- [ ] **Step 5: Commit**

```powershell
git add src/components/home-motion-controller.tsx src/components/kinetic-knowledge-scene.tsx
git commit -m "perf: make homepage motion user-controlled"
```

### Task 2: User-Triggered Optional Engines

**Files:**
- Modify: `src/components/ai-engine-showcase.tsx`
- Create: `src/components/engine-stages/spline-stage.tsx`
- Create: `src/components/engine-stages/rive-stage.tsx`
- Create: `src/components/engine-stages/ecosystem-atlas.tsx`
- Modify: `src/app/global.css`

**Interfaces:**
- Produces: `EngineMode = 'space' | 'state' | 'atlas'`.
- Produces: one mounted optional engine at a time, or none before user selection.
- Produces: visible `loading`, `ready`, and `error` panel states.

- [ ] **Step 1: Prove optional engines are currently statically imported**

Run:

```powershell
rg "^import Spline|^import \{ useRive \}" src/components/ai-engine-showcase.tsx
```

Expected: two matches.

- [ ] **Step 2: Extract focused stage components**

Move each engine implementation into its named file. Each file must export a single default component. `spline-stage.tsx` owns the Spline scene, `rive-stage.tsx` owns `useRive`, and `ecosystem-atlas.tsx` owns MapLibre setup and cleanup.

- [ ] **Step 3: Replace static imports with `next/dynamic`**

Use client-only dynamic boundaries:

```tsx
const SplineStage = dynamic(() => import('./engine-stages/spline-stage'), { ssr: false });
const RiveStage = dynamic(() => import('./engine-stages/rive-stage'), { ssr: false });
const EcosystemAtlas = dynamic(() => import('./engine-stages/ecosystem-atlas'), { ssr: false });
```

Initialize `active` as `null`. Render an explanatory empty state until a user selects a mode. Wrap the active stage in an error boundary with a retry action.

- [ ] **Step 4: Add a deterministic lightweight empty state**

The empty state copy must be:

```text
选择一种方式进入 AI 知识现场
三个实验按需启动；未选择时不会加载额外的实时引擎。
```

- [ ] **Step 5: Verify optional imports and build chunks**

Run:

```powershell
rg "^import Spline|^import \{ useRive \}" src/components/ai-engine-showcase.tsx
npm run build
```

Expected: no static import matches and the static build exits 0.

- [ ] **Step 6: Commit**

```powershell
git add src/components/ai-engine-showcase.tsx src/components/engine-stages src/app/global.css
git commit -m "perf: load interactive engines on demand"
```

### Task 3: Product-Led Homepage Information Architecture

**Files:**
- Modify: `src/app/(home)/page.tsx`
- Modify: `src/app/global.css`

**Interfaces:**
- Consumes: existing routes under `/docs/start-here`, `/docs/tools`, `/docs/series`, `/docs/playbooks`, `/docs/notes`, and `/docs/reference`.
- Produces: four user-goal links, three recommended content links, six compact capability links, and an early trust strip.

- [ ] **Step 1: Add four goal entries and three recommended content entries**

Add module-level arrays with these exact labels:

```tsx
const goals = ['学习 AI', '使用 AI', '创作内容', '开发产品'] as const;
const featured = [
  '从这里开始：建立 AI 使用路径',
  '把 Codex 变成项目里的长期协作者',
  '从需求到交付：一次完整的 AI 工作流',
] as const;
```

Each object must include a real `href`, short outcome copy, and an icon from `lucide-react`.

- [ ] **Step 2: Reorder the server-rendered sections**

Use this order:

```text
hero → goal entry → featured content → compact capability map → engine theatre → compact method path → author/trust → field notes → footer
```

Remove the ECharts/Matter paired laboratory from the automatic homepage path. Their concepts remain represented in the optional interactive theatre and documentation.

- [ ] **Step 3: Compact the six capability cards**

Remove the decorative scan rings and large minimum heights. Cards must use a consistent 3-column desktop, 2-column tablet, 1-column phone grid and keep title plus outcome visible without a large empty illustration area.

- [ ] **Step 4: Add an early trust strip**

Place a short strip after featured content containing only verifiable facts:

```text
丘彬彬创建 · GitHub 开源 · 持续更新 · 微信 binStudy · 公众号 彬彬说
```

Do not add numerical counts.

- [ ] **Step 5: Make the mobile headings stable**

At `max-width: 42rem`, limit section headings to `font-size: clamp(2.75rem, 12vw, 4rem)` and `line-height: 0.96`; remove layouts that produce isolated single-character lines.

- [ ] **Step 6: Verify semantic and route coverage**

Run:

```powershell
rg "学习 AI|使用 AI|创作内容|开发产品|丘彬彬创建" 'src/app/(home)/page.tsx'
npm run lint
npm run types:check
```

Expected: all labels match and both commands exit 0.

- [ ] **Step 7: Commit**

```powershell
git add 'src/app/(home)/page.tsx' src/app/global.css
git commit -m "feat: make homepage navigation product-led"
```

### Task 4: Shared Visual Language and Long-Page Rendering

**Files:**
- Modify: `src/app/global.css`
- Modify: `src/lib/layout.shared.tsx`

**Interfaces:**
- Produces: shared brand variables used by homepage, navigation, and docs surfaces.
- Produces: visible focus states for homepage buttons, engine tabs, cards, and document navigation.

- [ ] **Step 1: Consolidate shared brand tokens**

Map `--u-*`, `--space-*`, and `--tutorial-*` aliases back to one root set for background, surface, ink, muted, line, violet, lime, rose, and cyan. Preserve existing light/dark values.

- [ ] **Step 2: Add consistent focus-visible rules**

Use a two-layer focus ring:

```css
.universe-home :where(a, button):focus-visible,
#nd-nav :where(a, button):focus-visible {
  outline: 2px solid var(--brand-focus);
  outline-offset: 3px;
}
```

- [ ] **Step 3: Add long-page rendering containment**

Apply `content-visibility: auto` and a realistic `contain-intrinsic-size` only to offscreen homepage sections, excluding the hero, navigation, author dialog, and fixed controls.

- [ ] **Step 4: Normalize bilingual microcopy**

Keep English technical labels as secondary metadata, but ensure every visible primary action and status has Chinese text. Change the fixed toggle label to `动态 开启` or `动态 暂停`.

- [ ] **Step 5: Verify styles and static build**

Run:

```powershell
rg "focus-visible|content-visibility|动态" src/app/global.css src/components/home-motion-controller.tsx
npm run lint
npm run types:check
npm run build
```

Expected: all patterns match and all commands exit 0.

- [ ] **Step 6: Commit**

```powershell
git add src/app/global.css src/lib/layout.shared.tsx src/components/home-motion-controller.tsx
git commit -m "style: unify homepage and docs experience"
```

### Task 5: Static-Export Browser Verification

**Files:**
- Modify: `design-qa.md`
- Modify: `docs/superpowers/specs/2026-07-15-homepage-product-optimization-design.md` only if implementation differs from the approved contract.

**Interfaces:**
- Consumes: static `out/` output served on port 3002.
- Produces: updated QA evidence and a clean preview commit.

- [ ] **Step 1: Run the fixed verification suite**

```powershell
npm run lint
npm run types:check
npm run build
```

Expected: all exit 0.

- [ ] **Step 2: Verify the static preview**

In the in-app browser, check desktop 1280×720 and phone 375×844. Confirm:

```text
document.documentElement.scrollWidth === document.documentElement.clientWidth
document.documentElement.dataset.motion is ready or disabled
no optional engine canvas exists before user selection
exactly one optional engine stage exists after selection
```

- [ ] **Step 3: Check runtime logs**

Read warning and error logs. Expected: no RSC `.txt` 404, no unhandled exception, and no `Multiple instances of Three.js` before an optional Spline stage is selected.

- [ ] **Step 4: Update QA notes**

Record desktop, phone, motion persistence, optional engine loading, console health, and any documented third-party warning that appears only after explicit engine activation.

- [ ] **Step 5: Commit final verification**

```powershell
git add design-qa.md docs/superpowers/specs/2026-07-15-homepage-product-optimization-design.md
git commit -m "docs: verify homepage product optimization"
```
