// Scripter script 33 (Round 5): one Figma page per size.
// Creates the pages "Brand Kit", "Desktop 1440", "Tablet 768", "Mobile 390", "iPhone Duo 669" and renames the old "Page 1" to
// "Archive (old versions)" (it keeps every old frame and the Stage backups, nothing is deleted). The Brand Kit frame moves to its own page.
// Order of pages: Brand Kit, Desktop, Tablet, Mobile, iPhone Duo, Archive. Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  const root = figma.root;
  const arch = root.children.find(p => p.name === "Page 1" || p.name.indexOf("Archive") === 0);
  if (!arch) { print("no 'Page 1' or Archive page found: " + root.children.map(p => p.name).join(" / ")); return; }
  const get = n => root.children.find(p => p.name === n);
  const mk = n => { let p = get(n); if (!p) { p = figma.createPage(); p.name = n; out.push("created " + n); } return p; };
  const brandPage = mk("Brand Kit");
  const names = ["Desktop 1440", "Tablet 768", "Mobile 390", "iPhone Duo 669"];
  names.forEach(mk);
  arch.name = "Archive (old versions)";
  const brand = arch.children.find(c => c.name.indexOf("Brand Kit") === 0);
  if (brand) { brandPage.appendChild(brand); out.push("moved Brand Kit frame"); } else out.push("no Brand Kit frame found on the old page");
  const order = ["Brand Kit"].concat(names).concat(["Archive (old versions)"]);
  order.forEach((n, i) => { try { root.insertChild(i, get(n)); } catch (e) { out.push("order failed for " + n + ": " + e.message); } });
  out.push("PAGES " + root.children.map(p => p.name + " (" + p.children.length + ")").join(" / "));
  print(out.join("\n"));
})();
