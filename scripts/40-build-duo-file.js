// Scripter script 40 (Round 5b): the new file "Pedalwise Landing Page - iPhone Duo". Builds the iPhone Duo 669 version (5 pages, light and dark,
// with photos and links) on its single page, by running generator 34 with only the "duo" size, then 35 (re-wire). Run it INSIDE the new file.
// Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  if (figma.root.children.find(p => p.name === "Desktop 1440")) { print("This looks like the main file (has Desktop 1440). Nothing changed."); return; }
  const pg = figma.root.children[0];
  pg.name = "iPhone Duo 669";
  await figma.setCurrentPageAsync(pg);
  for (const c of pg.children.slice()) if (c.type === "FRAME" && / - (Light|Dark) - \d+$/.test(c.name)) c.remove();
  out.push("PAGES " + figma.root.children.map(p => p.name).join(" / "));
  globalThis.PW_CFG = { only: ["duo"], pages: { duo: "iPhone Duo 669" } };
  const h = { headers: { Accept: "application/vnd.github.raw" } };
  const api = "https://api.github.com/repos/fyyqq/pedalwise-landing-case-study/contents/scripts/";
  for (const name of ["34-build-site.js", "35-rewire-links.js"]) {
    const src = await (await fetch(api + name + "?r=" + Date.now(), h)).text();
    const lines = [];
    await new Function("figma", "print", src)(figma, s => lines.push(String(s)));
    out.push("== " + name + " (" + src.length + " chars)\n" + lines.join("\n"));
  }
  globalThis.PW_CFG = undefined;
  print(out.join("\n"));
})();
