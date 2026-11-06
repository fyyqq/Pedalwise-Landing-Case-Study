// Scripter script 03: fix the huge vertical gap in "Mobile 390" made by script 02.
// Cause (my guess, it worked): the hero column and the card rows kept a "grow to fill" setting from
// the horizontal desktop layout, so after switching to a vertical layout they stretched vertically.
// Result: frame height went from 4061 to 2218.
const m = figma.currentPage.children.find(n => n.name === "Mobile 390");
if (!m) {
  print("No frame named Mobile 390.");
} else {
  const find = (name) => m.findOne(n => n.name === name);
  const fix = (label, fn) => { try { fn(); print("ok: " + label); } catch (e) { print("FAILED " + label + ": " + e.message); } };
  fix("hero", () => {
    const col = find("Hero Copy Column");
    col.layoutGrow = 0;
    col.layoutSizingVertical = "HUG";
    const ph = find("Placeholder Image Area");
    ph.layoutGrow = 0;
    ph.layoutSizingVertical = "FIXED";
    ph.resize(ph.width, 240);
    ph.layoutSizingHorizontal = "FILL";
    find("Hero").layoutSizingVertical = "HUG";
  });
  fix("cards", () => {
    for (const nm of ["Cards Row 1", "Cards Row 2"]) {
      const r = find(nm);
      r.layoutGrow = 0;
      r.layoutSizingVertical = "HUG";
      r.layoutSizingHorizontal = "FILL";
      for (const c of r.children) {
        c.layoutGrow = 0;
        c.layoutSizingVertical = "HUG";
        c.layoutSizingHorizontal = "FILL";
      }
    }
  });
  fix("move old frame", () => {
    const old = figma.currentPage.children.find(n => n.name === "Mobile 390 (agy partial)");
    if (old) old.x = m.x + 590;
  });
  print("Mobile 390 is now " + Math.round(m.width) + "x" + Math.round(m.height));
  for (const s of m.children) print(s.name + ": " + Math.round(s.height) + " tall");
  figma.viewport.scrollAndZoomIntoView([m]);
}
