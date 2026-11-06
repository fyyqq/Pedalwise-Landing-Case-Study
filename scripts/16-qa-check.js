// Scripter script 16 (read-only QA): checks all page frames and prints one compact line per frame. Changes nothing.
// Checks: size, anything wider than the frame, buttons under 48 px high (phone and tablet frames), smallest font size,
// card sizes (width x height per card), locked layers, default layer names (Frame 12, Rectangle 3...), hidden layers.
// Runs with figma and print as arguments.
const names = ["Desktop 1440", "Mobile 390", "Desktop 1440 Dark", "Mobile 390 Dark", "Tablet 768", "iPhone Duo Open 669", "Tablet 768 Dark", "iPhone Duo Open 669 Dark"];
const out = [];
for (const name of names) {
  const f = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
  if (!f) { out.push(name + ": MISSING"); continue; }
  const hidden = n => { let p = n; while (p && p !== f) { if (p.visible === false) return true; p = p.parent; } return false; };
  const all = f.findAll(() => true);
  const right = f.absoluteBoundingBox.x + f.width + 0.5;
  const over = all.filter(n => n.absoluteBoundingBox && !hidden(n) && n.absoluteBoundingBox.x + n.absoluteBoundingBox.width > right).map(n => n.name);
  const small = all.filter(n => n.type === "BUTTON" || (n.name.indexOf("Button") !== -1 && n.type === "FRAME" && !hidden(n)));
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
const bk = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === "Brand Kit");
if (bk) {
  const lk = bk.findAll(n => n.locked).map(n => n.name);
  out.push("Brand Kit " + Math.round(bk.width) + "x" + Math.round(bk.height) + " | locked: " + (lk.length ? lk.join(",") : "none"));
}
print(out.join("\n"));
