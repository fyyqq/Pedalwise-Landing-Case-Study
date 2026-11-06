// Scripter script 24: script 23 could not centre the desktop Contact title on "Desktop 1440 v2" ("unloaded font Inter Bold").
// Loads the font first, then centres the title on all desktop v2 frames. Runs with figma and print as arguments.
return (async () => {
  const out = [];
  for (const name of ["Desktop 1440 v2", "Prices 1440", "About 1440"]) {
    const m = figma.currentPage.children.find(c => c.type === "FRAME" && c.name === name);
    const ch = m && m.findOne(n => n.name === "Contact Headline");
    if (!ch) { out.push(name + " missing"); continue; }
    await figma.loadFontAsync(ch.fontName);
    ch.textAlignHorizontal = "CENTER";
    ch.layoutSizingHorizontal = "FILL";
    out.push(name + " ok");
  }
  print(out.join(" | "));
})();
