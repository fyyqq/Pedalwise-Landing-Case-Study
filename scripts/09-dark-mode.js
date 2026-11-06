// Scripter script 09 (Round 3, change 4): dark mode for Desktop 1440 and Mobile 390.
// Client request: a dark version of the page. Plan from script 08 (colour inventory):
//   page bg #f7faf8 -> #0f1713, cards/white fills #ffffff -> #1a2620, footer #1b2a22 -> #070b09,
//   sticky bar white@0.96 -> bg dark, orange #f28c28 and green fills/strokes stay (brand colours).
//   Text and dark strokes are chosen by contrast against the fill behind them (original or a light variant),
//   so dark text on the orange button stays dark and green text on a dark card gets a lighter green.
// Originals are not touched: clones named "... Dark" are placed to the right. Runs with figma and print as arguments.
// Does NOT use variable modes (free Starter plan limits modes), plain recolour of cloned frames.
const page = figma.currentPage;
const out = [];
const hex = c => "#" + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const lum = c => { const f = v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const FILL = { "#ffffff": "#1a2620", "#f7faf8": "#0f1713", "#1b2a22": "#070b09" };
const PAGE_BG = rgb("#0f1713");

const orig = {
  d: page.children.find(c => c.type === "FRAME" && c.name === "Desktop 1440"),
  m: page.children.find(c => c.type === "FRAME" && c.name === "Mobile 390"),
};
if (!orig.d || !orig.m) {
  print("Desktop 1440 or Mobile 390 is missing");
} else if (page.children.find(c => c.name === "Desktop 1440 Dark" || c.name === "Mobile 390 Dark")) {
  print("Dark frames already exist");
} else {
  const maxRight = Math.max(...page.children.filter(c => c.type === "FRAME").map(c => c.x + c.width));
  const dd = orig.d.clone();
  dd.name = "Desktop 1440 Dark";
  dd.x = maxRight + 200;
  dd.y = orig.d.y;
  const md = orig.m.clone();
  md.name = "Mobile 390 Dark";
  md.x = dd.x + dd.width + 200;
  md.y = orig.m.y;
  page.appendChild(dd);
  page.appendChild(md);

  const hasFills = n => "fills" in n && n.fills !== figma.mixed;
  const solids = n => (hasFills(n) ? n.fills.filter(p => p.type === "SOLID" && p.visible !== false) : []);
  const walk = (n, fn) => { fn(n); if ("children" in n) for (const c of n.children) walk(c, fn); };

  // pass 1: backgrounds and shapes (not text)
  let recolored = 0;
  for (const root of [dd, md]) {
    walk(root, n => {
      if (n.type === "TEXT" || !hasFills(n)) return;
      const next = n.fills.map(p => {
        if (p.type !== "SOLID") return p;
        const to = FILL[hex(p.color)];
        if (!to) return p;
        recolored++;
        return Object.assign({}, p, { color: rgb(to) });
      });
      n.fills = next;
    });
  }

  // background colour behind a node: nearest ancestor with a visible solid fill
  const bgOf = n => {
    let p = n.parent;
    while (p && p.type !== "PAGE") {
      if (p.type !== "TEXT") {
        const s = solids(p);
        if (s.length) return s[s.length - 1].color;
      }
      p = p.parent;
    }
    return PAGE_BG;
  };
  const LIGHT = { "#1b2a22": "#e8f0eb", "#1e8e5a": "#4fd08f" };
  const best = (c, bg) => {
    const k = hex(c);
    const alt = LIGHT[k] ? rgb(LIGHT[k]) : null;
    if (alt && ratio(alt, bg) > ratio(c, bg)) return alt;
    return c;
  };

  // pass 2: text colours and dark strokes, chosen by contrast
  let textChanged = 0, strokeChanged = 0;
  for (const root of [dd, md]) {
    walk(root, n => {
      if (n.type === "TEXT") {
        if (n.fills === figma.mixed) return;
        const bg = bgOf(n);
        n.fills = n.fills.map(p => {
          if (p.type !== "SOLID") return p;
          const c = best(p.color, bg);
          if (hex(c) !== hex(p.color)) textChanged++;
          return Object.assign({}, p, { color: c });
        });
      } else if ("strokes" in n && n.strokes.length) {
        const bg = bgOf(n);
        n.strokes = n.strokes.map(p => {
          if (p.type !== "SOLID" || hex(p.color) !== "#1b2a22") return p;
          strokeChanged++;
          return Object.assign({}, p, { color: best(p.color, bg) });
        });
      }
    });
  }

  // keep the sticky bar fixed in the mobile clone
  try {
    md.overflowDirection = "VERTICAL";
    md.numberOfFixedChildren = 1;
  } catch (e) {
    out.push("fixed flag failed: " + e.message);
  }

  // contrast report over every text node
  let total = 0, fails = 0;
  const seen = {};
  for (const root of [dd, md]) {
    walk(root, n => {
      if (n.type !== "TEXT" || n.fills === figma.mixed) return;
      const p = n.fills.find(f => f.type === "SOLID" && f.visible !== false);
      if (!p) return;
      const bg = bgOf(n);
      const r = ratio(p.color, bg);
      const large = n.fontSize >= 24 || (n.fontSize >= 18.66 && n.fontName !== figma.mixed && /bold|semi|black|heavy/i.test(n.fontName.style));
      total++;
      if (r < (large ? 3 : 4.5)) {
        fails++;
        const k = hex(p.color) + " on " + hex(bg) + " " + r.toFixed(2);
        seen[k] = (seen[k] || 0) + 1;
      }
    });
  }
  out.push("created Desktop 1440 Dark + Mobile 390 Dark");
  out.push("fills recoloured " + recolored + ", text recoloured " + textChanged + ", strokes " + strokeChanged);
  out.push("texts " + total + ", below WCAG AA " + fails + (fails ? " [" + Object.entries(seen).map(e => e[0] + " x" + e[1]).join("; ") + "]" : ""));
  print(out.join(" | "));
  figma.viewport.scrollAndZoomIntoView([dd, md]);
}
