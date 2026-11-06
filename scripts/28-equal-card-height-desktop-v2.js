// Scripter script 28 (Round 4): QA (script 27) found desktop v2 cards 173 px high in row 1 and 165 px in row 2.
// Sets all five cards to the tallest height on the four desktop v2 frames (light and dark). Prints heights after.
return (async () => {
  const out = [];
  for (const name of ["Desktop 1440 v2", "Prices 1440", "Desktop 1440 v2 Dark", "Prices 1440 Dark"]) {
    const m = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
    if (!m) { out.push(name + " missing"); continue; }
    const cards = m.findAll(n => n.name.indexOf("Card - ") === 0);
    const h = Math.max(...cards.map(c => c.height));
    for (const c of cards) { c.layoutSizingVertical = "FIXED"; c.resize(c.width, h); }
    out.push(name + " " + cards.map(c => Math.round(c.height)).join("/"));
  }
  print(out.join(" | "));
})();
