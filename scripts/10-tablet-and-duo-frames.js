// Scripter script 10 (Round 3, changes 5 and 6): "Tablet 768" and "iPhone Duo Open 669".
// Both are clones of the light "Desktop 1440" reflowed to a narrower width. Originals are not touched.
// Hero is stacked (copy above image), nav links stay visible, the five service cards keep the 3 + 2 layout
// with one fixed width so all five are the same size.
// iPhone Duo size: Apple's spec page lists the unfolded display as 1878 x 2670 pixels (430 ppi) and gives NO point size.
// 669 x 951 points is an inference (App Store Connect screenshot size 2007 x 2853 divided by 3, from a developer blog),
// so treat it as unconfirmed. Runs with figma and print as arguments.
const page = figma.currentPage;
const out = [];
const desktop = page.children.find(n => n.type === "FRAME" && n.name === "Desktop 1440");
if (!desktop) {
  print("No frame named Desktop 1440");
} else if (page.children.find(n => n.name === "Tablet 768" || n.name === "iPhone Duo Open 669")) {
  print("Tablet or Duo frame already exists");
} else {
  let nextX = Math.max(...page.children.filter(c => c.type === "FRAME").map(c => c.x + c.width)) + 200;
  const build = (name, W, pad, imgH) => {
    const m = desktop.clone();
    m.name = name;
    m.x = nextX;
    m.y = desktop.y;
    m.resize(W, m.height);
    const find = n => m.findOne(x => x.name === n);
    const fill = n => { n.layoutSizingHorizontal = "FILL"; };
    const step = (label, fn) => { try { fn(); } catch (e) { out.push(name + " FAILED " + label + ": " + e.message); } };
    step("sections", () => {
      for (const s of m.children) {
        if (s.type !== "FRAME") continue;
        s.paddingLeft = pad; s.paddingRight = pad;
        s.paddingTop = Math.min(s.paddingTop, 64);
        s.paddingBottom = Math.min(s.paddingBottom, 64);
        fill(s);
      }
    });
    step("nav", () => {
      find("Brand Logo").layoutSizingHorizontal = "HUG";
      find("Nav Actions").layoutSizingHorizontal = "HUG";
    });
    step("hero", () => {
      const hero = find("Hero");
      hero.layoutMode = "VERTICAL";
      hero.itemSpacing = 32;
      hero.primaryAxisAlignItems = "MIN";
      hero.counterAxisAlignItems = "MIN";
      hero.layoutSizingVertical = "HUG";
      for (const nm of ["Hero Copy Column", "Station Badge", "Station Badge Text", "Hero Headline", "Hero Subline", "Hero Actions"]) {
        const n = find(nm);
        if (n) { n.layoutGrow = 0; fill(n); }
      }
      find("Hero Copy Column").layoutSizingVertical = "HUG";
      const ph = find("Placeholder Image Area");
      ph.layoutGrow = 0;
      ph.layoutSizingVertical = "FIXED";
      ph.resize(W - pad * 2, imgH);
      fill(ph);
    });
    step("services", () => {
      for (const nm of ["Services Section Header", "Services Headline", "Services Subtitle", "Services Cards Row"]) fill(find(nm));
      const rows = [find("Cards Row 1"), find("Cards Row 2")];
      const gap = rows[0].itemSpacing;
      const cw = Math.floor((W - pad * 2 - gap * 2) / 3);
      for (const r of rows) {
        r.layoutGrow = 0;
        r.layoutSizingVertical = "HUG";
        fill(r);
        for (const c of r.children) {
          c.layoutGrow = 0;
          c.layoutSizingHorizontal = "FIXED";
          c.resize(cw, c.height);
          c.layoutSizingVertical = "HUG";
          for (const k of c.children) fill(k);
        }
      }
      out.push(name + ": card width " + cw);
    });
    const hidden = n => { let p = n; while (p && p !== m) { if (p.visible === false) return true; p = p.parent; } return false; };
    const right = m.absoluteBoundingBox.x + W + 0.5;
    const over = m.findAll(n => n.absoluteBoundingBox && !hidden(n) && n.absoluteBoundingBox.x + n.absoluteBoundingBox.width > right).map(n => n.name);
    out.push(name + " is " + Math.round(m.width) + "x" + Math.round(m.height) + (over.length ? ", wider than frame: " + over.slice(0, 6).join(", ") : ", nothing wider than the frame"));
    nextX = m.x + m.width + 200;
    return m;
  };
  const t = build("Tablet 768", 768, 32, 320);
  const d = build("iPhone Duo Open 669", 669, 24, 300);
  figma.viewport.scrollAndZoomIntoView([t, d]);
  print(out.join(" | "));
}
