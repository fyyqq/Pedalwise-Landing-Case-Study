// Scripter script 77 (replaces 75, which lost the footer links to a comment typo) (Round 7, mobile footer links on one row): rebuild ONLY the Mobile 390 page of the MAIN file with generator 76 (based on 66/69).
// Deletes the generated frames on Mobile 390, then runs generator 76 with only the mobile size.
// The generator wires its own links, so script 35 is no longer run. Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  if (!figma.root.children.find(p => p.name === "Desktop 1440")) { print("This is not the main file (no page Desktop 1440). Nothing changed."); return; }
  let removed = 0;
  for (const pg of figma.root.children) {
    await figma.setCurrentPageAsync(pg);
    if (pg.name !== "Mobile 390") continue;
    for (const c of pg.children.slice()) if (c.type === "FRAME" && / - (Light|Dark) - \d+$/.test(c.name)) { c.remove(); removed++; }
  }
  out.push("PAGES " + figma.root.children.map(p => p.name).join(" / ") + " | removed " + removed + " generated frames");
  const url = "https://raw.githubusercontent.com/fyyqq/pedalwise-landing-case-study/main/scripts/76-build-site-blog.js";
  const src = await (await fetch(url)).text();
  out.push("generator 68: " + src.length + " chars");
  for (const size of ["mobile"]) {
    globalThis.PW_CFG = { only: [size], pages: { tablet: "Tablet 768" } };
    const lines = [];
    try { await new Function("figma", "print", src)(figma, s => lines.push(String(s))); } catch (e) { lines.push("RUN FAILED " + size + ": " + e.message); }
    out.push("== " + size + "\n" + lines.join("\n"));
  }
  globalThis.PW_CFG = undefined;
  print(out.join("\n"));
})();
