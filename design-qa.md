# Design QA — AI Tutorials Visual Upgrade

## Comparison target

- Source visual truth: `design-evidence/selected-direction.png` (the selected third visual direction from the companion).
- Implementation: `design-evidence/home-desktop-final.png` (browser-rendered static homepage at `http://localhost:3002/?v=2`).
- Comparison view: `design-evidence/compare.html`, served locally at desktop width.
- Desktop viewport: browser default 1265 × 709.
- Mobile viewport: 390 × 844.

## Evidence and interaction checks

- Desktop homepage: hero hierarchy, two primary actions, all six learning links, and the author area render in the static export.
- Desktop author control: the WeChat trigger opens a labelled QR dialog; its close control removes the dialog.
- Mobile author control: the official-account trigger opens a readable full-width QR dialog at 390 × 844; the QR image is visible at its original aspect ratio.
- Docs route: `http://localhost:3002/docs/start-here/` exposes the updated title/action hierarchy and readable article content.
- Console check: the static export had no application error overlay. The Next development server reports a pre-existing Fumadocs script-tag development-overlay error; it does not occur in the static build used for final verification.

## Required fidelity surfaces

- Fonts and typography: implementation uses the site’s Inter-based global font and increases the hero, section, and document heading hierarchy. The companion source has different mock typography; this is an acceptable constraint because no new font dependency was added.
- Spacing and layout rhythm: implementation preserves the selected direction’s generous hero spacing, large headline, compact navigation, and grouped learning routes. Card density is intentionally lower to serve the real six-route information architecture.
- Colors and tokens: violet is the primary action and focus color; pale lavender, peach, and mint distinguish primary routes. The source’s decorative gradient is intentionally omitted because the project has no approved raster brand asset and the site should not replace artwork with CSS-drawn imagery.
- Image quality and asset fidelity: both supplied QR images are static original-ratio images in `public/images/site/`; the previous `next/image` static-export failure was fixed by serving the files directly.
- Copy and content: author identity, WeChat `binStudy`, and公众号“彬彬说” are present; the navigation-facing label for `notes` is “灵感与实验” while its route remains unchanged.

## Findings

- [Resolved P1] QR images did not display in the static preview because optimized `next/image` URLs require a runtime image endpoint.
  - Fix: replaced `next/image` with standard static `<img>` elements, retaining dimensions and meaningful alt text.
  - Post-fix evidence: mobile official-account dialog shows the QR image at 390 × 844.

## Follow-up polish

- [P3] If a brand illustration is later approved, add it as a real raster asset to the hero instead of using code-drawn decoration.

## Implementation checklist

- [x] Static QR assets copied with meaningful paths and alternative text.
- [x] Keyboard/click-accessible QR dialog implemented with Escape and explicit close controls.
- [x] Homepage regrouped into primary and secondary learning paths.
- [x] Documentation header and prose styling updated without content-route changes.
- [x] Desktop, mobile, and document-route browser checks completed.

final result: passed
