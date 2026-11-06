// Scripter script 36 (Round 5, read-only): why do hero picture and card texts overflow in "Home - Light - 1440"?
// Prints y/height of the page sections, of the hero parts and of the first service card with its texts. Nothing is changed.
return (async () => {
  await figma.loadAllPagesAsync();
  const pg = figma.root.children.find(p => p.name === "Desktop 1440");
  await figma.setCurrentPageAsync(pg);
  const f = pg.children.find(c => c.name === "Home - Light - 1440");
  const r = n => "[" + n.name.slice(0, 22) + " y" + Math.round(n.y) + " h" + Math.round(n.height) + " w" + Math.round(n.width) + " " + (n.layoutSizingVertical || "") + "]";
  const out = ["page children: " + f.children.map(r).join(" ")];
  const hero = f.findOne(n => n.name === "Hero Section");
  out.push("hero kids: " + hero.children.map(r).join(" "));
  const body = hero.findOne(n => n.name === "Hero Body");
  out.push("hero body kids: " + body.children.map(r).join(" ") + " mode " + body.layoutMode + " pad " + hero.paddingTop);
  const card = f.findOne(n => n.name.indexOf("Card - Basic") === 0);
  out.push("card " + r(card) + " kids: " + card.children.map(r).join(" "));
  const row = card.parent;
  out.push("row " + r(row) + " kids: " + row.children.map(r).join(" "));
  print(out.join("\n"));
})();
