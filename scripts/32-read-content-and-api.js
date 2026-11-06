// Scripter script 32 (Round 5, read-only): prints what the new generator needs.
// 1) exact texts of the service cards and the other text blocks of "Desktop 1440 v2" and "Contact", 2) which Inter styles exist,
// 3) which Figma API features this Scripter version has (setCurrentPageAsync, setReactionsAsync, loadAllPagesAsync).
// Nothing is changed. Run with a leading await.
return (async () => {
  const out = [];
  const page = figma.currentPage;
  const d = page.children.find(c => c.type === "FRAME" && c.name === "Desktop 1440 v2");
  if (!d) { print("Desktop 1440 v2 not found on this page: " + page.name); return; }
  const cards = d.findAll(n => n.name.indexOf("Card - ") === 0);
  out.push("CARDS " + cards.map(c => c.name + ": " + c.findAll(n => n.type === "TEXT").map(t => t.characters).join(" | ")).join(" || "));
  const names = ["Hero Badge", "Hero Headline", "Hero Subline", "Services Headline", "Services Subline", "Contact Headline", "Footer Text", "Nav Links"];
  for (const nm of names) {
    const n = d.findOne(x => x.name === nm);
    if (n) out.push(nm + ": " + (n.type === "TEXT" ? n.characters : n.findAll(t => t.type === "TEXT").map(t => t.characters).join("/")));
  }
  const allText = d.findAll(n => n.type === "TEXT").map(t => t.characters).filter(s => !cards.some(c => c.findOne(x => x.type === "TEXT" && x.characters === s)));
  out.push("OTHER TEXTS " + allText.slice(0, 30).join(" | "));
  const fonts = await figma.listAvailableFontsAsync();
  out.push("INTER " + fonts.filter(f => f.fontName.family === "Inter").map(f => f.fontName.style).join(","));
  const f0 = d.findOne(n => n.type === "TEXT");
  out.push("API setCurrentPageAsync=" + (typeof figma.setCurrentPageAsync) + " loadAllPagesAsync=" + (typeof figma.loadAllPagesAsync) + " setReactionsAsync=" + (f0 ? typeof f0.setReactionsAsync : "?") + " createComponentFromNode=" + (typeof figma.createComponentFromNode));
  out.push("PAGES " + figma.root.children.map(p => p.name).join(" / "));
  print(out.join("\n"));
})();
