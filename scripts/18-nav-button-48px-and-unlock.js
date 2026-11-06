// Scripter script 18 (QA fixes from script 16), run after the Stage 7 backup (script 17):
// 1) "Nav WhatsApp Button" was 44 px high on the phone, tablet and Duo frames, under the 48 px minimum tap target. Now 48 px.
// 2) Brand Kit had one locked layer ("H2 Section" type label, origin unknown). Unlocked so it can be edited. Nothing else changed.
// Runs with figma and print as arguments.
const names = ["Mobile 390", "Mobile 390 Dark", "Tablet 768", "Tablet 768 Dark", "iPhone Duo Open 669", "iPhone Duo Open 669 Dark"];
const out = [];
for (const name of names) {
  const f = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
  const b = f && f.findOne(n => n.name === "Nav WhatsApp Button");
  if (!b) { out.push(name + " button missing"); continue; }
  const before = Math.round(b.height);
  if (b.layoutMode !== "NONE" && b.layoutSizingVertical === "HUG") {
    const d = (48 - b.height) / 2;
    b.paddingTop = b.paddingTop + d;
    b.paddingBottom = b.paddingBottom + d;
  } else {
    b.resize(b.width, 48);
  }
  out.push(name + " " + before + "->" + Math.round(b.height));
}
const bk = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === "Brand Kit");
if (bk) {
  const lk = bk.findAll(n => n.locked);
  for (const n of lk) n.locked = false;
  out.push("Brand Kit unlocked " + lk.length);
}
print(out.join(" | "));
