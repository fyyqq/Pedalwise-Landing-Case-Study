// Round 6c: three Pedalwise logo concepts on the Archive page of the SECOND file (frame "Logo Concepts").
// Run with figma and print as arguments (no top-level await). Draws every mark with ellipses, rounded rectangles and text only (no imported art).
return (async () => {
  const GREEN = "#1b8656", GREEN_D = "#46c28e", ORANGE = "#f28c28", INK = "#1b2a22", PAPER = "#f7faf8", NIGHT = "#0f1713", SNOW = "#e8f0eb";
  const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h) => ({ type: "SOLID", color: hex(h) });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  const page = figma.root.children.find((p) => p.name === "Archive");
  if (!page) { print("STOP: no page named Archive in this file. Run this in the second file."); return; }
  await figma.setCurrentPageAsync(page);
  const old = page.children.find((n) => n.name === "Logo Concepts");
  if (old) old.remove();

  const text = (str, size, style, color) => { const t = figma.createText(); t.fontName = { family: "Inter", style }; t.characters = str; t.fontSize = size; t.fills = [solid(color)]; return t; };
  const box = (name, w, h, fill, r) => { const f = figma.createFrame(); f.name = name; f.resize(w, h); f.fills = fill ? [solid(fill)] : []; f.cornerRadius = r || 0; f.clipsContent = false; return f; };
  let K = 1; // current scale of the mark (1 = 96 px box)
  // a straight rounded bar from (x1,y1) to (x2,y2) with thickness t, drawn as a rotated rectangle
  const bar = (parent, x1, y1, x2, y2, t, color) => {
    x1 *= K; y1 *= K; x2 *= K; y2 *= K; t *= K;
    const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a);
    const r = figma.createRectangle(); r.name = "Bar"; r.resize(L, t); r.cornerRadius = t / 2; r.fills = [solid(color)];
    parent.appendChild(r);
    r.relativeTransform = [[c, -s, x1 + s * t / 2], [s, c, y1 - c * t / 2]];
    return r;
  };
  const ring = (parent, cx, cy, d, stroke, color) => {
    cx *= K; cy *= K; d *= K; stroke *= K;
    const e = figma.createEllipse(); e.name = "Ring"; e.resize(d, d); e.fills = []; e.strokes = [solid(color)]; e.strokeWeight = stroke; e.strokeAlign = "INSIDE";
    parent.appendChild(e); e.x = cx - d / 2; e.y = cy - d / 2; return e;
  };
  const dot = (parent, cx, cy, d, color) => { cx *= K; cy *= K; d *= K; const e = figma.createEllipse(); e.name = "Dot"; e.resize(d, d); e.fills = [solid(color)]; parent.appendChild(e); e.x = cx - d / 2; e.y = cy - d / 2; return e; };

  // ---- the three marks, all drawn in a 96 x 96 box and scaled by resizing the frame at the end
  const markA = (g, o) => { // Wheel: ring, five spokes, orange hub
    const f = box("Logo Mark - Wheel", 96 * K, 96 * K, null, 0);
    ring(f, 48, 48, 92, 8, g);
    for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / 5; bar(f, 48, 48, 48 + 40 * Math.cos(a), 48 + 40 * Math.sin(a), 4, g); }
    dot(f, 48, 48, 22, o);
    return f;
  };
  const markB = (g, o, ink) => { // P tile: rounded square, white P, orange wheel dot
    const f = box("Logo Mark - P tile", 96 * K, 96 * K, null, 0);
    const tile = box("Tile", 96 * K, 96 * K, g, 26 * K); f.appendChild(tile);
    const p = text("P", 68 * K, "Bold", "#ffffff"); f.appendChild(p); p.x = (48 - 3) * K - p.width / 2; p.y = 47 * K - p.height / 2;
    const d = dot(f, 76, 76, 26, o); d.strokes = [solid(g)]; d.strokeWeight = 5 * K; d.strokeAlign = "OUTSIDE";
    return f;
  };
  const markC = (g, o) => { // Bike: two wheels and a frame
    const f = box("Logo Mark - Bike", 96 * K, 96 * K, null, 0);
    const R = [22, 62], F = [74, 62], BB = [46, 62], S = [36, 34], H = [64, 32];
    ring(f, R[0], R[1], 38, 6, g); ring(f, F[0], F[1], 38, 6, g);
    bar(f, R[0], R[1], BB[0], BB[1], 6, g); bar(f, BB[0], BB[1], S[0], S[1], 6, g); bar(f, R[0], R[1], S[0], S[1], 6, g);
    bar(f, S[0], S[1], H[0], H[1], 6, g); bar(f, BB[0], BB[1], H[0], H[1], 6, g); bar(f, H[0], H[1], F[0], F[1], 6, g);
    bar(f, S[0] - 8, S[1] - 5, S[0] + 3, S[1] - 5, 6, o); // seat
    bar(f, H[0] - 2, H[1] - 7, H[0] + 9, H[1] - 7, 6, o); // handlebar
    return f;
  };
  const marks = [
    { id: "A", name: "Wheel", why: "A bike wheel with five spokes and an orange hub. Reads as 'bike' at once and stays clear at 28 px.", fn: markA },
    { id: "B", name: "P tile", why: "A green rounded tile with a white P and an orange wheel dot. Works as an app icon, favicon and the chip on merchandise.", fn: markB },
    { id: "C", name: "Bike", why: "A simple bicycle drawn from two wheels and a frame. Friendliest and most literal; finer lines, so it needs more room.", fn: markC },
  ];

  const lock = (m, dark, size, label) => { // mark + wordmark
    const row = figma.createFrame(); row.name = label; row.layoutMode = "HORIZONTAL"; row.itemSpacing = Math.round(size * 0.35); row.counterAxisAlignItems = "CENTER";
    row.primaryAxisSizingMode = "AUTO"; row.counterAxisSizingMode = "AUTO"; row.fills = [];
    K = size / 96; const mk = m.fn(dark ? GREEN_D : GREEN, ORANGE, dark ? SNOW : INK); K = 1;
    row.appendChild(mk);
    const t = text("Pedalwise", Math.round(size * 0.62), "Bold", dark ? SNOW : INK); row.appendChild(t);
    return row;
  };

  // ---- sheet
  const sheet = box("Logo Concepts", 1320, 100, PAPER, 0);
  sheet.layoutMode = "VERTICAL"; sheet.itemSpacing = 28; sheet.paddingLeft = sheet.paddingRight = 48; sheet.paddingTop = sheet.paddingBottom = 48;
  sheet.primaryAxisSizingMode = "AUTO"; sheet.counterAxisSizingMode = "FIXED"; sheet.clipsContent = true;
  const h1 = text("Pedalwise logo concepts (draft for Sam to choose)", 36, "Bold", INK); sheet.appendChild(h1);
  const sub = text("Three simple vector ideas drawn in Figma. Colours stay the brand green #1b8656 and orange #f28c28. Pick one, then it replaces the green circle in the menu, footer and merchandise chips.", 18, "Regular", "#46584e");
  sheet.appendChild(sub); sub.layoutSizingHorizontal = "FILL"; sub.textAutoResize = "HEIGHT";
  const report = [];
  for (const m of marks) {
    const card = box("Concept " + m.id + " - " + m.name, 1224, 100, "#ffffff", 20);
    card.layoutMode = "VERTICAL"; card.itemSpacing = 20; card.paddingLeft = card.paddingRight = card.paddingTop = card.paddingBottom = 32;
    card.primaryAxisSizingMode = "AUTO"; card.counterAxisSizingMode = "FIXED"; card.strokes = [solid("#d5e3db")]; card.strokeWeight = 1; card.clipsContent = true;
    sheet.appendChild(card); card.layoutSizingHorizontal = "FILL";
    const title = text("Concept " + m.id + ": " + m.name, 26, "Bold", INK); card.appendChild(title);
    const why = text(m.why, 16, "Regular", "#46584e"); card.appendChild(why); why.layoutSizingHorizontal = "FILL"; why.textAutoResize = "HEIGHT";
    const r = figma.createFrame(); r.name = "Samples"; r.layoutMode = "HORIZONTAL"; r.itemSpacing = 24; r.primaryAxisSizingMode = "AUTO"; r.counterAxisSizingMode = "AUTO"; r.fills = [];
    card.appendChild(r);
    const big = box("Big mark", 200, 200, PAPER, 16); big.layoutMode = "VERTICAL"; big.primaryAxisAlignItems = "CENTER"; big.counterAxisAlignItems = "CENTER"; big.strokes = [solid("#d5e3db")]; big.strokeWeight = 1;
    r.appendChild(big);
    K = 120 / 96; const bm = m.fn(GREEN, ORANGE, INK); K = 1;
    big.appendChild(bm);
    const l1 = box("Light lockup", 380, 200, PAPER, 16); l1.layoutMode = "HORIZONTAL"; l1.primaryAxisAlignItems = "CENTER"; l1.counterAxisAlignItems = "CENTER"; l1.strokes = [solid("#d5e3db")]; l1.strokeWeight = 1;
    r.appendChild(l1); l1.appendChild(lock(m, false, 56, "Lockup light"));
    const l2 = box("Dark lockup", 380, 200, NIGHT, 16); l2.layoutMode = "HORIZONTAL"; l2.primaryAxisAlignItems = "CENTER"; l2.counterAxisAlignItems = "CENTER";
    r.appendChild(l2); l2.appendChild(lock(m, true, 56, "Lockup dark"));
    const l3 = box("Nav size", 180, 200, "#ffffff", 16); l3.layoutMode = "VERTICAL"; l3.primaryAxisAlignItems = "CENTER"; l3.counterAxisAlignItems = "CENTER"; l3.itemSpacing = 16; l3.strokes = [solid("#d5e3db")]; l3.strokeWeight = 1;
    r.appendChild(l3); l3.appendChild(lock(m, false, 28, "Menu size 28"));
    const cap = text("Menu size (28 px)", 14, "Regular", "#46584e"); l3.appendChild(cap);
    report.push(m.id + " " + m.name + " ok");
  }
  // place to the right of everything already on the page
  let maxX = 0; for (const n of page.children) { if (n !== sheet) maxX = Math.max(maxX, n.x + n.width); }
  page.appendChild(sheet); sheet.x = maxX + 200; sheet.y = 0;
  figma.viewport.scrollAndZoomIntoView([sheet]);
  figma.currentPage.selection = [sheet];
  print("Logo concepts built: " + report.join(", ") + " | sheet " + Math.round(sheet.width) + " x " + Math.round(sheet.height) + " at x=" + Math.round(sheet.x));
})();
