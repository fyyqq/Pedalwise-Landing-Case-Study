# Pedalwise Landing Page: Client / Developer Case Study

> **The client is simulated.** "Sam" and "Pedalwise Bike Repair" are fictional. I (the Developer) designed the page; the client's messages were written by an AI playing Sam. All phone numbers are placeholders.

**Status: Round 3 of 3 done in Figma (2026-11-06); waiting on the client for the Blog scope and a final sign-off.** This README is updated after every round. See [CHANGELOG.md](CHANGELOG.md) for what is done.

## The project in one paragraph
A one-page landing page for a small bike repair shop near a train station. The client wants customers to book through WhatsApp, with five services (four priced, one "ask us on WhatsApp") and a friendly green and orange look. Deliverable: one Figma file with light and dark versions of Desktop 1440, Tablet 768, Mobile 390 and an iPhone Duo (unfolded) frame, plus a Brand Kit. No login, no database, no online payments.

## What I wanted to practice
- Running a realistic client project: discovery questions, a brand kit, reviews, change requests, bugs.
- Designing with an AI agent (agy with the FigCraft plugin) **and checking its work myself**, instead of trusting its reports.
- Keeping a paper trail: every prompt, every response, every check.

## Tools (all on free plans)
| Purpose | Tool |
|---|---|
| Client chat | Slack (free) |
| Progress board (shared with the client) | Trello (free) |
| Design | Figma (Starter) |
| AI design agent (Round 1 and part of Round 2, until its free quota ran out) | agy (Antigravity CLI) with the FigCraft plugin |
| Scripts that edit Figma (no AI quota) | Scripter plugin, scripts in `scripts/` |
| Running the scripts and checking the result | An AI assistant with computer control on my laptop (see `workflow-lessons/automation-rules.txt`) |
| Evidence and files | Google Drive, this repo |

## Rounds
| Round | Scope | Status |
|---|---|---|
| 1 | Discovery, brand kit, hero, services (Desktop 1440) | Done (2026-11-05) |
| 2 | Fifth service card, contact, footer, Mobile 390 frame | Done (2026-11-06) |
| 3 | Seven client change requests: mobile contact bug, equal cards, fixed WhatsApp bar, dark mode, tablet, iPhone Duo, Blog page (scope change, estimate pending) | Design done (2026-11-06), QA pass done, waiting on client sign-off |

## Key story so far: "I caught the AI inventing client promises"
1. **Run 01:** agy built the Brand Kit and Desktop frames. Sizes and colors matched its report, but it added claims the client never made: a "30-day satisfaction guarantee", "prices include VAT", turnaround times, "Central Station". It also left a nav spacing bug and a clipped swatch while reporting 0 lint errors. ([log](agy-logs/run-01-brandkit-hero-desktop.md), [verification](notes/02-round1-draft1-verification.md))
2. **Run 02:** it removed exactly the phrases I listed and left similar invented copy, and it introduced a new clipped-logo bug. Lesson: "remove X" is not enough; ask the agent to list everything not in the brief. ([log](agy-logs/run-02-revision-remove-invented-claims.md))
3. **Run 03:** the cleanup worked, but agy's own audit said "0 unconfirmed claims" while the hero headline ("Fast, honest...") was still an unconfirmed promise. That headline came from **my own prompt**, so the check has to include what I write, not only what the AI writes. ([log](agy-logs/run-03-final-cleanup.md))
4. **Tool limits are real:** agy's free quota ran out mid-project (resets in about a week) and the Figma tool-call limit on the free plan was also reached, so the last small edits were made by hand in Figma.

5. **From manual to automated:** when the agent quota ran out, the work moved to small Figma scripts, then to an assistant that runs them and checks every result in a screenshot. Typing long code into the editor kept breaking, so a short loader line now downloads each script from this repo. ([automation rules](workflow-lessons/automation-rules.txt), [credit plan](workflow-lessons/credit-saving-plan.txt))
6. **Round 3 checks that found real problems:** the sticky bar covers the services subtitle on the first phone screen (accepted by the client); white text on the orange button was 2.45:1 contrast (fixed to dark text); the nav button was 44 px high on touch frames (fixed to 48 px); a "fix" that did nothing (layoutAlign STRETCH) was caught only because the screenshot was checked. The iPhone Duo point size is not published by Apple, so the 669 px frame is labelled an estimate.

## Repo map
| Folder | What is inside |
|---|---|
| `notes/` | Client conversation and verification notes |
| `prompts/` | Prompts as given to the AI agent |
| `agy-logs/` | Each agy run: prompt, response, my verification |
| `screens/` | Screenshots of each stage and of every Round 3 change |
| `scripts/` | Figma Plugin API scripts for Scripter, numbered in run order (README inside) |
| `workflow-lessons/` | Free-plan problems and fixes, and the automation rules |
| `CHANGELOG.md` | One line per page or feature done |

## Not in this repo (on purpose)
No emails, tokens, API keys, personal file paths or tool settings. FigCraft is a third-party plugin and is linked, not copied.
