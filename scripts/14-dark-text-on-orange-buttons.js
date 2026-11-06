// Scripter script 14 (Round 3 follow-up): the client (Sam) approved dark text on the orange buttons.
// White text on orange #f28c28 is 2.45:1 (WCAG AA needs 4.5:1 for small text). Dark #1b2a22 on orange is about 6:1.
// Changes every white text layer that sits directly on an orange fill, in all six page frames. Runs with figma and print as arguments.
const names = ["Desktop 1440", "Mobile 390", "Desktop 1440 Dark", "Mobile 390 Dark", "Tablet 768", "iPhone Duo Open 669"];
const hex = c => "#" + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
const DARK = { r: 0x1b / 255, g: 0x2a / 255, b: 0x22 / 255 };
const out = [];
const bgOf = n => {
  let p = n.parent;
  while (p && p.type !== "PAGE") {
    if ("fills" in p && p.fills !== figma.mixed) {
      const s = p.fills.filter(f => f.type === "SOLID" && f.visible !== false);
      if (s.length) return s[s.length - 1].color;
    }
    p = p.parent;
  }
  return null;
};
for (const name of names) {
  const f = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
  if (!f) { out.push(name + " missing"); continue; }
  let n = 0;
  for (const t of f.findAll(x => x.type === "TEXT")) {
    if (t.fills === figma.mixed) continue;
    const bg = bgOf(t);
    if (!bg || hex(bg) !== "#f28c28") continue;
    if (!t.fills.some(p => p.type === "SOLID" && hex(p.color) === "#ffffff")) continue;
    t.fills = t.fills.map(p => (p.type === "SOLID" && hex(p.color) === "#ffffff" ? Object.assign({}, p, { color: DARK }) : p));
    n++;
  }
  out.push(name + " " + n);
}
print("white to dark text on orange: " + out.join(" | "));
