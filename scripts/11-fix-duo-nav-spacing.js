// Scripter script 11: fix on "iPhone Duo Open 669": the logo touched the first nav link ("PedalwiseServices").
// Gives the nav row spread-out alignment, at least 24 px between logo, links and button, and 20 px between links.
// Runs with figma and print as arguments.
const d = figma.currentPage.children.find(n => n.type === "FRAME" && n.name === "iPhone Duo Open 669");
if (!d) {
  print("No frame named iPhone Duo Open 669");
} else {
  const logo = d.findOne(n => n.name === "Brand Logo");
  const links = d.findOne(n => n.name === "Nav Links");
  const nav = logo && logo.parent;
  const before = nav ? nav.name + " " + nav.layoutMode + " " + nav.primaryAxisAlignItems + " gap " + nav.itemSpacing + " width " + Math.round(nav.width) + " | links gap " + (links ? links.itemSpacing : "?") + " grow " + (links ? links.layoutGrow : "?") : "nav not found";
  if (nav) {
    nav.primaryAxisAlignItems = "SPACE_BETWEEN";
    nav.itemSpacing = 24;
    if (links) { links.layoutGrow = 0; links.layoutSizingHorizontal = "HUG"; links.itemSpacing = 20; }
  }
  const lb = logo ? logo.absoluteBoundingBox : null;
  const ln = links ? links.absoluteBoundingBox : null;
  const gap = lb && ln ? Math.round(ln.x - (lb.x + lb.width)) : "?";
  print("before: " + before + " | after: gap between logo and links " + gap + " px");
}
