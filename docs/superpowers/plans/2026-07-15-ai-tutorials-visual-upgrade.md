# AI Tutorials Visual Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the selected Signal & Exploration visual system across the homepage and documentation reading surface, including an accessible author QR contact experience.

**Architecture:** Keep Fumadocs layouts and document URLs unchanged. Add composable homepage and author-contact components, use CSS custom properties for the visual system, and keep QR assets under `public/images/site/` so the exported site does not require runtime services.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Fumadocs, lucide-react.

## Global Constraints

- Do not move or edit published tutorial content in `content/docs/`.
- Preserve static export compatibility; no backend, login, remote scripts, or runtime private APIs.
- Use `lucide-react` for interface icons; do not add dependencies.
- Save the supplied QR images as `public/images/site/wechat-bin-study.jpg` and `public/images/site/wechat-official-binbinshuo.jpg`.
- Keyboard focus and touch interaction must provide the same QR access as hover.
- Validate with `npm run lint`, `npm run types:check`, `npm run build`, and browser smoke checks at desktop and mobile widths.

---

### Task 1: Add stable author-contact content and assets

**Files:**
- Create: `public/images/site/wechat-bin-study.jpg`
- Create: `public/images/site/wechat-official-binbinshuo.jpg`
- Create: `src/lib/site-content.ts`

**Interfaces:**
- Produces: `authorContacts`, an immutable array of `{ id: 'wechat' | 'official'; label: string; handle: string; imageSrc: string; imageAlt: string }`.
- Consumes: the two user-supplied source image files.

- [ ] **Step 1: Add a failing source contract test plan**

The repository has no automated test runner and adding a runner violates the no-dependency constraint. Treat TypeScript compilation as the contract check for `authorContacts`: it must be imported by the component in Task 2 and fail type-checking if a required field is missing.

- [ ] **Step 2: Copy the exact QR assets into the static public directory**

Copy the supplied WeChat QR image and the supplied official-account QR image without cropping, recompressing, or filtering.

- [ ] **Step 3: Create typed contact data**

```ts
export const authorContacts = [
  {
    id: 'wechat',
    label: '添加微信',
    handle: 'binStudy',
    imageSrc: '/images/site/wechat-bin-study.jpg',
    imageAlt: '丘彬彬的微信二维码，微信号 binStudy',
  },
] as const;
```

- [ ] **Step 4: Verify the data contract**

Run: `npm run types:check`

Expected: exit code 0.

### Task 2: Build the accessible author-contact card

**Files:**
- Create: `src/components/author-contact-card.tsx`
- Modify: `src/app/global.css`

**Interfaces:**
- Consumes: `authorContacts` from `@/lib/site-content`.
- Produces: `<AuthorContactCard />`, a client component for homepage use.

- [ ] **Step 1: Define the interaction contract before component code**

The card must show one QR preview on desktop hover/focus; touch and click must open a dialog; Escape and the explicit close button must close it; the dialog must have an accessible label and return focus to the trigger.

- [ ] **Step 2: Implement the component with native button semantics**

Use `useState` for the active contact and `useRef` for focus return. Render QR thumbnails through `next/image` with explicit dimensions and include visible “添加微信” and “关注公众号” controls.

- [ ] **Step 3: Add component-scoped global styles**

Add `author-contact-*` classes with high-contrast focus rings, reduced-motion support, and a mobile media query that converts the preview into a full dialog.

- [ ] **Step 4: Verify type and lint contracts**

Run: `npm run lint && npm run types:check`

Expected: exit code 0.

### Task 3: Recompose the homepage around learning entry points

**Files:**
- Create: `src/components/learning-entry-card.tsx`
- Modify: `src/app/(home)/page.tsx`

**Interfaces:**
- Produces: `<LearningEntryCard title description href priority />`.
- Consumes: `AuthorContactCard` and Next `Link`.

- [ ] **Step 1: Define the visible content order**

The primary row is “从这里开始、工具教程、场景打法”; secondary cards are “系列课程、灵感与实验、参考资料”; “全部文档” remains a quiet text link.

- [ ] **Step 2: Implement the reusable entry card**

Use semantic heading and link markup. `priority` only changes class names for visual emphasis; it does not change URL behavior.

- [ ] **Step 3: Implement the homepage sections**

Create hero, primary learning routes, secondary exploration routes, and author-contact sections. Preserve all existing routes and revise only the label “单篇笔记” to “灵感与实验”.

- [ ] **Step 4: Verify static rendering**

Run: `npm run build`

Expected: `/` is listed as a static route and exit code is 0.

### Task 4: Apply the shared reading visual system

**Files:**
- Modify: `src/app/global.css`
- Modify: `src/app/docs/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: Fumadocs `DocsPage`, `DocsBody`, `DocsTitle`, and `DocsDescription`.
- Produces: visual-only hooks `docs-page-header` and `docs-page-actions` without altering page data or generated routes.

- [ ] **Step 1: Define visual tokens**

Add CSS variables for `--tutorial-ink`, `--tutorial-muted`, `--tutorial-surface`, `--tutorial-accent`, and `--tutorial-accent-soft`; include a dark-mode override based on Fumadocs theme attributes.

- [ ] **Step 2: Style long-form reading elements**

Scope headline, prose width, headings, links, code, tables, blockquotes, focus rings, and selection color to docs surfaces; do not change raw MDX output semantics.

- [ ] **Step 3: Add minimal document-page hooks**

Wrap the title/description and action row in named class containers so the CSS can improve hierarchy without changing the Fumadocs layout structure.

- [ ] **Step 4: Verify all project checks**

Run: `npm run lint && npm run types:check && npm run build`

Expected: all commands exit 0.

### Task 5: Browser verification and handoff

**Files:**
- Create: `design-qa.md`

**Interfaces:**
- Consumes: a local desktop screenshot and a local mobile screenshot of the homepage, plus a desktop screenshot of a docs page.
- Produces: `design-qa.md` with `final result: passed` or `final result: blocked`.

- [ ] **Step 1: Run the development server**

Run: `npm run dev` from the isolated worktree.

- [ ] **Step 2: Verify desktop homepage**

At desktop width, check the hero hierarchy, learning-card links, author trigger, QR preview, dialog close action, and keyboard focus visibility.

- [ ] **Step 3: Verify mobile homepage and a docs page**

At mobile width, check that the author dialog remains readable and closes; on a docs route, check the reading width, action bar, code block, and table styling.

- [ ] **Step 4: Write the QA result**

Record checked routes, viewports, interaction results, console status, remaining P3 notes if any, and end with `final result: passed` only when no P0–P2 issues remain.

- [ ] **Step 5: Run final checks and inspect changes**

Run: `npm run lint && npm run types:check && npm run build && git diff --check && git status --short`

Expected: checks exit 0 and the diff contains only planned files.
