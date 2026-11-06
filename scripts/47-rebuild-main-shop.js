// Scripter script 47 (Round 6): rebuild the MAIN file ("Pedalwise Landing Page": Desktop 1440, Mobile 390, Tablet 768) with the shop.
// Deletes every generated frame on the three pages, then runs generator 46 once per size (one size at a time, so a failure shows which size).
// The generator wires its own links, so script 35 is no longer run. Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  if (!figma.root.children.find(p => p.name === "Desktop 1440")) { print("This is not the main file (no page Desktop 1440). Nothing changed."); return; }
  let removed = 0;
  for (const pg of figma.root.children) {
    await figma.setCurrentPageAsync(pg);
    for (const c of pg.children.slice()) if (c.type === "FRAME" && / - (Light|Dark) - \d+$/.test(c.name)) { c.remove(); removed++; }
  }
  out.push("PAGES " + figma.root.children.map(p => p.name).join(" / ") + " | removed " + removed + " generated frames");
  const url = "https://raw.githubusercontent.com/fyyqq/pedalwise-landing-case-study/main/scripts/46-build-site-shop.js";
  const src = await (await fetch(url)).text();
  out.push("generator 46: " + src.length + " chars");
  for (const size of ["desktop", "tablet", "mobile"]) {
    globalThis.PW_CFG = { only: [size], pages: { tablet: "Tablet 768" } };
    const lines = [];
    try { await new Function("figma", "print", src)(figma, s => lines.push(String(s))); } catch (e) { lines.push("RUN FAILED " + size + ": " + e.message); }
    out.push("== " + size + "\n" + lines.join("\n"));
  }
  globalThis.PW_CFG = undefined;
  print(out.join("\n"));
})();
