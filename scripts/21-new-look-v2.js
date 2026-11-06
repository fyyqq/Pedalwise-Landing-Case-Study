// Scripter script 21 (Round 4, change 2): "more professional look". Builds "Desktop 1440 v2" and "Mobile 390 v2" as restyled clones.
// The signed-off frames are NOT touched. Client asked for: larger headings, more white space, soft shadows on cards, bigger pictures.
// Changes: tinted hero section, white cards with soft shadow and bigger radius, larger headings with tighter spacing,
// more section padding, a short green accent bar under section titles, rounded orange buttons with a soft shadow,
// a light/dark switch in the nav (pill with a knob; dark frames move the knob right). No new text, no photos, no claims.
// Runs with figma and print as arguments (async inside).
(async () => {
  const page = figma.currentPage;
  const out = [];
  const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, a) => ({ type: "SOLID", color: rgb(h), opacity: a === undefined ? 1 : a });
  const shadow = (a, y, r) => ({ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: a }, offset: { x: 0, y: y }, radius: r, spread: 0, visible: true, blendMode: "NORMAL" });
  const srcNames = [["Desktop 1440", "Desktop 1440 v2"], ["Mobile 390", "Mobile 390 v2"]];
  if (page.children.find(c => srcNames.some(p => p[1] === c.name))) { print("v2 frames already exist"); return; }
  let nextX = Math.max(...page.children.filter(c => c.type === "FRAME").map(c => c.x + c.width)) + 200;
  for (const [srcName, newName] of srcNames) {
    const src = page.children.find(c => c.type === "FRAME" && c.name === srcName);
    if (!src) { out.push(srcName + " missing"); continue; }
    const m = src.clone();
    m.name = newName;
    m.x = nextX; m.y = src.y;
    nextX += m.width + 200;
    const desk = m.width >= 1000;
    const find = n => m.findOne(x => x.name === n);
    const step = async (label, fn) => { try { await fn(); } catch (e) { out.push(newName + " FAILED " + label + ": " + e.message); } };
    const topOf = node => { let p = node; while (p && p.parent !== m) p = p.parent; return p; };
    const hero = topOf(find("Hero Headline"));
    const services = topOf(find("Services Headline"));
    const contact = topOf(find("Contact Headline"));
    const nav = m.children.find(c => c.name.startsWith("Nav"));
    const sc = desk ? 1.25 : 1.1;
    await step("section colours and spacing", async () => {
      hero.fills = [solid("#e6f3ea")];
      services.fills = [solid("#f7faf8")];
      contact.fills = [solid("#ffffff")];
      for (const s of [hero, services, contact]) {
        s.paddingTop = Math.round(s.paddingTop * sc);
        s.paddingBottom = Math.round(s.paddingBottom * sc);
      }
    });
    await step("headings", async () => {
      for (const nm of ["Hero Headline", "Services Headline", "Contact Headline"]) {
        const t = find(nm);
        await figma.loadFontAsync(t.fontName);
        t.fontSize = Math.round(t.fontSize * (desk ? 1.2 : 1.1));
        t.letterSpacing = { value: -1.5, unit: "PERCENT" };
      }
      const sub = find("Hero Subline");
      await figma.loadFontAsync(sub.fontName);
      sub.fontSize = sub.fontSize + (desk ? 4 : 2);
    });
    await step("accent bar", async () => {
      const head = find("Services Section Header");
      const bar = figma.createRectangle();
      bar.name = "Accent Bar";
      bar.resize(56, 4);
      bar.cornerRadius = 2;
      bar.fills = [solid("#1e8e5a")];
      head.insertChild(1, bar);
      if (head.layoutMode === "VERTICAL") { /* keeps the header's own alignment */ }
    });
    await step("cards", async () => {
      for (const c of m.findAll(n => n.name.indexOf("Card - ") === 0)) {
        c.cornerRadius = 20;
        c.strokes = [{ type: "SOLID", color: rgb("#1e8e5a"), opacity: 0.25 }];
        c.strokeWeight = 1;
        c.fills = [solid("#ffffff")];
        c.effects = [shadow(0.08, 10, 28)];
        c.paddingTop = 28; c.paddingBottom = 28; c.paddingLeft = 28; c.paddingRight = 28;
      }
    });
    await step("hero picture", async () => {
      const ph = find("Placeholder Image Area");
      ph.cornerRadius = 28;
      ph.effects = [shadow(0.10, 16, 40)];
      if (!desk) ph.resize(ph.width, 280);
    });
    await step("buttons", async () => {
      for (const b of m.findAll(n => n.name.indexOf("WhatsApp Button") !== -1 && n.type === "FRAME")) {
        b.cornerRadius = 12;
        const orange = b.fills !== figma.mixed && b.fills.some(p => p.type === "SOLID" && Math.round(p.color.r * 255) === 242);
        b.effects = [orange ? { type: "DROP_SHADOW", color: { r: 0.949, g: 0.549, b: 0.157, a: 0.35 }, offset: { x: 0, y: 6 }, radius: 16, spread: 0, visible: true, blendMode: "NORMAL" } : shadow(0.12, 4, 10)];
      }
      const hb = find("Hero WhatsApp Button");
      if (hb && desk) { hb.paddingTop += 4; hb.paddingBottom += 4; }
    });
    await step("nav", async () => {
      nav.strokes = [];
      nav.effects = [shadow(0.06, 2, 12)];
      const actions = find("Nav Actions");
      const sw = figma.createFrame();
      sw.name = "Theme Switch";
      sw.layoutMode = "HORIZONTAL";
      sw.primaryAxisSizingMode = "FIXED";
      sw.counterAxisSizingMode = "FIXED";
      sw.resize(56, 32);
      sw.primaryAxisAlignItems = "MIN";
      sw.counterAxisAlignItems = "CENTER";
      sw.paddingLeft = 4; sw.paddingRight = 4;
      sw.cornerRadius = 16;
      sw.fills = [solid("#dcebe2")];
      sw.strokes = [{ type: "SOLID", color: rgb("#1e8e5a"), opacity: 0.4 }];
      sw.strokeWeight = 1;
      const knob = figma.createEllipse();
      knob.name = "Switch Knob";
      knob.resize(24, 24);
      knob.fills = [solid("#ffffff")];
      knob.effects = [shadow(0.2, 1, 3)];
      sw.appendChild(knob);
      const dot = figma.createEllipse();
      dot.name = "Switch Sun";
      dot.resize(10, 10);
      dot.fills = [solid("#f28c28")];
      sw.appendChild(dot);
      dot.layoutPositioning = "ABSOLUTE";
      dot.x = 11; dot.y = 11;
      actions.insertChild(0, sw);
      if (actions.layoutMode === "HORIZONTAL") { actions.itemSpacing = 16; actions.counterAxisAlignItems = "CENTER"; }
    });
    out.push(newName + " " + Math.round(m.width) + "x" + Math.round(m.height));
  }
  figma.viewport.scrollAndZoomIntoView(page.children.filter(c => c.name.endsWith(" v2")));
  print(out.join(" | "));
})();
