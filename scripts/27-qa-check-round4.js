// Scripter script 27 (read-only QA, Round 4): same checks as script 16 on the 12 new-look and new-page frames (light and dark) and prints one compact line per frame. Changes nothing.
// Checks: size, anything wider than the frame, buttons under 48 px high (phone and tablet frames), smallest font size,
// card sizes (width x height per card), locked layers, default layer names (Frame 12, Rectangle 3...), hidden layers.
// Runs with figma and print as arguments.
const names = ["Desktop 1440 v2", "Mobile 390 v2", "Prices 1440", "About 1440", "Prices 390", "About 390", "Desktop 1440 v2 Dark", "Mobile 390 v2 Dark", "Prices 1440 Dark", "About 1440 Dark", "Prices 390 Dark", "About 390 Dark"];
const out = [];
for (const name of names) {
  const f = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
  if (!f) { out.push(name + ": MISSING"); continue; }
  const hidden = n => { let p = n; while (p && p !== f) { if (p.visible === false) return true; p = p.parent; } return false; };
  const all = f.findAll(() => true);
  const right = f.absoluteBoundingBox.x + f.width + 0.5;
  const over = all.filter(n => n.absoluteBoundingBox && !hidden(n) && n.absoluteBoundingBox.x + n.absoluteBoundingBox.width > right).map(n => n.name);
  const small = all.filter(n => n.name.indexOf("Button") !== -1 && n.type === "FRAME" && !hidden(n));
  const phone = f.width < 800;
  const shortBtns = phone ? small.filter(b => b.height < 48).map(b => b.name + " " + Math.round(b.height)) : [];
  const sizes = all.filter(n => n.type === "TEXT" && !hidden(n) && n.fontSize !== figma.mixed).map(n => n.fontSize);
  const cards = all.filter(n => n.name.indexOf("Card - ") === 0).map(c => Math.round(c.width) + "x" + Math.round(c.height));
  const locked = all.filter(n => n.locked).map(n => n.name);
  const generic = all.filter(n => /^(Frame|Rectangle|Ellipse|Group|Vector|Line|Text) \d+$/.test(n.name)).length;
  const hid = all.filter(n => n.visible === false).map(n => n.name);
  out.push(
    name + " " + Math.round(f.width) + "x" + Math.round(f.height) +
    " | wider: " + (over.length ? over.slice(0, 4).join(",") : "none") +
    " | btn<48: " + (shortBtns.length ? shortBtns.join(",") : "none") +
    " | minfont " + Math.min(...sizes) +
    " | cards " + cards.join(" ") +
    " | locked: " + (locked.length ? locked.join(",") : "none") +
    " | defaultnames " + generic +
    " | hidden: " + (hid.length ? hid.join(",") : "none")
  );
}
print(out.join("\n"));
