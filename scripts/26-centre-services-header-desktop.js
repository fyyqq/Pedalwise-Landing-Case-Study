// Scripter script 26 (Round 4): found while checking the new look: on desktop the "Services" title, subtitle and accent bar sit about 70 px
// left of the page centre (the header box is narrower than the section). Also true in the signed-off Desktop 1440 (not changed there).
// Makes the header full width and centres title and subtitle on the four desktop v2 frames. Prints the offset from the frame centre.
return (async () => {
  const out = [];
  for (const name of ["Desktop 1440 v2", "Prices 1440", "Desktop 1440 v2 Dark", "Prices 1440 Dark"]) {
    const m = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
    const head = m && m.findOne(n => n.name === "Services Section Header");
    if (!head) { out.push(name + " missing"); continue; }
    head.layoutSizingHorizontal = "FILL";
    head.counterAxisAlignItems = "CENTER";
    for (const nm of ["Services Headline", "Services Subtitle"]) {
      const t = head.findOne(n => n.name === nm);
      await figma.loadFontAsync(t.fontName);
      t.layoutSizingHorizontal = "FILL";
      t.textAlignHorizontal = "CENTER";
    }
    const t = head.findOne(n => n.name === "Services Headline").absoluteBoundingBox;
    const bar = head.findOne(n => n.name === "Accent Bar").absoluteBoundingBox;
    const c = m.absoluteBoundingBox.x + m.width / 2;
    out.push(name + " title off " + Math.round(t.x + t.width / 2 - c) + " bar off " + Math.round(bar.x + bar.width / 2 - c));
  }
  print(out.join(" | "));
})();
