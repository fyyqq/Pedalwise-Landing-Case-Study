// Scripter script 02: clone "Desktop 1440" into "Mobile 390" and reflow it to one column.
// Run in the Scripter Figma plugin. Adds a new frame, does not change the Desktop frame.
// Only text that already exists on the desktop frame is reused: no new copy is added.
print("1: start");
const page = figma.currentPage;
const desktop = page.children.find(n => n.name === "Desktop 1440");
if (!desktop) {
  print("No frame named Desktop 1440.");
} else if (page.children.find(n => n.name === "Mobile 390")) {
  print("A frame named Mobile 390 already exists. Rename or delete it first.");
} else {
  const wait = (p, label) => Promise.race([p, new Promise(res => setTimeout(() => res("TIMEOUT " + label), 8000))]);
  const m = desktop.clone();
  print("2: cloned");
  m.name = "Mobile 390";
  m.x = desktop.x + desktop.width + 200;
  m.y = desktop.y;
  m.resize(390, m.height);
  print("3: resized to 390");
  const find = (name) => m.findOne(n => n.name === name);
  const fill = (n) => { n.layoutSizingHorizontal = "FILL"; };
  const step = (label, fn) => { try { fn(); print("ok: " + label); } catch (e) { print("FAILED " + label + ": " + e.message); } };
  step("sections", () => {
    for (const s of m.children) {
      if (s.type !== "FRAME") continue;
      s.paddingLeft = 16; s.paddingRight = 16;
      s.paddingTop = Math.min(s.paddingTop, 48);
      s.paddingBottom = Math.min(s.paddingBottom, 48);
      fill(s);
    }
  });
  step("nav", () => {
    find("Nav Links").visible = false;
    find("Brand Logo").layoutSizingHorizontal = "HUG";
    find("Nav Actions").layoutSizingHorizontal = "HUG";
    const b = find("Nav WhatsApp Button");
    b.paddingLeft = 16; b.paddingRight = 16;
  });
  step("hero", () => {
    const hero = find("Hero");
    hero.layoutMode = "VERTICAL";
    hero.itemSpacing = 32;
    hero.primaryAxisAlignItems = "MIN";
    hero.counterAxisAlignItems = "MIN";
    hero.layoutSizingVertical = "HUG";
    for (const nm of ["Hero Copy Column", "Station Badge", "Station Badge Text", "Hero Headline", "Hero Subline", "Hero Actions", "Hero WhatsApp Button"]) fill(find(nm));
    const ph = find("Placeholder Image Area");
    ph.resize(358, 240);
    fill(ph);
  });
  step("services", () => {
    for (const nm of ["Services Section Header", "Services Headline", "Services Subtitle", "Services Cards Row"]) fill(find(nm));
    find("Services Cards Row").itemSpacing = 16;
    for (const nm of ["Cards Row 1", "Cards Row 2"]) {
      const r = find(nm);
      r.layoutMode = "VERTICAL";
      r.itemSpacing = 16;
      fill(r);
      r.layoutSizingVertical = "HUG";
    }
    for (const c of m.findAll(n => n.name.startsWith("Card - "))) {
      fill(c);
      c.layoutSizingVertical = "HUG";
      for (const k of c.children) fill(k);
    }
  });
  step("contact", () => {
    fill(find("Contact Headline"));
    fill(find("Contact WhatsApp Button"));
  });
  try {
    const f = await wait(figma.loadFontAsync({ family: "Inter", style: "Bold" }), "font");
    if (typeof f === "string") print(f);
    const styles = await wait(figma.getLocalTextStylesAsync(), "text styles");
    if (typeof styles === "string") print(styles);
    else {
      const h2 = styles.find(s => s.name.indexOf("H2") !== -1);
      if (h2) {
        const r = await wait(find("Hero Headline").setTextStyleIdAsync(h2.id), "set headline style");
        print(typeof r === "string" ? r : "ok: headline style");
      } else print("No H2 text style found.");
    }
  } catch (e) { print("FAILED headline style: " + e.message); }
  try {
    const vars = await wait(figma.variables.getLocalVariablesAsync("FLOAT"), "variables");
    if (typeof vars === "string") print(vars);
    else {
      const v16 = vars.find(v => v.name === "spacing/16");
      if (v16) for (const s of m.children) {
        if (s.type === "FRAME") { s.setBoundVariable("paddingLeft", v16); s.setBoundVariable("paddingRight", v16); }
      }
      print(v16 ? "ok: spacing/16 bound" : "spacing/16 not found");
    }
  } catch (e) { print("FAILED binding: " + e.message); }
  const hidden = (n) => { let p = n; while (p && p !== m) { if (p.visible === false) return true; p = p.parent; } return false; };
  const right = m.absoluteBoundingBox.x + 390;
  const over = m.findAll(n => n.absoluteBoundingBox && !hidden(n) && n.absoluteBoundingBox.x + n.absoluteBoundingBox.width > right + 0.5).map(n => n.name);
  figma.viewport.scrollAndZoomIntoView([m]);
  print("Done. Mobile 390 is " + Math.round(m.width) + "x" + Math.round(m.height));
  print(over.length ? "Wider than the frame: " + over.join(", ") : "Nothing is wider than the frame.");
}
