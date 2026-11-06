// Scripter script 23 (Round 4): repairs found in the screenshot of scripts 21 and 22, with a printed diagnosis per step.
// Frames: Desktop 1440 v2, Mobile 390 v2, Prices 1440, About 1440, Prices 390, About 390.
// 1) accent bar under the section title: centred under the title (it sat off to the right).
// 2) desktop Contact title: centred like the rest of the block.
// 3) "About" link added to the nav links (it was missing).
// 4) mobile nav: switch, button and logo overflowed the 390 px width; padding, switch size and gaps reduced so everything fits.
// 5) orange buttons: outline removed (script 22 step did not run).
// Load with a leading await so the printed result shows. Runs with figma and print as arguments.
return (async () => {
  const page = figma.currentPage;
  const out = [];
  const names = ["Desktop 1440 v2", "Mobile 390 v2", "Prices 1440", "About 1440", "Prices 390", "About 390"];
  for (const name of names) {
    const m = page.children.find(c => c.type === "FRAME" && c.name === name);
    if (!m) { out.push(name + " MISSING"); continue; }
    const desk = m.width >= 1000;
    const find = n => m.findOne(x => x.name === n);
    const log = [];
    const step = async (label, fn) => { try { await fn(); log.push(label + " ok"); } catch (e) { log.push(label + " FAILED " + e.message); } };
    await step("bar", async () => {
      const bar = find("Accent Bar");
      const head = find("Services Section Header");
      if (!bar || !head) { log.push("(no bar or header)"); return; }
      log.push("head " + head.layoutMode + " align " + head.counterAxisAlignItems);
      if (head.layoutMode !== "NONE") {
        head.counterAxisAlignItems = "CENTER";
        bar.layoutSizingHorizontal = "FIXED";
        bar.resize(56, 4);
      } else {
        bar.x = Math.round((head.width - 56) / 2);
      }
    });
    await step("orange outline", async () => {
      for (const b of m.findAll(n => n.name.indexOf("WhatsApp Button") !== -1 && n.type === "FRAME")) {
        const orange = b.fills !== figma.mixed && b.fills.some(p => p.type === "SOLID" && Math.round(p.color.r * 255) === 242);
        if (orange) b.strokes = [];
      }
    });
    if (desk) {
      await step("contact title", async () => {
        const ch = find("Contact Headline");
        if (!ch) return;
        ch.textAlignHorizontal = "CENTER";
        ch.layoutSizingHorizontal = "FILL";
      });
    }
    await step("about link", async () => {
      const links = find("Nav Links");
      if (!links) { log.push("(no Nav Links)"); return; }
      const texts = links.findAll(n => n.type === "TEXT").map(t => t.characters);
      log.push("links " + texts.join("/") + " kids " + links.children.map(c => c.type).join(","));
      if (texts.indexOf("About") === -1) {
        const first = links.children[0];
        const copy = first.clone();
        links.insertChild(0, copy);
        const t = copy.type === "TEXT" ? copy : copy.findOne(n => n.type === "TEXT");
        await figma.loadFontAsync(t.fontName);
        t.characters = "About";
      }
    });
    if (!desk) {
      await step("mobile nav", async () => {
        const nav = m.children.find(c => c.name.startsWith("Nav"));
        nav.paddingLeft = 12; nav.paddingRight = 12;
        const actions = find("Nav Actions");
        const sw = find("Theme Switch");
        if (sw) { sw.resize(48, 28); sw.cornerRadius = 14; }
        if (actions) actions.itemSpacing = 8;
        const b = find("Nav WhatsApp Button");
        if (b) { b.paddingLeft = 12; b.paddingRight = 12; }
        const r = m.absoluteBoundingBox.x + m.width + 0.5;
        const over = nav.findAll(n => n.visible !== false && n.absoluteBoundingBox && n.absoluteBoundingBox.x + n.absoluteBoundingBox.width > r).map(n => n.name);
        log.push("nav overflow: " + (over.length ? over.join(",") : "none"));
      });
    }
    out.push(name + ": " + log.join("; "));
  }
  print(out.join("\n"));
})();
