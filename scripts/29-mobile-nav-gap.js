// Scripter script 29 (Round 4): on the mobile v2 frames the logo and the light/dark switch touched each other.
// Adds a 12 px gap in the nav row and shrinks the logo's inner gap from 16 to 8 px. Prints whether anything is wider than the frame.
return (async () => {
  const out = [];
  for (const name of ["Mobile 390 v2", "Prices 390", "About 390", "Mobile 390 v2 Dark", "Prices 390 Dark", "About 390 Dark"]) {
    const m = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
    const logo = m && m.findOne(n => n.name === "Brand Logo");
    if (!logo) { out.push(name + " missing"); continue; }
    const nav = logo.parent;
    nav.itemSpacing = 12;
    logo.itemSpacing = 8;
    const r = m.absoluteBoundingBox.x + m.width + 0.5;
    const over = nav.findAll(n => n.absoluteBoundingBox && n.absoluteBoundingBox.x + n.absoluteBoundingBox.width > r && !(n.parent && n.parent.name === "Nav Links") && n.name !== "Nav Links").map(n => n.name);
    const a = logo.absoluteBoundingBox, s = m.findOne(n => n.name === "Theme Switch").absoluteBoundingBox;
    out.push(name + " gap " + Math.round(s.x - (a.x + a.width)) + " over: " + (over.length ? over.slice(0, 3).join(",") : "none"));
  }
  print(out.join(" | "));
})();
