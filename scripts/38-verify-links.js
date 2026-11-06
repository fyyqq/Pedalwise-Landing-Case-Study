// Scripter script 38 (Round 5, read-only): checks every prototype link on the three pages.
// For each generated frame it lists layers with a click reaction and checks: destination exists, is on the same page,
// is a top-level frame, same width, and (for page links) same Light/Dark mode. Also counts nav/footer links without a reaction.
// Nothing is changed.
return (async () => {
  const out = [];
  await figma.loadAllPagesAsync();
  let total = 0, bad = 0, missing = 0;
  const kinds = { NODE: 0, URL: 0 };
  const problems = [];
  for (const pg of figma.root.children) {
    await figma.setCurrentPageAsync(pg);
    const tops = pg.children.filter(c => c.type === "FRAME" && / - (Light|Dark) - \d+$/.test(c.name));
    let pt = 0, pb = 0, pm = 0;
    for (const f of tops) {
      const fm = f.name.match(/^(\w+) - (Light|Dark) - (\d+)$/);
      for (const n of f.findAll(() => true)) {
        const isLinkLayer = n.name === "Logo" || n.name === "Footer Logo" || n.name.indexOf("Nav Link - ") === 0 || n.name.indexOf("Footer Link - ") === 0 || n.name === "Theme Switch" || n.name.indexOf("WhatsApp Button") !== -1 || (n.type === "TEXT" && n.characters === "Ask us on WhatsApp");
        if (!isLinkLayer) continue;
        const rs = n.reactions || [];
        if (!rs.length) {
          // a link to the page itself (or logo on Home) has no reaction by design
          const own = (n.name.split(" - ")[1] || "").toLowerCase() === fm[1].toLowerCase() || ((n.name === "Logo" || n.name === "Footer Logo") && fm[1] === "Home");
          if (!own) { pm++; missing++; problems.push("no reaction: " + f.name + " / " + n.name); }
          continue;
        }
        for (const r of rs) for (const a of (r.actions || (r.action ? [r.action] : []))) {
          pt++; total++; kinds[a.type] = (kinds[a.type] || 0) + 1;
          if (a.type === "NODE") {
            const d = await figma.getNodeByIdAsync(a.destinationId);
            let why = "";
            if (!d) why = "destination missing";
            else if (d.parent !== pg) why = "destination not top-level on this page";
            else {
              const dm = d.name.match(/^(\w+) - (Light|Dark) - (\d+)$/);
              if (!dm || dm[3] !== fm[3]) why = "other width";
              else if (n.name !== "Theme Switch" && dm[2] !== fm[2]) why = "mode changed on a page link";
              else if (n.name === "Theme Switch" && (dm[2] === fm[2] || dm[1] !== fm[1])) why = "theme switch goes to wrong frame";
            }
            if (why) { pb++; bad++; problems.push(why + ": " + f.name + " / " + n.name); }
          } else if (a.type === "URL") {
            if (a.url !== "https://wa.me/15550100") { pb++; bad++; problems.push("unexpected url " + a.url + ": " + f.name); }
          }
        }
      }
    }
    out.push(pg.name + ": frames " + tops.length + ", links checked " + pt + ", bad " + pb + ", missing " + pm);
  }
  out.push("TOTAL links " + total + " (page/theme " + kinds.NODE + ", url " + kinds.URL + "), bad " + bad + ", missing " + missing);
  problems.slice(0, 25).forEach(p => out.push("  " + p));
  print(out.join("\n"));
})();
