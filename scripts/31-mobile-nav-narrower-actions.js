// Scripter script 31 (Round 4): script 30 measured logo 12-163 and actions 163-380 on a 390 px frame: no room left, logo and switch touch.
// Makes the actions group narrower: nav button side padding 12 -> 8, gap 8 -> 6, switch 48 -> 44 px wide. Prints the bounds and the free gap after.
return (async () => {
  const out = [];
  for (const name of ["Mobile 390 v2", "Prices 390", "About 390", "Mobile 390 v2 Dark", "Prices 390 Dark", "About 390 Dark"]) {
    const m = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
    const logo = m && m.findOne(n => n.name === "Brand Logo");
    if (!logo) { out.push(name + " missing"); continue; }
    const nav = logo.parent;
    const actions = m.findOne(n => n.name === "Nav Actions");
    nav.layoutMode = "HORIZONTAL";
    nav.primaryAxisAlignItems = "SPACE_BETWEEN";
    nav.counterAxisAlignItems = "CENTER";
    logo.layoutSizingHorizontal = "HUG";
    actions.layoutSizingHorizontal = "HUG";
    const btn = m.findOne(n => n.name === "Nav WhatsApp Button");
    btn.paddingLeft = 8; btn.paddingRight = 8;
    actions.itemSpacing = 6;
    const sw0 = m.findOne(n => n.name === "Theme Switch");
    sw0.resize(44, 28);
    const dot = sw0.findOne(n => n.name === "Switch Sun");
    const knob = sw0.findOne(n => n.name === "Switch Knob");
    if (dot && knob) dot.x = (sw0.primaryAxisAlignItems === "MAX") ? sw0.width - 4 - 24 + 7 : 11;
    const r = n => { const b = n.absoluteBoundingBox; return Math.round(b.x - m.absoluteBoundingBox.x) + "-" + Math.round(b.x - m.absoluteBoundingBox.x + b.width); };
    const lb = logo.absoluteBoundingBox, ab = actions.absoluteBoundingBox;
    out.push(name + " free gap " + Math.round(ab.x - (lb.x + lb.width)) + " right edge " + Math.round(ab.x + ab.width - m.absoluteBoundingBox.x) + " nav " + nav.layoutMode + "/" + nav.primaryAxisAlignItems + " logo " + r(logo) + " actions " + r(actions) + " switch " + r(m.findOne(n => n.name === "Theme Switch")) + " button " + r(m.findOne(n => n.name === "Nav WhatsApp Button")));
  }
  print(out.join("\n"));
})();
