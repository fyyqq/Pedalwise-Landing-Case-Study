// Scripter script 05 (Round 3, change 1 and 2): fix the mobile Contact alignment and make all five service cards look equal.
// Back-up: the section "Stage 5 · Round 2 done" holds the copies from before this change.
// Contact: everything left-aligned and full width (the title was left but the phone, hours and location were centred).
// Cards: the "Full service" card had a 2 px orange border and a different look; copy the look of "Card - Basic tune-up" to every card.
const page = figma.currentPage;
const out = [];
function walk(n, fn) { fn(n); if ("children" in n) for (const c of n.children) walk(c, fn); }
for (const name of ["Desktop 1440", "Mobile 390"]) {
  const f = page.children.find(c => c.type === "FRAME" && c.name === name);
  if (!f) { out.push("missing " + name); continue; }
  const cards = [];
  walk(f, n => { if (n.type === "FRAME" && n.name.startsWith("Card - ")) cards.push(n); });
  const ref = cards.find(c => c.name === "Card - Basic tune-up");
  if (!ref) { out.push("no reference card in " + name); continue; }
  let changed = 0;
  for (const c of cards) {
    if (c === ref) continue;
    const before = JSON.stringify([c.fills, c.strokes, c.strokeWeight, c.effects]);
    c.fills = ref.fills;
    c.strokes = ref.strokes;
    c.strokeWeight = ref.strokeWeight;
    c.effects = ref.effects;
    if (JSON.stringify([c.fills, c.strokes, c.strokeWeight, c.effects]) !== before) { changed++; out.push(name + ": restyled " + c.name); }
  }
  out.push(name + ": " + cards.length + " cards, " + changed + " changed");
}
const mob = page.children.find(c => c.type === "FRAME" && c.name === "Mobile 390");
if (mob) {
  const contact = mob.findOne(n => n.type === "FRAME" && n.name === "Contact");
  if (contact) {
    contact.counterAxisAlignItems = "MIN";
    for (const c of contact.children) {
      c.layoutSizingHorizontal = "FILL";
      if (c.type === "TEXT") c.textAlignHorizontal = "LEFT";
    }
    out.push("Mobile Contact: left aligned, " + contact.children.length + " children full width, now " + Math.round(contact.width) + "x" + Math.round(contact.height));
  } else out.push("no Contact frame in Mobile 390");
}
print(out.join(" | "));
