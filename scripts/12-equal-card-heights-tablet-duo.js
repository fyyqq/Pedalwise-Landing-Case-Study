// Scripter script 12: on "Tablet 768" and "iPhone Duo Open 669" the cards in one row had different heights
// (text wraps differently at the narrower width). Makes every card stretch to the tallest card in its row.
// Runs with figma and print as arguments.
const out = [];
for (const name of ["Tablet 768", "iPhone Duo Open 669"]) {
  const f = figma.currentPage.children.find(n => n.type === "FRAME" && n.name === name);
  if (!f) { out.push(name + " missing"); continue; }
  let count = 0;
  for (const nm of ["Cards Row 1", "Cards Row 2"]) {
    const r = f.findOne(n => n.name === nm);
    if (!r) continue;
    for (const c of r.children) { c.layoutAlign = "STRETCH"; count++; }
    out.push(name + " " + nm + " heights " + r.children.map(c => Math.round(c.height)).join("/"));
  }
}
print(out.join(" | "));
