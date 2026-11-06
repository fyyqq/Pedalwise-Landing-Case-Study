// Scripter script 19: client (Sam) asked to darken the green on the nav button a little.
// White text on #1e8e5a was 4.14:1 (WCAG AA needs 4.5:1 for small text). New fill #1b8656 gives 4.57:1 and still looks like the brand green.
// Only the "Nav WhatsApp Button" fill changes, in all eight page frames. Backup: section "Stage 7". Runs with figma and print as arguments.
const names = ["Desktop 1440", "Mobile 390", "Desktop 1440 Dark", "Mobile 390 Dark", "Tablet 768", "iPhone Duo Open 669", "Tablet 768 Dark", "iPhone Duo Open 669 Dark"];
const NEW = { r: 0x1b / 255, g: 0x86 / 255, b: 0x56 / 255 };
const out = [];
for (const name of names) {
  const f = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
  const b = f && f.findOne(n => n.name === "Nav WhatsApp Button");
  if (!b) { out.push(name + " missing"); continue; }
  b.fills = b.fills.map(p => (p.type === "SOLID" ? Object.assign({}, p, { color: NEW }) : p));
  out.push(name + " ok");
}
print(out.join(" | "));
