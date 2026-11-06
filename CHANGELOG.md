# Changelog

One line per page, feature or fix. Newest first. Dates are 2026. The client is simulated.

## Round 2 (in progress)

- 2026-11-06 | **Mobile 390 built with Scripter scripts (Plan B, no AI quota)** | Script 02 cloned Desktop 1440 into a 390-wide single-column frame (nav with one compact button, stacked hero, five stacked service cards, contact, footer). First result was 4061 px tall because of a leftover "grow" setting; script 03 fixed it (now 390x2218). Scripts: `scripts/01-read-structure.js`, `02-build-mobile-390.js`, `03-fix-mobile-hero-gap.js`. Screenshot: `screens/round2-mobile-390-script-result.png` (right: the broken agy partial frame, kept for the record). Not yet QA'd: tap-target sizes, alignment of the Contact block.
- 2026-11-06 | **agy Run 04 (partial)** | agy applied Job 1 on Desktop 1440 (fifth card "E-bike repair / Ask us on WhatsApp", Contact section, footer) and started a Mobile 390 frame, then stopped at its usage quota. The mobile frame is broken: headline cut off, hero button missing, service cards clipped. Screenshot: `screens/round2-mobile-390-agy-partial.png`. Lesson: the agent's quota can run out halfway through a job, so one big prompt can leave a half-finished design.

## Round 1 (in progress)

- 2026-11-05 | **Stage 4 backup** | Both final Round 1 frames copied into the section "Stage 4 · Before Round 2" (done by the Claude browser extension). Screenshot: `screens/round1-stage4-backup-in-figma.png`. Note: a locked layer ("H2 Sec...") appears in the Brand Kit layers; origin unknown.
- 2026-11-05 | **Manual edits (Claude browser extension)** | Hero headline changed to "Bike repair near the train station", hero subline to "Book your repair on WhatsApp.", placeholder text centered. The extension also renamed a frame by mistake; caught in the screenshot and fixed. Screenshot: `screens/round1-before-after-overview.png` (top: live frames, bottom: Stage 3 archive with the old headline; the H2 label in the Brand Kit shows a selection box; clean per-frame exports will be added).
- 2026-11-05 | **Round 1 review sent to the client** (Slack, with a view link to the Figma file).
- 2026-11-05 | **Run 03 cleanup** | Logo no longer clipped, service card tags removed, neutral card descriptions, services subtitle set to client-confirmed wording. Verified: frame sizes, logo, tags, descriptions. Not yet verified: Brand Kit text and subtitle. Log: `agy-logs/run-03-final-cleanup.md`
- 2026-11-05 | **Run 02 revision** | Invented claims removed (guarantee, VAT, turnaround times), 32px nav gap, clipped swatch fixed, spacing tokens bound. New bug found: clipped logo. Log: `agy-logs/run-02-revision-remove-invented-claims.md`
- 2026-11-05 | **Run 01 Draft 1** | Brand Kit and Desktop 1440 (nav, hero, 4 service cards). Contained invented claims and bugs. Log: `agy-logs/run-01-brandkit-hero-desktop.md`
- 2026-11-05 | **Discovery** | Client brief, 6 questions, answers. Notes: `notes/01-round1-client-conversation.md`

## Open items
- Waiting for the client's Round 1 feedback (review message sent 2026-11-05).
- Expected next: a fifth service card (E-bike repair, "ask us on WhatsApp") and a large tap target for the WhatsApp button on mobile.
- Mobile 390 frame, contact section and footer: Round 2.
- Late round: change requests (bug, dark mode, tablet, foldable-phone size) and full QA: Round 3.
- Replace `screens/round1-before-after-overview.png` with clean per-frame exports.
