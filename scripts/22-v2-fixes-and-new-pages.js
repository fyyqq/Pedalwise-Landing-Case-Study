// Scripter script 22 (Round 4): small fixes on the v2 frames, then the two new pages Sam asked for (Prices, About).
// Fixes on "Desktop 1440 v2" and "Mobile 390 v2": accent bar centred, outline removed from orange buttons,
// desktop Contact title centred like the rest of that block, "About" added to the nav links (copy of an existing link).
// New frames (clones of the v2 frames, so they share nav, cards, footer and the switch):
//   "Prices 1440", "Prices 390": hero removed, "Services" title changed to "Prices", same cards and Contact.
//   "About 1440", "About 390": services removed, hero title "About Pedalwise", text from Sam only:
//   "We repair bikes and e-bikes near the train station. Book your repair on WhatsApp." (badge and picture placeholder reused).
// Runs with figma and print as arguments (async inside). The signed-off frames are not touched.
(async () => {
  const page = figma.currentPage;
  const out = [];
  const d2 = page.children.find(c => c.type === "FRAME" && c.name === "Desktop 1440 v2");
  const m2 = page.children.find(c => c.type === "FRAME" && c.name === "Mobile 390 v2");
  if (!d2 || !m2) { print("v2 frames missing"); return; }
  if (page.children.find(c => c.name === "Prices 1440")) { print("new pages already exist"); return; }
  const step = async (label, fn) => { try { await fn(); } catch (e) { out.push("FAILED " + label + ": " + e.message); } };
  const topOf = (m, node) => { let p = node; while (p && p.parent !== m) p = p.parent; return p; };
  const setText = async (t, s) => { await figma.loadFontAsync(t.fontName); t.characters = s; };

  for (const m of [d2, m2]) {
    const desk = m.width >= 1000;
    const find = n => m.findOne(x => x.name === n);
    await step("fix " + m.name, async () => {
      const bar = find("Accent Bar");
      const head = find("Services Section Header");
      if (head) { head.counterAxisAlignItems = "CENTER"; if (bar) bar.layoutAlign = "INHERIT"; }
      for (const b of m.findAll(n => n.name.indexOf("WhatsApp Button") !== -1 && n.type === "FRAME")) {
        const orange = b.fills !== figma.mixed && b.fills.some(p => p.type === "SOLID" && Math.round(p.color.r * 255) === 242);
        if (orange) b.strokes = [];
      }
      if (desk) {
        const ch = find("Contact Headline");
        ch.textAlignHorizontal = "CENTER";
        ch.layoutSizingHorizontal = "FILL";
      }
      const links = find("Nav Links");
      if (links && !links.findOne(n => n.type === "TEXT" && n.characters === "About")) {
        const first = links.children[0];
        const copy = first.clone();
        links.insertChild(0, copy);
        const t = copy.type === "TEXT" ? copy : copy.findOne(n => n.type === "TEXT");
        await setText(t, "About");
      }
    });
  }

  let nextX = Math.max(...page.children.filter(c => c.type === "FRAME").map(c => c.x + c.width)) + 200;
  const make = async (src, name, kind) => {
    const m = src.clone();
    m.name = name;
    m.x = nextX; m.y = src.y;
    nextX += m.width + 200;
    const find = n => m.findOne(x => x.name === n);
    await step(name, async () => {
      const hero = topOf(m, find("Hero Headline"));
      const services = topOf(m, find("Services Headline"));
      if (kind === "prices") {
        hero.remove();
        await setText(find("Services Headline"), "Prices");
      } else {
        services.remove();
        await setText(find("Hero Headline"), "About Pedalwise");
        await setText(find("Hero Subline"), "We repair bikes and e-bikes near the train station. Book your repair on WhatsApp.");
      }
    });
    out.push(name + " " + Math.round(m.width) + "x" + Math.round(m.height));
  };
  await make(d2, "Prices 1440", "prices");
  await make(d2, "About 1440", "about");
  await make(m2, "Prices 390", "prices");
  await make(m2, "About 390", "about");
  figma.viewport.scrollAndZoomIntoView(page.children.filter(c => /^(Prices|About) /.test(c.name)));
  print(out.join(" | "));
})();
