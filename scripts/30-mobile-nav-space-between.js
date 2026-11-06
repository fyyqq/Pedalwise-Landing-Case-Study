// Scripter script 30 (Round 4): script 29 reported a 0 px gap between logo and switch on the mobile v2 frames.
// Sets the nav row to spread its children (space between), keeps logo and actions at their own width, prints the bounds so the gap is measured.
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
    const r = n => { const b = n.absoluteBoundingBox; return Math.round(b.x - m.absoluteBoundingBox.x) + "-" + Math.round(b.x - m.absoluteBoundingBox.x + b.width); };
    out.push(name + " nav " + nav.layoutMode + "/" + nav.primaryAxisAlignItems + " logo " + r(logo) + " actions " + r(actions) + " switch " + r(m.findOne(n => n.name === "Theme Switch")) + " button " + r(m.findOne(n => n.name === "Nav WhatsApp Button")));
  }
  print(out.join("\n"));
})();
