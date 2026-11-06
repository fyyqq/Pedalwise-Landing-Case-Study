// Scripter script 33 (Round 5): page structure for the new design. The Figma Starter plan allows only 3 pages per file
// (createPage fails with "The Starter plan only comes with 3 pages"), so the file now holds exactly three pages:
//   "Desktop 1440", "Mobile 390", "iPhone Duo 669 + Tablet 768".
// The old frames, the Stage backups and the Brand Kit were copied to the separate file "Pedalwise Archive and Brand Kit"
// before this script ran, and removed from "Page 1" by hand. This script only renames and orders pages (no page is created).
// Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  const root = figma.root;
  const get = n => root.children.find(p => p.name === n);
  const p1 = get("Page 1") || get("Mobile 390");
  const bk = get("Brand Kit") || get("iPhone Duo 669 + Tablet 768");
  const dk = get("Desktop 1440");
  if (!p1 || !bk || !dk) { print("pages not as expected: " + root.children.map(p => p.name).join(" / ")); return; }
  for (const p of [p1, bk, dk]) if (p.children.length) out.push("WARNING " + p.name + " still has " + p.children.length + " layers");
  p1.name = "Mobile 390";
  bk.name = "iPhone Duo 669 + Tablet 768";
  [dk, p1, bk].forEach((p, i) => { try { root.insertChild(i, p); } catch (e) { out.push("order failed for " + p.name + ": " + e.message); } });
  out.push("PAGES " + root.children.map(p => p.name + " (" + p.children.length + ")").join(" / "));
  print(out.join("\n"));
})();
