# Pedalwise Landing Page: Client / Developer Case Study

> **The client is simulated.** "Sam" and "Pedalwise Bike Repair" are fictional. I (the Developer) designed the page; the client's messages were written by an AI playing Sam. All phone numbers are placeholders.

**Status: work in progress (Round 1 of 3).** This README is updated after every round. See [CHANGELOG.md](CHANGELOG.md) for what is done.

## The project in one paragraph
A one-page landing page for a small bike repair shop near a train station. The client wants customers to book through WhatsApp, with four priced services and a friendly green and orange look. Deliverable: one Figma file with a Desktop 1440 frame and a Mobile 390 frame. No login, no database, no online payments.

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
| AI design agent | agy (Antigravity CLI) with the FigCraft plugin |
| Evidence and files | Google Drive, this repo |

## Rounds
| Round | Scope | Status |
|---|---|---|
| 1 | Discovery, brand kit, hero, services (Desktop 1440) | In progress: design revisions, client review not sent yet |
| 2 | Remaining sections and the Mobile 390 frame | Not started |
| 3 | Client feedback, change requests, bug fixes, full QA | Not started |

## Key story so far: "I caught the AI inventing client promises"
1. **Run 01:** agy built the Brand Kit and Desktop frames. Sizes and colors matched its report, but it added claims the client never made: a "30-day satisfaction guarantee", "prices include VAT", turnaround times, "Central Station". It also left a nav spacing bug and a clipped swatch while reporting 0 lint errors. ([log](agy-logs/run-01-brandkit-hero-desktop.md), [verification](notes/02-round1-draft1-verification.md))
2. **Run 02:** it removed exactly the phrases I listed and left similar invented copy, and it introduced a new clipped-logo bug. Lesson: "remove X" is not enough; ask the agent to list everything not in the brief. ([log](agy-logs/run-02-revision-remove-invented-claims.md))
3. **Run 03:** the cleanup worked, but agy's own audit said "0 unconfirmed claims" while the hero headline ("Fast, honest...") was still an unconfirmed promise. That headline came from **my own prompt**, so the check has to include what I write, not only what the AI writes. ([log](agy-logs/run-03-final-cleanup.md))
4. **Tool limits are real:** agy's free quota ran out mid-project (resets in about a week) and the Figma tool-call limit on the free plan was also reached, so the last small edits were made by hand in Figma.

## Repo map
| Folder | What is inside |
|---|---|
| `notes/` | Client conversation and verification notes |
| `prompts/` | Prompts as given to the AI agent |
| `agy-logs/` | Each agy run: prompt, response, my verification |
| `screens/` | Exported PNGs of each stage (added as they are exported) |
| `CHANGELOG.md` | One line per page or feature done |

## Not in this repo (on purpose)
No emails, tokens, API keys, personal file paths or tool settings. FigCraft is a third-party plugin and is linked, not copied.
