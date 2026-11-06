// Scripter script 39 (Round 5b): main file "Pedalwise Landing Page". Sam asked: Tablet and iPhone Duo on separate pages + free stock photos.
// Starter plan = 3 pages per file, so: page "iPhone Duo 669 + Tablet 768" becomes "Tablet 768" and iPhone Duo moves to a second file (script 40).
// This script renames that page, deletes every generated frame on the three pages, then runs 34 (build: desktop, tablet, mobile, now with
// Unsplash photos) and 35 (re-wire links) from the repo through the GitHub API. Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  if (!figma.root.children.find(p => p.name === "Desktop 1440")) { print("This is not the main file (no page Desktop 1440). Nothing changed."); return; }
  const shared = figma.root.children.find(p => p.name === "iPhone Duo 669 + Tablet 768");
  if (shared) shared.name = "Tablet 768";
  out.push("PAGES " + figma.root.children.map(p => p.name).join(" / "));
  let removed = 0;
  for (const pg of figma.root.children) {
    await figma.setCurrentPageAsync(pg);
    for (const c of pg.children.slice()) if (c.type === "FRAME" && / - (Light|Dark) - \d+$/.test(c.name)) { c.remove(); removed++; }
  }
  out.push("removed " + removed + " generated frames");
  globalThis.PW_CFG = { only: ["desktop", "tablet", "mobile"], pages: { tablet: "Tablet 768" } };
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
