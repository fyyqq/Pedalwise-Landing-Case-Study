// Scripter script 70 (Round 7, read-only; based on 49, now knows the Blog and News article pages): checks every prototype link on the size pages (Archive page skipped).
// For each generated frame it finds link layers by name, works out the page each one SHOULD open, and checks the real reaction:
// destination exists, is a top-level frame on the same page, same width, same Light/Dark mode, and is the expected page.
// Theme Switch must open the other mode of the same page. WhatsApp buttons must open the placeholder URL. A link to the page itself has no reaction by design.
// Nothing is changed. Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  const WA = "https://wa.me/15550100";
  const FR = /^([\w ]+) - (Light|Dark) - (\d+)$/; const pk = nm => nm.split(" ")[0].toLowerCase(); // "News article" -> "news"
  const expected = (n, key) => {
    const nm = n.name;
    if (nm === "Theme Switch") return { theme: true };
    if (nm === "Back to Blog Link") return { page: "blog" };
    if (nm.indexOf("Post Card - ") === 0 || nm === "Read Article Button") return { page: "news" };
    if (nm === "Logo" || nm === "Footer Logo" || nm === "Back to Home Link") return { page: "home" };
    let m = nm.match(/^(Nav Link|Footer Link|Breadcrumb Link) - (\w+)$/); if (m) return { page: m[2].toLowerCase() };
    if (nm === "Nav Cart Button" || nm === "Add to Cart Button") return { page: "cart" };
    if (nm.indexOf("Product Card - ") === 0) return { page: "product" };
    if (nm.indexOf("Category Card - ") === 0 || nm === "Shop Now Button" || nm === "Back to Shop Button" || nm === "Continue Shopping Link") return { page: "shop" };
    if (nm === "Checkout Button") return { page: "checkout" };
    if (nm === "Pay Button") return { page: "confirmation" };
    if (nm.indexOf("WhatsApp Button") !== -1 || (n.type === "TEXT" && n.characters === "Ask us on WhatsApp")) return { url: true };
    return null;
  };
  let total = 0, bad = 0, missing = 0, layers = 0; const kinds = {}; const problems = [];
  for (const pg of figma.root.children) {
    if (pg.name === "Archive") continue;
    await figma.setCurrentPageAsync(pg);
    const tops = pg.children.filter(c => c.type === "FRAME" && FR.test(c.name));
    let pt = 0, pb = 0, pm = 0, pl = 0;
    for (const f of tops) {
      const fm = f.name.match(FR); const fkey = pk(fm[1]);
      for (const n of f.findAll(() => true)) {
        const ex = expected(n, fkey); if (!ex) continue;
        pl++; layers++;
        const rs = n.reactions || [];
        const own = ex.page === fkey;
        if (!rs.length) { if (!own) { pm++; missing++; problems.push("no reaction: " + f.name + " / " + n.name); } continue; }
        if (own) { pb++; bad++; problems.push("self link has a reaction: " + f.name + " / " + n.name); continue; }
        for (const r of rs) for (const a of (r.actions || (r.action ? [r.action] : []))) {
          pt++; total++; kinds[a.type] = (kinds[a.type] || 0) + 1;
          let why = "";
          if (a.type === "NODE") {
            const d = await figma.getNodeByIdAsync(a.destinationId);
            if (!d) why = "destination missing";
            else if (d.parent !== pg) why = "destination not top-level on this page";
            else {
              const dm = d.name.match(FR);
              if (!dm || dm[3] !== fm[3]) why = "other width";
              else if (ex.theme) { if (dm[2] === fm[2] || dm[1] !== fm[1]) why = "theme switch goes to wrong frame"; }
              else if (ex.url) why = "WhatsApp layer opens a page";
              else if (dm[2] !== fm[2]) why = "mode changed on a page link";
              else if (pk(dm[1]) !== ex.page) why = "opens " + dm[1] + ", expected " + ex.page;
            }
          } else if (a.type === "URL") { if (!ex.url || a.url !== WA) why = "unexpected url " + a.url; }
          else why = "unexpected action " + a.type;
          if (why) { pb++; bad++; problems.push(why + ": " + f.name + " / " + n.name); }
        }
      }
    }
    out.push(pg.name + ": frames " + tops.length + ", link layers " + pl + ", actions checked " + pt + ", bad " + pb + ", missing " + pm);
  }
  out.push("TOTAL link layers " + layers + ", actions " + total + " (page/theme " + (kinds.NODE || 0) + ", url " + (kinds.URL || 0) + "), bad " + bad + ", missing " + missing);
  problems.slice(0, 20).forEach(p => out.push("  " + p));
  print(out.join("\n"));
})();
