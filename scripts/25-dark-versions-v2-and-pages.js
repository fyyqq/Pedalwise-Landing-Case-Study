// Scripter script 25 (Round 4): dark versions of the six new frames, same rules as script 09 plus the new look colours.
// Sources: Desktop 1440 v2, Mobile 390 v2, Prices 1440, About 1440, Prices 390, About 390 -> "<name> Dark".
// Extra rules: hero tint #e6f3ea -> #12201a, switch track #dcebe2 -> #24352c, switch knob light and moved to the right,
// text colour chosen by contrast against what sits behind it (same as script 09).
// Prints a WCAG AA contrast report. Runs with figma and print as arguments (async, load with a leading await).
return (async () => {
  const page = figma.currentPage;
  const out = [];
  const hex = c => "#" + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
  const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const lum = c => { const f = v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const FILL = { "#ffffff": "#1a2620", "#f7faf8": "#0f1713", "#1b2a22": "#070b09", "#e6f3ea": "#12201a", "#dcebe2": "#24352c" };
  const PAGE_BG = rgb("#0f1713");
  const LIGHT = { "#1b2a22": "#e8f0eb", "#1e8e5a": "#4fd08f" };
  const names = ["Desktop 1440 v2", "Mobile 390 v2", "Prices 1440", "About 1440", "Prices 390", "About 390"];
  if (page.children.find(c => c.name === "Desktop 1440 v2 Dark")) { print("v2 dark frames already exist"); return; }
  let nextX = Math.max(...page.children.filter(c => c.type === "FRAME").map(c => c.x + c.width)) + 200;
  const hasFills = n => "fills" in n && n.fills !== figma.mixed;
  const solids = n => (hasFills(n) ? n.fills.filter(p => p.type === "SOLID" && p.visible !== false) : []);
  const walk = (n, fn) => { fn(n); if ("children" in n) for (const c of n.children) walk(c, fn); };
  const bgOf = n => {
    let p = n.parent;
    while (p && p.type !== "PAGE") {
      if (p.type !== "TEXT") { const s = solids(p); if (s.length) return s[s.length - 1].color; }
      p = p.parent;
    }
    return PAGE_BG;
  };
  const best = (c, bg) => {
    const alt = LIGHT[hex(c)] ? rgb(LIGHT[hex(c)]) : null;
    return alt && ratio(alt, bg) > ratio(c, bg) ? alt : c;
  };
  const made = [];
  for (const name of names) {
    const src = page.children.find(c => c.type === "FRAME" && c.name === name);
    if (!src) { out.push(name + " MISSING"); continue; }
    const d = src.clone();
    d.name = name + " Dark";
    d.x = nextX; d.y = src.y;
    nextX += d.width + 200;
    page.appendChild(d);
    made.push(d);
    walk(d, n => {
      if (n.type === "TEXT" || !hasFills(n)) return;
      n.fills = n.fills.map(p => {
        if (p.type !== "SOLID") return p;
        const to = FILL[hex(p.color)];
        return to ? Object.assign({}, p, { color: rgb(to) }) : p;
      });
    });
    walk(d, n => {
      if (n.type === "TEXT") {
        if (n.fills === figma.mixed) return;
        const bg = bgOf(n);
        n.fills = n.fills.map(p => (p.type === "SOLID" ? Object.assign({}, p, { color: best(p.color, bg) }) : p));
      } else if ("strokes" in n && n.strokes.length) {
        const bg = bgOf(n);
        n.strokes = n.strokes.map(p => (p.type === "SOLID" && hex(p.color) === "#1b2a22" ? Object.assign({}, p, { color: best(p.color, bg) }) : p));
      }
    });
    const sw = d.findOne(n => n.name === "Theme Switch");
    if (sw) {
      const knob = sw.findOne(n => n.name === "Switch Knob");
      const dot = sw.findOne(n => n.name === "Switch Sun");
      knob.fills = [{ type: "SOLID", color: rgb("#e8f0eb") }];
      sw.primaryAxisAlignItems = "MAX";
      if (dot) dot.x = sw.width - 4 - 24 + 7;
    }
    if (d.numberOfFixedChildren !== undefined && src.numberOfFixedChildren) {
      try { d.overflowDirection = "VERTICAL"; d.numberOfFixedChildren = src.numberOfFixedChildren; } catch (e) { out.push(d.name + " fixed flag failed"); }
    }
  }
  let total = 0, fails = 0;
  const seen = {};
  for (const d of made) {
    walk(d, n => {
      if (n.type !== "TEXT" || n.fills === figma.mixed) return;
      const p = n.fills.find(f => f.type === "SOLID" && f.visible !== false);
      if (!p) return;
      const bg = bgOf(n);
      const r = ratio(p.color, bg);
      const large = n.fontSize >= 24 || (n.fontSize >= 18.66 && n.fontName !== figma.mixed && /bold|semi|black|heavy/i.test(n.fontName.style));
      total++;
      if (r < (large ? 3 : 4.5)) { fails++; const k = hex(p.color) + " on " + hex(bg) + " " + r.toFixed(2); seen[k] = (seen[k] || 0) + 1; }
    });
  }
  figma.viewport.scrollAndZoomIntoView(made);
  out.push("created " + made.length + " dark frames | texts " + total + ", below AA " + fails + (fails ? " [" + Object.entries(seen).map(e => e[0] + " x" + e[1]).join("; ") + "]" : ""));
  print(out.join(" | "));
})();
