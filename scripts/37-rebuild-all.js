// Scripter script 37 (Round 5): rebuild. Script 34 made every new frame 100 x 100 FIXED (Figma's default), so heroes, rows and cards
// did not hug their content (found with script 36). Script 34 now sets hug sizing in its frame helper.
// This script deletes the generated frames (names "<Page> - Light|Dark - <width>") on the three pages, then runs 34 (build) and 35 (re-wire)
// from the repo through the GitHub API and prints both reports. Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  let removed = 0;
  for (const pg of figma.root.children) {
    await figma.setCurrentPageAsync(pg);
    for (const c of pg.children.slice()) if (c.type === "FRAME" && / - (Light|Dark) - \d+$/.test(c.name)) { c.remove(); removed++; }
  }
  out.push("removed " + removed + " generated frames");
  const h = { headers: { Accept: "application/vnd.github.raw" } };
  const api = "https://api.github.com/repos/fyyqq/pedalwise-landing-case-study/contents/scripts/";
  for (const name of ["41-build-site-photos.js", "35-rewire-links.js"]) {
    const src = await (await fetch(api + name + "?r=" + Date.now(), h)).text();
    const lines = [];
    await new Function("figma", "print", src)(figma, s => lines.push(String(s)));
    out.push("== " + name + " (" + src.length + " chars)\n" + lines.join("\n"));
  }
  print(out.join("\n"));
})();
