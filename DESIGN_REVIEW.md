# Design Review: YLZ Portfolio Refinement

Reviewed against: the user's preservation brief in the current Codex task

Mode: Experience / incremental refinement

Date: 2026-10-29

## Screenshots Captured

| Screenshot | Breakpoint | Description |
| --- | --- | --- |
| `screenshots/before-intro-desktop-1280.png` | Desktop 1280×800 | Existing opening composition |
| `screenshots/before-directory-desktop-1280.png` | Desktop 1280×800 | Existing project directory |
| `screenshots/before-project-desktop-1280.png` | Desktop 1280×800 | Existing project detail |
| `screenshots/before-card-desktop-1280.png` | Desktop 1280×800 | Existing project card |
| `screenshots/before-project-tablet-768.png` | Tablet 768×1024 | Existing responsive state |
| `screenshots/before-project-mobile-375.png` | Mobile 375×812 | Existing mobile project detail |
| `screenshots/after-project-desktop-1280.png` | Desktop 1280×800 | Refined project detail |
| `screenshots/after-project-tablet-768.png` | Tablet 768×1024 | Refined tablet project detail |
| `screenshots/after-project-mobile-375.png` | Mobile 375×812 | Refined mobile project detail |
| `screenshots/verify-motion-early.png` | Desktop 1280×800 | Project entrance transition in progress |
| `screenshots/verify-motion-settled.png` | Desktop 1280×800 | Project entrance transition complete |

## Summary

The existing portfolio has a strong and recognizable visual identity: the star field, character imagery, luminous cursor, project image stack, folder interaction, grain background, particles, and sling button already form a coherent authored world. The refinement therefore preserves those systems and concentrates on typography consistency, transition continuity, and ordinary control feedback.

## Changes Completed

1. **Chinese narrative typography** — project descriptions now use the already bundled LXGW WenKai webfont with a softer weight, more comfortable leading, and restrained tracking. Display titles and English metadata remain unchanged.
2. **Directory-to-project continuity** — entering a project now introduces the copy, image stack, and folder in one short, staggered sequence. Existing hover, drag, spotlight, tilt, folder, particle, and sling animations remain unchanged.
3. **Control feedback** — ordinary buttons receive a subtle press state, visible keyboard focus, and a restrained gradient underline on the two text navigation controls.
4. **Rendering details** — root font smoothing, text selection styling, pretty wrapping, and tabular project dates were added without changing layout dimensions.

## Verification

- JavaScript syntax checked with `node --check`.
- The bundled font resolved to `LXGW WenKai` in the browser.
- The project entrance resolved to `project-copy-arrive` during normal motion.
- With `prefers-reduced-motion: reduce`, the project entrance animation resolved to `none`.
- Desktop, tablet, and mobile screenshots were visually compared; no new overflow or overlap was observed.

## Verdict

Approve. The refinement preserves the incumbent visual world and adds only scoped typographic and interaction polish.

---

## Performance and Accessibility Follow-up — 2026-11-01

### Scope

Full review of the public opening, project detail, project card, pointer trail, particle canvas, sling control, responsive layouts, and modal keyboard behavior. The existing visual direction, typography, content, project data, and interaction design were preserved.

### Screenshots Captured

| Screenshot | Breakpoint | Description |
| --- | --- | --- |
| `screenshots/audit-after-home-desktop-1280.png` | Desktop 1280×800 | Opening after optimization |
| `screenshots/audit-after-home-tablet-768.png` | Tablet 768×1024 | Opening responsive state |
| `screenshots/audit-after-home-mobile-375.png` | Mobile 375×812 | Opening responsive state |
| `screenshots/audit-after-project-desktop-1280.png` | Desktop 1280×800 | Project detail after optimization |
| `screenshots/audit-after-project-tablet-768.png` | Tablet 768×1024 | Project detail responsive state |
| `screenshots/audit-after-project-mobile-375.png` | Mobile 375×812 | Project detail responsive state |
| `screenshots/audit-after-card-desktop-1280.png` | Desktop 1280×800 | Project card with particles and sling control |

### Changes Completed

1. **Pointer pipeline** — opening-title lighting is now merged into one `requestAnimationFrame` update and stops doing work outside the opening view.
2. **Particle canvas** — repeated per-particle shadow blurs were replaced by one cached glow sprite; rendering is capped at 45 fps and 1.5 device-pixel ratio while retaining 200 particles and the same hover response.
3. **Star cursor** — the cursor keeps its meteor/star identity with a smaller bounded trail and lower canvas pixel ratio, preventing trail accumulation from competing with card interactions.
4. **Sling control** — drag painting remains frame-batched and now uses a promoted `translate3d` layer; trajectory, recoil, particles, click behavior, and project opening remain unchanged.
5. **Keyboard and semantics** — added a skip link, valid dialog semantics, focus entry/restoration and modal focus trapping; corrected two ARIA naming violations.
6. **Reduced motion** — added one global fallback that disables nonessential animation while preserving the static design.

### Verification

- `node --check` passed for `script.js`, `particles.js`, and `star-cursor.js`.
- axe-core scans returned zero violations on the opening, project detail, and project card states.
- Automated sling drag produced zero main-thread long tasks during the measured interaction.
- Modal focus entered on the close control and remained inside the dialog.
- Desktop, tablet, and mobile screenshots were visually inspected with no new overflow, overlap, or typography regression.

### Verdict

Approve. No actionable high- or medium-severity findings remain in the reviewed scope.
