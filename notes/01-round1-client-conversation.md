# Round 1: Client Conversation (discovery)

Channel: Slack `#pedalwise-landing`. Times are +08. Email addresses removed. The client is simulated (fictional shop).

---

**Client (Sam), 05:50**
> Hi Fyqq! Thanks for taking this on. I run Pedalwise, a small bike repair shop. Right now customers only find us by word of mouth, and I'd love a simple one-page website so people can see what we do and book a repair. I'm not very technical, so I'll explain as we go. Where do you want to start?

*Dev note: the brief is vague on purpose. Next step is discovery questions before designing anything.*

**Developer, 05:51**
> Hi Sam, thanks! A few questions so I design the right page:
> 1. What's the ONE thing a visitor should do (call, WhatsApp, or book online)?
> 2. Who are your typical customers, and what do they worry about?
> 3. Which services and prices should be on the page?
> 4. Do you have a logo, colors, or websites you like?
> 5. Do most customers use a phone or a computer?
> 6. When do you want it, and who approves changes?

**Client (Sam), 05:52**
> Great questions!
> 1. Main thing: customers WhatsApp me to book a slot. Please no complicated booking system or online payments.
> 2. Mostly students, commuters, and weekend riders. They worry it'll be expensive, take too long, or that the shop will "find extra problems".
> 3. Basic tune-up $25, full service $55, flat tire fix $10, brake or gear adjustment $15. We're open Tue to Sun, 9am to 6pm, in a small shop near the train station.
> 4. No logo yet, maybe a simple wheel symbol. I like green and orange, clean and friendly, not dark or corporate.
> 5. About 80% of my customers are on their phones.
> 6. A first look by Friday would be amazing. It's just me deciding, but my partner will want to see it too. Oh, and I might want a blog someday!

---

## Developer analysis (what the answers mean for the design)

| Client said | Design decision |
|---|---|
| WhatsApp to book, no booking system | One primary call-to-action: "Book on WhatsApp". No forms. |
| Customers worry about cost and surprise problems | Show the 4 prices clearly; add a short "no surprise fees, we ask before extra work" trust line (confirm with client). |
| 80% phone | Design Mobile (390) as the primary frame, Desktop (1440) second. |
| Green and orange, clean, friendly | Brand kit: green main, orange accent, light backgrounds. |
| No logo, maybe a wheel symbol | Simple wheel icon as a placeholder; ask the client to approve. |
| Blog "someday" | Out of scope. Record as a future phase. |
| Deadline Friday, two approvers | Plan Round 1 preview before Friday; send review links that both can open. |

## Open questions to confirm with the client
- Is "no surprise fees" an actual shop promise we may print?
- WhatsApp number and exact address for the contact section (fictional placeholders for this exercise).
- Currency symbol confirmed as `$`.

## Later in the conversation (from the project notes)
- Sam confirmed "no surprise fees; we always ask before extra work".
- Sam gave the WhatsApp placeholder number +1 555 0100 (fictional) and asked for the button to say "Chat on WhatsApp".
