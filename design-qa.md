# Design QA — AI Tutorials Visual Upgrade

## Comparison target

- Source visual truth: `design-evidence/selected-direction.png` (the selected third visual direction from the companion).
- Implementation: browser-rendered static homepage at `http://localhost:3002/?v=7`.
- Comparison view: `design-evidence/compare.html`, served locally at desktop width.
- Desktop viewport: 1440 × 900, with separate first-, middle-, and lower-page inspections.
- Mobile viewport: 390 × 844.

## Evidence and interaction checks

- Desktop homepage: hero hierarchy, two primary actions, all six learning links, and the author area render in the static export.
- Full-page continuity: ambient color fields, the primary-route band, three-node learning bridge, practice surface, open exploration rail, dark topic marquee, and author surface form one continuous visual sequence.
- Motion: learning cards, ambient fields, and topic marquee animate without blocking interaction; reduced-motion rules collapse all animations to a single near-instant iteration.
- Desktop author control: the WeChat trigger opens a labelled QR dialog; its close control removes the dialog.
- Mobile author control: the official-account trigger opens a readable full-width QR dialog at 390 × 844; the QR image is visible at its original aspect ratio.
- Docs route: `http://localhost:3002/docs/start-here/` exposes the updated title/action hierarchy and readable article content.
- Console check: the static export had no application error overlay. The Next development server reports a pre-existing Fumadocs script-tag development-overlay error; it does not occur in the static build used for final verification.

## Required fidelity surfaces

- Fonts and typography: implementation uses the site’s Inter-based global font and increases the hero, section, and document heading hierarchy. The companion source has different mock typography; this is an acceptable constraint because no new font dependency was added.
- Spacing and layout rhythm: implementation preserves the selected direction’s generous hero spacing, large headline, compact navigation, and grouped learning routes. Card density is intentionally lower to serve the real six-route information architecture.
- Colors and tokens: violet is the primary action and focus color; pale lavender, peach, and mint distinguish primary routes. Atmospheric gradients are limited to background light, section transitions, and surface depth; they do not replace content imagery or simulate a hero illustration.
- Image quality and asset fidelity: both supplied QR images are static original-ratio images in `public/images/site/`; the previous `next/image` static-export failure was fixed by serving the files directly.
- Copy and content: author identity, WeChat `binStudy`, and公众号“彬彬说” are present; the navigation-facing label for `notes` is “灵感与实验” while its route remains unchanged.

## Findings

- [Resolved P1] QR images did not display in the static preview because optimized `next/image` URLs require a runtime image endpoint.
  - Fix: replaced `next/image` with standard static `<img>` elements, retaining dimensions and meaningful alt text.
  - Post-fix evidence: mobile official-account dialog shows the QR image at 390 × 844.

- [Resolved P1] The homepage previously read as isolated content cards on a mostly empty white canvas.
  - Fix: added a page-level atmospheric layer, varied section containers, a real learning-path connector, a full-width moving topic rail, and a visually integrated author ending.
  - Post-fix evidence: 1440 × 900 inspection shows visible continuity at the hero, route/practice transition, exploration/marquee transition, and author section.

- [Resolved P2] The two-column hero remained cramped at tablet widths.
  - Fix: moved the stacked responsive breakpoint to 64rem and provided a dedicated 36rem learning-path arrangement.
  - Post-fix evidence: 390 × 844 render has no horizontal overflow (`scrollWidth === clientWidth`) and retains all hero content.

## Fidelity ledger

- Typography: retained the selected third direction’s large, compressed headline energy while preserving the repository font stack.
- First viewport: retained one dominant statement, two clear actions, and one learning-path visual; no unrelated copy was added.
- Palette: violet remains dominant, with peach and mint acting as supporting route colors rather than separate themes.
- Container model: the hero and practice areas are framed; exploration is an open rail; the topic strip is full bleed; repeated rounded-card grids were reduced.
- Responsive behavior: desktop, 64rem stack behavior, and 390 × 844 mobile flow were checked; no clipping or horizontal overflow remains.
- Interaction: route cards and marquee labels remain real links; duplicate marquee content is removed from keyboard navigation and accessibility reading order.
- Intentional deviation: the selected concept’s abstract gradient corner artwork is represented as subtle page atmosphere instead of a central image asset, keeping the real tutorial navigation as the visual focus.

## Implementation checklist

- [x] Static QR assets copied with meaningful paths and alternative text.
- [x] Keyboard/click-accessible QR dialog implemented with Escape and explicit close controls.
- [x] Homepage regrouped into primary and secondary learning paths.
- [x] Documentation header and prose styling updated without content-route changes.
- [x] Desktop, mobile, and document-route browser checks completed.
- [x] Full-page background continuity and section transitions completed.
- [x] Desktop 1440 × 900 and mobile 390 × 844 rechecked after the final visual pass.
- [x] No browser console warnings or errors in the static preview.

final result: passed
