// Scripter script 48 (Round 6): rebuild the iPhone Duo 669 page in the SECOND file with the shop (run it inside the file without Desktop 1440).
// Deletes the generated frames on the page "iPhone Duo 669", then runs generator 50 with only the "duo" size. Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  if (figma.root.children.find(p => p.name === "Desktop 1440")) { print("This looks like the main file (has Desktop 1440). Nothing changed."); return; }
  let pg = figma.root.children.find(p => p.name === "iPhone Duo 669");
  if (!pg) { print("No page iPhone Duo 669 here. Nothing changed."); return; }
  await figma.setCurrentPageAsync(pg);
  let removed = 0;
  for (const c of pg.children.slice()) if (c.type === "FRAME" && / - (Light|Dark) - \d+$/.test(c.name)) { c.remove(); removed++; }
  out.push("PAGES " + figma.root.children.map(p => p.name).join(" / ") + " | removed " + removed);
  const url = "https://raw.githubusercontent.com/fyyqq/pedalwise-landing-case-study/main/scripts/59-build-site-shop.js";
  const src = await (await fetch(url)).text();
  globalThis.PW_CFG = { only: ["duo"], pages: { duo: "iPhone Duo 669" } };
  const lines = [];
  try { await new Function("figma", "print", src)(figma, s => lines.push(String(s))); } catch (e) { lines.push("RUN FAILED: " + e.message); }
  globalThis.PW_CFG = undefined;
  out.push("== duo (" + src.length + " chars)\n" + lines.join("\n"));
  print(out.join("\n"));
})();
