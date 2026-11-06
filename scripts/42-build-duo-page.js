// Scripter script 40 (Round 5b): the iPhone Duo page in the second file (Starter allows only 3 files, so no new file). Builds the iPhone Duo 669 version (5 pages, light and dark,
// with photos and links) on its own page "iPhone Duo 669", by running generator 34 with only the "duo" size, then 35 (re-wire). Run it INSIDE the second file (the one without Desktop 1440).
// Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  if (figma.root.children.find(p => p.name === "Desktop 1440")) { print("This looks like the main file (has Desktop 1440). Nothing changed."); return; }
  // Starter plan: 3 files max (a 4th file is refused), so the Duo goes on its own page in the second file "Pedalwise Archive and Brand Kit".
  const arch = figma.root.children.find(p => p.name === "Page 1");
  if (arch) arch.name = "Archive";
  let pg = figma.root.children.find(p => p.name === "iPhone Duo 669");
  if (!pg) { try { pg = figma.createPage(); pg.name = "iPhone Duo 669"; } catch (e) { print("createPage failed: " + e.message); return; } }
  await figma.setCurrentPageAsync(pg);
  for (const c of pg.children.slice()) if (c.type === "FRAME" && / - (Light|Dark) - \d+$/.test(c.name)) c.remove();
  out.push("PAGES " + figma.root.children.map(p => p.name).join(" / "));
  globalThis.PW_CFG = { only: ["duo"], pages: { duo: "iPhone Duo 669" } };
  const h = {};
  const api = "https://raw.githubusercontent.com/fyyqq/pedalwise-landing-case-study/main/scripts/";
  for (const name of ["41-build-site-photos.js", "35-rewire-links.js"]) {
    const src = await (await fetch(api + name, h)).text();
    const lines = [];
    await new Function("figma", "print", src)(figma, s => lines.push(String(s)));
    out.push("== " + name + " (" + src.length + " chars)\n" + lines.join("\n"));
  }
  globalThis.PW_CFG = undefined;
  print(out.join("\n"));
})();
