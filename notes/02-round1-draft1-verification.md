# Round 1: Draft 1 Verification (Brand Kit + Desktop 1440)

Date: 2026-11-05. Prompt: `prompts/01-brandkit-hero-desktop-prompt.txt`. Figma frames: "Brand Kit" (node 1:27), "Desktop 1440" (node 1:107). The client is simulated.

## What the agent reported vs what I checked in Figma

| Agent claim | Checked in Figma | Result |
|---|---|---|
| Brand Kit 1080 x 1380, auto height | 1080 x 1380 | Matches |
| Desktop 1440 is exactly 1440 wide, 1149 tall | 1440 x 1149 | Matches |
| 5 color variables with the exact hex values | All 5 hex values match the prompt | Matches |
| Typography: Inter, 7 text styles | Inter styles present (H1 48, H2 32, H3 24, Body L 18, Body 16, Caption 14) | Matches (partly checked) |
| Spacing tokens as variables, "strictly 8px grid" | Spacing bars are drawn; variables were not found bound to the Desktop frame; many layout values are off-grid (e.g. 37.5, 78.5, 33.5) | NOT verified / likely false |
| Lint errors remaining: 0 | Cannot be checked from outside the plugin. Visible issues remain (below). | Unverified |

## Problems found (the "caught the AI" story)

1. **Invented client facts.** The agent added claims the client never made: "2-min walk from Central Station", "Same-Day Service", "Free safety check included with every repair", "30-day satisfaction guarantee", "Prices include VAT", and turnaround times (30-min, 10-minute, 20-minute). The client only said: near the train station, four services with prices, WhatsApp to book, and no surprise fees. Putting unconfirmed promises on a client's page is a real-world risk.
2. **Nav spacing bug.** The "Contact" link touches the "Chat on WhatsApp" button (no gap). Lint did not catch it.
3. **Clipped swatch.** The white swatch in the Brand Kit is cut off by about 2px on the right (swatch row is 982 wide, the 5th card ends at 984). Still present after the agent's "lint and fix".
4. **Token claim not backed up.** See table above.

## What was good
- Sizes, colors, fonts, the four services and exact prices are correct. The button wording follows the client's change request ("Chat on WhatsApp").
- Clean, friendly style that matches the brief (green and orange, light background).

## Fix plan (Prompt 02)
Remove every unconfirmed claim, keep only facts from the client conversation, fix the nav gap and the clipped swatch, and bind spacing to variables. Then re-verify.

## Lesson
The AI's self-report was mostly accurate on numbers but added content the client never approved. Always verify content against the brief, not just dimensions.

## Added later (2026-11-05, during Run 03)
One of the unapproved phrases was not the agent's idea: the hero headline "Fast, honest bike repair near the station" was written into my own Prompt 01. The client never gave a headline. "Fast" is also a promise the client did not confirm. Lesson: check the prompt you write, not only the AI's output.
