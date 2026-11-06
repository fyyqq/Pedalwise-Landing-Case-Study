// Scripter script 50 (Round 6b: map placeholders replaced by a free station photo; was 46): the generator from 41 plus the SHOP. One generator builds the whole site on each size page, so nothing is duplicated by hand.
// Each size page gets 10 pages x light and dark = 20 frames: Home, About, Services, Prices, Shop, Contact (row A) and Product, Cart, Checkout, Confirmation (row B).
// Fully wired: menu, logo, footer, product cards, category cards, add to cart, checkout, pay, breadcrumbs -> the page frames (same size, same mode);
// orange/green WhatsApp buttons -> WhatsApp URL; theme switch -> the same page in the other mode. Self-links are skipped.
// Ideas from competitor sites (info strip, category tiles, featured products, filter chips, breadcrumb, size and quantity, cart summary, newsletter) are
// re-drawn from scratch: no text, photos or designs are copied. Text only uses facts the client gave; products, prices and process steps are marked sample / draft.
// The shop is a DESIGN ONLY: nothing is charged and no field holds a value. Photos: Unsplash (notes/04-photo-credits.md).
// Prints a result line per size, an overflow check and a WCAG contrast report. Runs with figma and print as arguments (leading await).
return (async () => {
  const log = [];
  const WA_URL = "https://wa.me/15550100"; // placeholder number from the brief (+1 555 0100)
  const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, a) => ({ type: "SOLID", color: rgb(h), opacity: a === undefined ? 1 : a });
  const shadow = (a, y, r) => ({ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: a }, offset: { x: 0, y: y }, radius: r, spread: 0, visible: true, blendMode: "NORMAL" });
  const glow = { type: "DROP_SHADOW", color: { r: 0.949, g: 0.549, b: 0.157, a: 0.35 }, offset: { x: 0, y: 6 }, radius: 16, spread: 0, visible: true, blendMode: "NORMAL" };
  const lum = c => { const f = v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  const THEMES = {
    light: { bg: "#f7faf8", alt: "#eef5f0", card: "#ffffff", nav: "#ffffff", tint: "#e6f3ea", text: "#1b2a22", muted: "#46584e", green: "#1b8656", greenText: "#177a4c", price: "#1e8e5a", border: "#1e8e5a", borderA: 0.25, footer: "#1b2a22", footerText: "#e8f0eb", banner: "#1b8656", orange: "#f28c28", onOrange: "#1b2a22", track: "#dcebe2", knob: "#ffffff", sun: "#f28c28", sh: 0.08 },
    dark: { bg: "#0f1713", alt: "#0b110e", card: "#1a2620", nav: "#1a2620", tint: "#12201a", text: "#e8f0eb", muted: "#a9bcb1", green: "#1b8656", greenText: "#4fd08f", price: "#4fd08f", border: "#4fd08f", borderA: 0.3, footer: "#070b09", footerText: "#e8f0eb", banner: "#164a33", orange: "#f28c28", onOrange: "#1b2a22", track: "#24352c", knob: "#e8f0eb", sun: "#a9bcb1", sh: 0.35 }
  };
  const SIZES = [
    { key: "desktop", page: "Desktop 1440", W: 1440, px: 120, cols: 3, hero2: true, h1: 64, h2: 40, body: 18, navTwo: false, steps: 3, gal: 3, sec: 96, pad: 28, gap: 24, linkGap: 28, shopCols: 4, catCols: 3, imgH: 220 },
    { key: "tablet", page: "iPhone Duo 669 + Tablet 768", W: 768, px: 40, cols: 2, hero2: false, h1: 48, h2: 34, body: 17, navTwo: true, steps: 3, gal: 3, sec: 72, pad: 24, gap: 20, linkGap: 24, shopCols: 2, catCols: 3, imgH: 200 },
    { key: "mobile", page: "Mobile 390", W: 390, px: 20, cols: 1, hero2: false, h1: 36, h2: 28, body: 16, navTwo: true, steps: 1, gal: 2, sec: 56, pad: 20, gap: 16, linkGap: 6, small: true, sticky: true, shopCols: 2, catCols: 1, imgH: 140 },
    { key: "duo", page: "iPhone Duo 669 + Tablet 768", W: 669, px: 32, cols: 2, hero2: false, h1: 44, h2: 32, body: 17, navTwo: true, steps: 3, gal: 3, sec: 64, pad: 24, gap: 20, linkGap: 20, shopCols: 2, catCols: 3, imgH: 180 }
  ];
  // Round 5b: optional config set by the caller (script 39 / 40): globalThis.PW_CFG = { only: ["desktop","tablet","mobile"], pages: { tablet: "Tablet 768" } }
  const CFG = (typeof globalThis !== "undefined" && globalThis.PW_CFG) || {};
  for (let i = SIZES.length - 1; i >= 0; i--) {
    if (CFG.only && CFG.only.indexOf(SIZES[i].key) === -1) SIZES.splice(i, 1);
    else if (CFG.pages && CFG.pages[SIZES[i].key]) SIZES[i].page = CFG.pages[SIZES[i].key];
  }
  // Free stock photos (Unsplash License: free for commercial use, no attribution required). Credits: notes/04-photo-credits.md
  const PHOTOS = [
    { id: "1675798227643-da319f8ee8f7", by: "Bohdan Kadun" },
    { id: "1675798225739-d8919b7a23f7", by: "Bohdan Kadun" },
    { id: "1676531356064-0a527118baf4", by: "Anton Savinov" },
    { id: "1671790639553-43973054c51e", by: "Anton Savinov" },
    { id: "1671543565338-8b22a87b8359", by: "Anton Savinov" },
    { id: "1684166472907-e17eec7e9475", by: "Glenn Carstens-Peters" },
    { id: "1767193315630-6a6683df1186", by: "Paul Yong" },
    { id: "1760310936486-4dd450aab2a8", by: "camera obscura" },
    // Round 6: product photos (indexes 8 to 19). Judged from Unsplash alt text, then checked by eye in Figma.
    { id: "1591047139334-337807f2b3e5", by: "Tobias Tullius" },
    { id: "1673121414328-52eff37bc6d0", by: "Frederik Rosar" },
    { id: "1786441113553-43414b842378", by: "KINGBULL Bikes" },
    { id: "1612638152051-ff2d83be4c5b", by: "Max Whitehead" },
    { id: "1701522814809-c339c2b60a7b", by: "Jan Kopriva" },
    { id: "1590092940833-0af304b36ee7", by: "Cobi Krumholz" },
    { id: "1775209601094-d2e9045652db", by: "T" },
    { id: "1579118690145-7753994c2d56", by: "Tower Electric Bikes" },
    { id: "1581655353564-df123a1eb820", by: "Haryo Setyadi" },
    { id: "1521369909029-2afed882baee", by: "Yang Deng" },
    { id: "1544816155-12df9643f363", by: "Kelly Sikkema" },
    { id: "1544003484-3cd181d17917", by: "Karl Kohler" },
    // Round 6b: replaces the grey map placeholders (index 20): a train station, because the exact address is not known
    { id: "1692342380430-6fa4010758bb", by: "Sugarman Joe" },
    // Round 6c: Sam said "just take the free maps picture online" (no address or Maps link): a free photo of a city map with a red pin (index 21)
    { id: "1619468129361-605ebea04b44", by: "GeoJango Maps" }
  ];
  const MAP_PHOTO = 21;
  const WORK = 8; // the first 8 photos are the workshop photos that cycle in the page sections
  const PHOTO_START = { home: 0, about: 4, services: 2 };
  // Sample products (NOT client facts): names, categories and prices are placeholders to be confirmed with Sam.
  const PRODUCTS = [
    { id: "city", cat: "Bicycles", name: "City commuter bike", price: "$450", photo: 8 },
    { id: "mountain", cat: "Bicycles", name: "Mountain bike", price: "$620", photo: 9 },
    { id: "ebike", cat: "Bicycles", name: "E-bike", price: "$1,450", photo: 10 },
    { id: "road", cat: "Bicycles", name: "Road bike", price: "$780", photo: 11 },
    { id: "helmet", cat: "Accessories", name: "Bike helmet", price: "$45", photo: 12 },
    { id: "helmet2", cat: "Accessories", name: "Commuter helmet", price: "$60", photo: 13 },
    { id: "lock", cat: "Accessories", name: "Bike lock", price: "$30", photo: 14 },
    { id: "light", cat: "Accessories", name: "Bike light", price: "$20", photo: 15 },
    { id: "tshirt", cat: "Merchandise", name: "Pedalwise T-shirt", price: "$25", photo: 16, logo: true },
    { id: "cap", cat: "Merchandise", name: "Pedalwise cap", price: "$18", photo: 17, logo: true },
    { id: "tote", cat: "Merchandise", name: "Pedalwise tote bag", price: "$15", photo: 18, logo: true },
    { id: "bottle", cat: "Merchandise", name: "Pedalwise water bottle", price: "$14", photo: 19, logo: true }
  ];
  const CATS = ["Bicycles", "Accessories", "Merchandise"];
  const byId = id => PRODUCTS.find(p => p.id === id);
  const NAV = [["home", "Home"], ["about", "About"], ["services", "Services"], ["prices", "Prices"], ["shop", "Shop"], ["contact", "Contact"]];
  const EXTRA = [["product", "Product"], ["cart", "Cart"], ["checkout", "Checkout"], ["confirmation", "Confirmation"]];
  const PAGELIST = NAV.concat(EXTRA);
  const SERVICES = [
    { name: "Basic tune-up", price: "$25", desc: "A general check and adjustment." },
    { name: "Full service", price: "$55", desc: "A complete check and service." },
    { name: "Flat tire fix", price: "$10", desc: "Puncture repair." },
    { name: "Brake or gear adjustment", price: "$15", desc: "Brake and gear adjustment." },
    { name: "E-bike repair", price: "", desc: "", link: "Ask us on WhatsApp" }
  ];
  const ABOUT_TEXT = "We repair bikes and e-bikes near the train station. Open Tue to Sun, 9am to 6pm. Book your repair on WhatsApp.";
  const SUB = "No surprise fees. We ask before any extra work.";

  for (const s of ["Regular", "Medium", "Semi Bold", "Bold"]) await figma.loadFontAsync({ family: "Inter", style: s });
  await figma.loadAllPagesAsync();
  const IMGS = [];
  for (const p of PHOTOS) {
    try { IMGS.push(await figma.createImageAsync("https://images.unsplash.com/photo-" + p.id + "?auto=format&fit=crop&w=1200&q=70&fm=jpg")); }
    catch (e) { IMGS.push(null); log.push("photo failed " + p.id + ": " + String((e && e.message) || e).slice(0, 80)); }
  }

  // ---------- small builders
  const mk = (name, dir, o) => {
    o = o || {};
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = dir;
    f.primaryAxisSizingMode = "AUTO"; f.counterAxisSizingMode = "AUTO"; // a new frame is 100 x 100 FIXED by default: hug content instead
    f.fills = o.fill ? [solid(o.fill)] : [];
    f.itemSpacing = o.gap || 0;
    f.paddingTop = o.py || 0; f.paddingBottom = o.py || 0; f.paddingLeft = o.px || 0; f.paddingRight = o.px || 0;
    f.primaryAxisAlignItems = o.main || "MIN";
    f.counterAxisAlignItems = o.cross || "MIN";
    f.clipsContent = false;
    if (o.r) f.cornerRadius = o.r;
    if (o.stroke) { f.strokes = [solid(o.stroke, o.sa === undefined ? 1 : o.sa)]; f.strokeWeight = o.sw || 1; }
    if (o.fx) f.effects = o.fx;
    return f;
  };
  const T = (s, size, style, color, o) => {
    o = o || {};
    const t = figma.createText();
    t.fontName = { family: "Inter", style: style };
    t.fontSize = size;
    t.characters = s;
    t.fills = [solid(color)];
    if (o.lh) t.lineHeight = { value: o.lh, unit: "PERCENT" };
    if (o.ls !== undefined) t.letterSpacing = { value: o.ls, unit: "PERCENT" };
    if (o.align) t.textAlignHorizontal = o.align;
    if (o.under) t.textDecoration = "UNDERLINE";
    return t;
  };
  // paragraph: fixed max width (centred blocks) or fill
  const para = (parent, t, maxW) => {
    parent.appendChild(t);
    if (maxW) { t.resize(maxW, t.height); t.textAutoResize = "HEIGHT"; } else { t.textAutoResize = "HEIGHT"; t.layoutSizingHorizontal = "FILL"; }
    return t;
  };
  const fillW = n => { n.layoutSizingHorizontal = "FILL"; return n; };

  // ---------- one page
  const buildPage = (S, mode, key, label, ctx) => {
    const th = THEMES[mode];
    const inner = S.W - 2 * S.px;
    const link = (node, kind, target) => ctx.links.push({ node, kind, target });
    const f = mk(label + " - " + (mode === "light" ? "Light" : "Dark") + " - " + S.W, "VERTICAL", { fill: th.bg });
    f.primaryAxisSizingMode = "AUTO"; f.counterAxisSizingMode = "FIXED"; f.resize(S.W, 100); f.primaryAxisSizingMode = "AUTO";
    let alt = false;
    const sectionFill = () => { alt = !alt; return alt ? th.bg : th.alt; };

    // kind: orange | green | outline. tgt: a page key (page link), otherwise the button opens WhatsApp.
    const btn = (text, kind, name, big, tgt) => {
      const o = kind === "orange", ol = kind === "outline";
      const b = mk(name, "HORIZONTAL", { fill: o ? th.orange : (ol ? th.card : th.green), py: big ? 17 : 15, px: big ? 32 : (S.small ? 16 : 24), main: "CENTER", cross: "CENTER", r: 12, stroke: ol ? th.border : null, sa: 0.6, fx: [o ? glow : shadow(ol ? 0.06 : 0.12, ol ? 2 : 4, ol ? 6 : 10)] });
      b.appendChild(T(text, big ? 18 : (S.small ? 15 : 16), "Semi Bold", o ? th.onOrange : (ol ? th.text : "#ffffff")));
      if (tgt) link(b, "page", tgt); else link(b, "url", WA_URL);
      return b;
    };
    const pill = txt => {
      const p = mk("Draft Pill", "HORIZONTAL", { px: 12, py: 4, r: 999, stroke: th.orange, sw: 1.5, cross: "CENTER" });
      p.appendChild(T(txt, 14, "Medium", th.text));
      return p;
    };
    const cartBtn = () => {
      const b = mk("Nav Cart Button", "HORIZONTAL", { fill: th.card, py: 15, px: S.small ? 14 : 20, gap: 8, main: "CENTER", cross: "CENTER", r: 12, stroke: th.border, sa: 0.5 });
      b.appendChild(T("Cart", S.small ? 15 : 16, "Semi Bold", th.text));
      const bd = mk("Cart Count", "HORIZONTAL", { fill: th.orange, main: "CENTER", cross: "CENTER", r: 11 });
      bd.primaryAxisSizingMode = "FIXED"; bd.counterAxisSizingMode = "FIXED"; bd.resize(22, 22);
      bd.appendChild(T("2", 14, "Bold", th.onOrange)); b.appendChild(bd);
      link(b, "page", "cart");
      return b;
    };
    const sw = () => {
      const w = S.small ? 52 : 56, h = 32, k = 24;
      const s = mk("Theme Switch", "HORIZONTAL", { fill: th.track, r: 16, px: 4, cross: "CENTER", main: mode === "dark" ? "MAX" : "MIN", stroke: th.border, sa: 0.4 });
      s.primaryAxisSizingMode = "FIXED"; s.counterAxisSizingMode = "FIXED"; s.resize(w, h);
      const knob = figma.createEllipse(); knob.name = "Switch Knob"; knob.resize(k, k); knob.fills = [solid(th.knob)]; knob.effects = [shadow(0.2, 1, 3)];
      s.appendChild(knob);
      const dot = figma.createEllipse(); dot.name = "Switch Sun"; dot.resize(10, 10); dot.fills = [solid(th.sun)];
      s.appendChild(dot); dot.layoutPositioning = "ABSOLUTE";
      dot.x = mode === "dark" ? w - 4 - k + 7 : 4 + 7; dot.y = 11;
      link(s, "theme", null);
      return s;
    };
    const logo = () => {
      const l = mk("Logo", "HORIZONTAL", { gap: 10, cross: "CENTER" });
      const d = figma.createEllipse(); d.name = "Logo Mark"; d.resize(28, 28); d.fills = [solid(th.green)];
      l.appendChild(d); l.appendChild(T("Pedalwise", S.small ? 20 : 22, "Bold", th.text));
      link(l, "page", "home");
      return l;
    };
    const links = () => {
      const row = mk("Nav Links", "HORIZONTAL", { gap: S.linkGap, cross: "CENTER" });
      const cur = key === "product" ? "shop" : key; // the product page sits under Shop
      for (const [k, lab] of NAV) {
        const item = mk("Nav Link - " + lab, "HORIZONTAL", { py: 10, px: 2, cross: "CENTER" });
        item.appendChild(T(lab, S.small ? 15 : 16, k === cur ? "Bold" : "Medium", k === cur ? th.greenText : th.text, { under: k === cur }));
        row.appendChild(item); link(item, "page", k);
      }
      return row;
    };
    const buildNav = () => {
      const n = mk("Nav", S.navTwo ? "VERTICAL" : "HORIZONTAL", { fill: th.nav, px: S.px, py: S.navTwo ? 12 : 16, gap: S.navTwo ? 4 : 0, main: "SPACE_BETWEEN", cross: S.navTwo ? "CENTER" : "CENTER", fx: [shadow(th.sh * 0.75, 2, 12)] });
      f.appendChild(n); fillW(n);
      const actions = mk("Nav Actions", "HORIZONTAL", { gap: S.small ? 10 : 16, cross: "CENTER" });
      actions.appendChild(sw()); actions.appendChild(cartBtn());
      if (!S.small) actions.appendChild(btn("Chat on WhatsApp", "green", "Nav WhatsApp Button")); // on mobile the sticky bar already has WhatsApp
      if (S.navTwo) {
        const top = mk("Nav Top", "HORIZONTAL", { main: "SPACE_BETWEEN", cross: "CENTER" });
        n.appendChild(top); fillW(top);
        top.appendChild(logo()); top.appendChild(actions);
        const lk = links(); n.appendChild(lk);
      } else {
        n.appendChild(logo()); n.appendChild(links()); n.appendChild(actions);
      }
    };
    const section = (name, fill) => {
      const s = mk(name, "VERTICAL", { fill: fill, px: S.px, py: S.sec, gap: S.small ? 28 : 40, cross: "CENTER" });
      f.appendChild(s); fillW(s);
      return s;
    };
    const heading = (parent, title, sub, pill, big) => {
      const h = mk("Section Header", "VERTICAL", { gap: 12, cross: "CENTER" });
      parent.appendChild(h); fillW(h);
      if (pill) {
        const p = mk("Draft Pill", "HORIZONTAL", { px: 12, py: 4, r: 999, stroke: th.orange, sw: 1.5, cross: "CENTER" });
        p.appendChild(T("Draft wording, to be confirmed", 14, "Medium", th.text)); h.appendChild(p);
      }
      para(h, T(title, big ? S.h1 : S.h2, "Bold", th.text, { align: "CENTER", ls: -1.5, lh: 115 }));
      const bar = figma.createRectangle(); bar.name = "Accent Bar"; bar.resize(56, 4); bar.cornerRadius = 2; bar.fills = [solid(th.price)]; h.appendChild(bar);
      if (sub) para(h, T(sub, S.body, "Regular", th.muted, { align: "CENTER", lh: 150 }), Math.min(inner, 640));
      return h;
    };
    let phIdx = PHOTO_START[key] || 0;
    const placeholder = (label, w, h) => {
      if (label === "Photo placeholder" || (label === "Map placeholder" && IMGS[MAP_PHOTO])) {
        const i = label === "Map placeholder" ? MAP_PHOTO : (phIdx++) % WORK;
        if (IMGS[i]) {
          const q = mk("Photo - " + PHOTOS[i].by + " (Unsplash)", "VERTICAL", { r: 24, stroke: th.border, sa: th.borderA, fx: [shadow(th.sh * 1.2, 12, 32)] });
          q.primaryAxisSizingMode = "FIXED"; q.counterAxisSizingMode = "FIXED"; q.resize(w || 400, h);
          q.fills = [{ type: "IMAGE", imageHash: IMGS[i].hash, scaleMode: "FILL" }];
          q.clipsContent = true;
          return q;
        }
      }
      const p = mk("Photo Placeholder", "VERTICAL", { fill: th.card, r: 24, main: "CENTER", cross: "CENTER", gap: 10, stroke: th.border, sa: th.borderA, fx: [shadow(th.sh * 1.2, 12, 32)] });
      p.primaryAxisSizingMode = "FIXED"; p.counterAxisSizingMode = "FIXED"; p.resize(w || 400, h);
      const c = figma.createEllipse(); c.name = "Placeholder Mark"; c.resize(56, 56); c.fills = [solid(th.tint)]; c.strokes = [solid(th.border, 0.4)]; c.strokeWeight = 1;
      p.appendChild(c); p.appendChild(T(label, 14, "Medium", th.muted));
      return p;
    };
    const slot = (parent, node, w) => { parent.appendChild(node); if (w) { node.layoutSizingHorizontal = "FIXED"; node.resize(w, node.height); } else node.layoutSizingHorizontal = "FILL"; return node; };
    // grid of cards, rows centred, equal heights per row
    const grid = (parent, items, cols, gap) => {
      const wrap = mk("Grid", "VERTICAL", { gap: gap }); parent.appendChild(wrap); fillW(wrap);
      const colW = Math.floor((inner - gap * (cols - 1)) / cols);
      for (let i = 0; i < items.length; i += cols) {
        const row = mk("Row", "HORIZONTAL", { gap: gap, main: "CENTER" }); wrap.appendChild(row); fillW(row);
        for (const it of items.slice(i, i + cols)) {
          row.appendChild(it);
          if (cols === 1) it.layoutSizingHorizontal = "FILL"; else { it.layoutSizingHorizontal = "FIXED"; it.resize(colW, it.height); }
          it.layoutSizingVertical = "FILL";
        }
      }
      return wrap;
    };
    const cardBase = name => mk(name, "VERTICAL", { fill: th.card, r: 20, px: S.pad, py: S.pad, gap: 10, stroke: th.border, sa: th.borderA, fx: [shadow(th.sh, 10, 28)] });
    const serviceCard = svc => {
      const c = cardBase("Card - " + svc.name);
      para(c, T(svc.name, 20, "Semi Bold", th.text));
      if (svc.price) para(c, T(svc.price, 28, "Bold", th.price));
      if (svc.desc) para(c, T(svc.desc, 16, "Regular", th.muted, { lh: 150 }));
      if (svc.link) { const l = T(svc.link, 16, "Semi Bold", th.greenText, { under: true }); para(c, l); link(l, "url", WA_URL); }
      return c;
    };

    // ----- section builders
    const hero = (title, sub, withBadge, withButton, withShop) => {
      const s = mk("Hero Section", "VERTICAL", { fill: th.tint, px: S.px, py: S.sec, gap: S.small ? 28 : 48, cross: "CENTER" });
      f.appendChild(s); fillW(s);
      const body = mk("Hero Body", S.hero2 ? "HORIZONTAL" : "VERTICAL", { gap: S.hero2 ? 64 : 28, cross: S.hero2 ? "CENTER" : "MIN" });
      s.appendChild(body); fillW(body);
      const text = mk("Hero Text", "VERTICAL", { gap: S.small ? 16 : 20 });
      body.appendChild(text); fillW(text);
      if (withBadge) {
        const b = mk("Hero Badge", "HORIZONTAL", { fill: th.card, px: 14, py: 8, r: 999, stroke: th.border, sa: 0.3, cross: "CENTER" });
        text.appendChild(b);
        const bt = T("Near the train station · Open Tue to Sun, 9am to 6pm", 14, "Medium", th.muted); b.appendChild(bt);
        if (S.small) { bt.textAutoResize = "HEIGHT"; bt.layoutSizingHorizontal = "FILL"; b.layoutSizingHorizontal = "FILL"; }
      }
      para(text, T(title, S.h1, "Bold", th.text, { ls: -1.5, lh: 112 }));
      para(text, T(sub, S.body + 2, "Regular", th.muted, { lh: 150 }), S.hero2 ? 520 : null);
      if (withButton) {
        const b = btn("Chat on WhatsApp", "orange", "Hero WhatsApp Button", true);
        if (withShop) {
          const br = mk("Hero Buttons", S.small ? "VERTICAL" : "HORIZONTAL", { gap: 12 });
          text.appendChild(br); fillW(br);
          br.appendChild(b); br.appendChild(btn("Shop now", "outline", "Shop Now Button", true, "shop"));
          if (S.small) for (const x of br.children) x.layoutSizingHorizontal = "FILL";
        } else text.appendChild(b);
      }
      const ph = placeholder("Photo placeholder", S.hero2 ? 520 : 300, S.hero2 ? 400 : (S.small ? 240 : 320));
      body.appendChild(ph);
      if (S.hero2) { ph.layoutSizingHorizontal = "FIXED"; } else { ph.layoutSizingHorizontal = "FILL"; }
      return s;
    };
    const pageHeader = (title, sub, pillText) => {
      const s = mk("Page Header", "VERTICAL", { fill: th.tint, px: S.px, py: Math.round(S.sec * 0.8), gap: 16, cross: "CENTER" });
      f.appendChild(s); fillW(s);
      if (pillText) s.appendChild(pill(pillText));
      para(s, T(title, S.h1, "Bold", th.text, { align: "CENTER", ls: -1.5, lh: 112 }));
      const bar = figma.createRectangle(); bar.name = "Accent Bar"; bar.resize(56, 4); bar.cornerRadius = 2; bar.fills = [solid(th.price)]; s.appendChild(bar);
      if (sub) para(s, T(sub, S.body + 2, "Regular", th.muted, { align: "CENTER", lh: 150 }), Math.min(inner, 640));
      return s;
    };
    const servicesSection = withTitle => {
      const s = section("Services Section", sectionFill());
      if (withTitle) heading(s, "Services", SUB);
      grid(s, SERVICES.map(serviceCard), S.cols, S.gap);
      return s;
    };
    const priceList = () => {
      const s = section("Price List Section", sectionFill());
      const card = mk("Price List", "VERTICAL", { fill: th.card, r: 20, px: S.pad + 8, py: S.pad, gap: 0, stroke: th.border, sa: th.borderA, fx: [shadow(th.sh, 10, 28)] });
      s.appendChild(card); card.layoutSizingHorizontal = "FIXED"; card.resize(Math.min(inner, 760), card.height);
      SERVICES.forEach((svc, i) => {
        const row = mk("Price Row - " + svc.name, "HORIZONTAL", { py: 20, main: "SPACE_BETWEEN", cross: "CENTER", gap: 16 });
        card.appendChild(row); fillW(row);
        row.appendChild(T(svc.name, S.small ? 17 : 20, "Semi Bold", th.text));
        if (svc.price) row.appendChild(T(svc.price, S.small ? 24 : 28, "Bold", th.price));
        else { const l = T(svc.link, 16, "Semi Bold", th.greenText, { under: true }); row.appendChild(l); link(l, "url", WA_URL); }
        if (i < SERVICES.length - 1) { const d = figma.createRectangle(); d.name = "Divider"; d.resize(100, 1); d.fills = [solid(th.border, 0.25)]; card.appendChild(d); d.layoutSizingHorizontal = "FILL"; }
      });
      para(s, T(SUB, S.body, "Regular", th.muted, { align: "CENTER" }), Math.min(inner, 640));
      return s;
    };
    const stepsSection = () => {
      const s = section("How It Works Section", sectionFill());
      heading(s, "How it works", "Three simple steps.", true);
      const items = [["1", "Message us", "Tell us about your bike on WhatsApp."], ["2", "Bring it in", "Drop your bike off near the train station."], ["3", "Pick it up", "Collect it when the repair is done."]].map(st => {
        const c = cardBase("Step " + st[0]);
        const n = mk("Step Number", "HORIZONTAL", { fill: th.green, r: 20, main: "CENTER", cross: "CENTER" });
        n.primaryAxisSizingMode = "FIXED"; n.counterAxisSizingMode = "FIXED"; n.resize(40, 40);
        n.appendChild(T(st[0], 18, "Bold", "#ffffff")); c.appendChild(n);
        para(c, T(st[1], 20, "Semi Bold", th.text)); para(c, T(st[2], 16, "Regular", th.muted, { lh: 150 }));
        return c;
      });
      grid(s, items, S.steps, S.gap);
      return s;
    };
    const gallerySection = () => {
      const s = section("Workshop Photos Section", sectionFill());
      heading(s, "Bike repair in pictures", "Stock photos for now. Photos of the shop will replace them.");
      const cols = S.gal, gap = S.gap, colW = Math.floor((inner - gap * (cols - 1)) / cols);
      const row = mk("Photo Row", "HORIZONTAL", { gap: gap, main: "CENTER" }); s.appendChild(row); fillW(row);
      for (let i = 0; i < cols; i++) { const p = placeholder("Photo placeholder", colW, Math.round(colW * 0.75)); row.appendChild(p); p.layoutSizingHorizontal = "FIXED"; }
      return s;
    };
    const infoCard = (title, value, extra) => {
      const c = cardBase("Info - " + title);
      para(c, T(title, 14, "Semi Bold", th.greenText, { ls: 4 }));
      para(c, T(value, 20, "Semi Bold", th.text, { lh: 130 }));
      return c;
    };
    const hoursSection = () => {
      const s = section("Visit Us Section", sectionFill());
      heading(s, "Visit us", "Open Tue to Sun, near the train station.");
      grid(s, [infoCard("OPENING HOURS", "Tue to Sun, 9am to 6pm"), infoCard("LOCATION", "Near the train station"), infoCard("WHATSAPP", "+1 555 0100")], S.cols === 1 ? 1 : 3, S.gap);
      const map = placeholder("Map placeholder", inner, S.small ? 180 : 260);
      s.appendChild(map); map.layoutSizingHorizontal = "FILL";
      para(s, T("Sample map (free stock photo). The real map of the shop replaces it once the address is confirmed.", 14, "Regular", th.muted, { align: "CENTER", lh: 150 }), Math.min(inner, 640));
      return s;
    };
    const faqSection = () => {
      const s = section("FAQ Section", sectionFill());
      heading(s, "Questions", "Short answers to the most common ones.");
      const qa = [["How do I book a repair?", "Message us on WhatsApp."], ["Do you repair e-bikes?", "Yes. Ask us on WhatsApp."], ["Are there extra fees?", SUB], ["When are you open?", "Tue to Sun, 9am to 6pm."]].map(x => {
        const c = cardBase("FAQ - " + x[0]);
        para(c, T(x[0], 18, "Semi Bold", th.text)); para(c, T(x[1], 16, "Regular", th.muted, { lh: 150 }));
        return c;
      });
      grid(s, qa, S.cols === 1 ? 1 : 2, S.gap);
      return s;
    };
    const bannerSection = (title, sub) => {
      const s = mk("WhatsApp Banner", "VERTICAL", { fill: th.banner, px: S.px, py: Math.round(S.sec * 0.8), gap: 20, cross: "CENTER" });
      f.appendChild(s); fillW(s);
      para(s, T(title || "Ready to book your repair?", S.h2, "Bold", "#ffffff", { align: "CENTER", ls: -1.5, lh: 115 }));
      para(s, T(sub || "Message us on WhatsApp.", S.body, "Regular", "#ffffff", { align: "CENTER" }), Math.min(inner, 640));
      s.appendChild(btn("Chat on WhatsApp", "orange", "Banner WhatsApp Button", true));
      return s;
    };
    const contactSection = () => {
      const s = section("Contact Section", sectionFill());
      heading(s, "Contact", "The fastest way to reach us is WhatsApp.");
      const card = mk("Contact Card", "VERTICAL", { fill: th.card, r: 24, px: S.pad + 12, py: S.pad + 12, gap: 14, cross: "CENTER", stroke: th.border, sa: th.borderA, fx: [shadow(th.sh, 10, 28)] });
      s.appendChild(card); card.layoutSizingHorizontal = "FIXED"; card.resize(Math.min(inner, 640), card.height);
      card.appendChild(btn("Chat on WhatsApp", "orange", "Contact WhatsApp Button", true));
      para(card, T("+1 555 0100", 20, "Semi Bold", th.text, { align: "CENTER" }));
      para(card, T("Open Tue to Sun, 9am to 6pm", S.body, "Regular", th.muted, { align: "CENTER" }));
      para(card, T("Near the train station", S.body, "Regular", th.muted, { align: "CENTER" }));
      const map = placeholder("Map placeholder", inner, S.small ? 180 : 260);
      s.appendChild(map); map.layoutSizingHorizontal = "FILL";
      para(s, T("Sample map (free stock photo). The real map of the shop replaces it once the address is confirmed.", 14, "Regular", th.muted, { align: "CENTER", lh: 150 }), Math.min(inner, 640));
      return s;
    };
    const footer = () => {
      const s = mk("Footer", S.hero2 ? "HORIZONTAL" : "VERTICAL", { fill: th.footer, px: S.px, py: 40, gap: 20, main: "SPACE_BETWEEN", cross: S.hero2 ? "CENTER" : "MIN" });
      f.appendChild(s); fillW(s);
      const lg = mk("Footer Logo", "HORIZONTAL", { gap: 10, cross: "CENTER" });
      const d = figma.createEllipse(); d.name = "Logo Mark"; d.resize(24, 24); d.fills = [solid(th.green)]; lg.appendChild(d);
      lg.appendChild(T("Pedalwise", 20, "Bold", th.footerText)); s.appendChild(lg); link(lg, "page", "home");
      const row = mk("Footer Links", "HORIZONTAL", { gap: S.small ? 12 : 20, cross: "CENTER" }); s.appendChild(row);
      for (const [k, lab] of NAV.filter(n => n[0] !== "home")) {
        const item = mk("Footer Link - " + lab, "HORIZONTAL", { py: 10, px: 2 }); item.appendChild(T(lab, 16, "Medium", th.footerText)); row.appendChild(item); link(item, "page", k);
      }
      s.appendChild(T("© 2026 Pedalwise", 14, "Regular", th.footerText));
      return s;
    };

    // ================= Round 6: shop builders =================
    const panel = (name, gap) => mk(name, "VERTICAL", { fill: th.card, r: 20, px: S.pad, py: S.pad, gap: gap === undefined ? 12 : gap, stroke: th.border, sa: th.borderA, fx: [shadow(th.sh, 10, 28)] });
    const divider = parent => { const d = figma.createRectangle(); d.name = "Divider"; d.resize(100, 1); d.fills = [solid(th.border, 0.25)]; parent.appendChild(d); d.layoutSizingHorizontal = "FILL"; return d; };
    // product photo frame (fixed height, fills the width it is given); merch gets a "Pedalwise" logo mock-up chip
    const prodImg = (p, h, noChip) => {
      const ph = PHOTOS[p.photo];
      const q = mk("Product Photo - " + p.name + " (Unsplash, " + ph.by + ")", "VERTICAL", {});
      q.primaryAxisSizingMode = "FIXED"; q.counterAxisSizingMode = "FIXED"; q.resize(100, h);
      q.fills = IMGS[p.photo] ? [{ type: "IMAGE", imageHash: IMGS[p.photo].hash, scaleMode: "FILL" }] : [solid(th.tint)];
      q.clipsContent = true;
      if (p.logo && !noChip) {
        const chip = mk("Logo Mock-up Chip", "HORIZONTAL", { fill: "#ffffff", px: 10, py: 6, gap: 6, r: 999, cross: "CENTER" });
        const d = figma.createEllipse(); d.name = "Logo Mark"; d.resize(14, 14); d.fills = [solid("#1b8656")]; chip.appendChild(d);
        chip.appendChild(T("Pedalwise", 14, "Bold", "#1b2a22"));
        q.appendChild(chip); chip.layoutPositioning = "ABSOLUTE"; chip.x = 10; chip.y = h - 40;
      }
      return q;
    };
    const productCard = p => {
      const c = mk("Product Card - " + p.name, "VERTICAL", { fill: th.card, r: 20, stroke: th.border, sa: th.borderA, fx: [shadow(th.sh, 10, 28)] });
      c.clipsContent = true;
      const img = prodImg(p, S.imgH); c.appendChild(img); img.layoutSizingHorizontal = "FILL";
      const body = mk("Product Info", "VERTICAL", { px: S.small ? 12 : 18, py: S.small ? 12 : 18, gap: 12 });
      c.appendChild(body); body.layoutSizingHorizontal = "FILL"; // (a FILL height here clipped the button in Figma, so the body just hugs)
      const info = mk("Product Text", "VERTICAL", { gap: 4 }); body.appendChild(info); info.layoutSizingHorizontal = "FILL";
      para(info, T(p.cat.toUpperCase(), 14, "Semi Bold", th.greenText, { ls: 4 }));
      para(info, T(p.name, S.small ? 16 : 18, "Semi Bold", th.text, { lh: 125 }));
      para(info, T(p.price, S.small ? 20 : 22, "Bold", th.price));
      const add = btn("Add to cart", "green", "Add to Cart Button", false, "cart");
      body.appendChild(add); add.layoutSizingHorizontal = "FILL";
      link(c, "page", "product");
      return c;
    };
    const productGrid = (title, sub, list, name) => {
      const s = section(name || (title + " Section"), sectionFill());
      heading(s, title, sub);
      grid(s, list.map(productCard), S.shopCols, S.gap);
      return s;
    };
    const shopLink = (parent, text, tgt, lname) => {
      const l = mk(lname, "HORIZONTAL", { py: 12, px: 4, cross: "CENTER" });
      l.appendChild(T(text, 16, "Semi Bold", th.greenText, { under: true })); parent.appendChild(l); link(l, "page", tgt);
      return l;
    };
    const catCard = cat => {
      const p = PRODUCTS.find(x => x.cat === cat);
      const n = PRODUCTS.filter(x => x.cat === cat).length;
      const c = mk("Category Card - " + cat, "VERTICAL", { fill: th.card, r: 20, stroke: th.border, sa: th.borderA, fx: [shadow(th.sh, 10, 28)] });
      c.clipsContent = true;
      const img = prodImg(p, S.small ? 150 : 200, true); c.appendChild(img); img.layoutSizingHorizontal = "FILL";
      const body = mk("Category Info", "VERTICAL", { px: 20, py: 18, gap: 4 }); c.appendChild(body); body.layoutSizingHorizontal = "FILL";
      para(body, T(cat, 20, "Semi Bold", th.text));
      para(body, T(n + " sample items", 14, "Regular", th.muted));
      body.appendChild(T("Shop " + cat.toLowerCase(), 16, "Semi Bold", th.greenText, { under: true }));
      link(c, "page", "shop");
      return c;
    };
    const categorySection = (title, sub) => {
      const s = section("Shop by Category Section", sectionFill());
      heading(s, title || "Shop by category", sub || "Bicycles, accessories and merchandise. Sample items, to be confirmed.");
      grid(s, CATS.map(catCard), S.catCols, S.gap);
      return s;
    };
    const infoStrip = () => {
      const s = mk("Info Strip Section", "VERTICAL", { fill: th.bg, px: S.px, py: S.small ? 20 : 28 });
      f.appendChild(s); fillW(s);
      const strip = mk("Info Strip", S.hero2 ? "HORIZONTAL" : "VERTICAL", { fill: th.card, r: 20, px: S.pad, py: 18, gap: 14, main: "SPACE_BETWEEN", cross: S.hero2 ? "CENTER" : "MIN", stroke: th.border, sa: th.borderA, fx: [shadow(th.sh, 10, 28)] });
      s.appendChild(strip); strip.layoutSizingHorizontal = "FILL";
      for (const t of ["Open Tue to Sun, 9am to 6pm", "Near the train station", "WhatsApp +1 555 0100"]) {
        const it = mk("Info Item", "HORIZONTAL", { gap: 10, cross: "CENTER" });
        const dot = figma.createEllipse(); dot.name = "Info Dot"; dot.resize(10, 10); dot.fills = [solid(th.price)];
        it.appendChild(dot); it.appendChild(T(t, 15, "Semi Bold", th.text)); strip.appendChild(it);
      }
      return s;
    };
    const newsletterSection = () => {
      const s = section("Newsletter Section", sectionFill());
      const card = mk("Newsletter Card", "VERTICAL", { fill: th.banner, r: 24, px: S.pad + 12, py: S.pad + 16, gap: 16, cross: "CENTER" });
      s.appendChild(card); card.layoutSizingHorizontal = "FILL";
      para(card, T("Shop news in your inbox", S.h2, "Bold", "#ffffff", { align: "CENTER", ls: -1.5, lh: 115 }));
      para(card, T("Design only: no email addresses are collected.", S.body, "Regular", "#ffffff", { align: "CENTER" }), Math.min(inner - 2 * S.pad - 24, 560));
      const row = mk("Newsletter Row", S.small ? "VERTICAL" : "HORIZONTAL", { gap: 12 });
      card.appendChild(row); row.layoutSizingHorizontal = "FIXED"; row.resize(Math.min(inner - 2 * S.pad - 24, 560), row.height);
      const fld = mk("Email Field", "HORIZONTAL", { fill: "#ffffff", px: 16, py: 15, r: 12, cross: "CENTER" });
      fld.appendChild(T("Your email", 16, "Regular", "#46584e")); row.appendChild(fld); fld.layoutSizingHorizontal = "FILL";
      const sb = btn("Subscribe", "orange", "Subscribe Button", false); row.appendChild(sb);
      if (S.small) sb.layoutSizingHorizontal = "FILL";
      ctx.links = ctx.links.filter(l => l.node !== sb); // design only: the button has no link
      return s;
    };
    const chip = (txt, active) => {
      const c = mk("Filter Chip - " + txt, "HORIZONTAL", { fill: active ? th.green : th.card, px: 18, py: 15, r: 999, main: "CENTER", cross: "CENTER", stroke: th.border, sa: active ? 0 : 0.4 });
      c.appendChild(T(txt, 15, "Semi Bold", active ? "#ffffff" : th.text));
      return c;
    };
    const toolbarSection = () => {
      const s = mk("Shop Toolbar Section", "VERTICAL", { fill: sectionFill(), px: S.px, py: S.small ? 20 : 28, cross: "CENTER" });
      f.appendChild(s); fillW(s);
      const row = mk("Filter Chips", "HORIZONTAL", { gap: 10, main: "CENTER" });
      s.appendChild(row); row.layoutSizingHorizontal = "FILL";
      for (const [t, a] of [["All", true], ["Bicycles", false], ["Accessories", false], ["Merchandise", false], ["Sort: Featured", false]]) row.appendChild(chip(t, a));
      try { row.layoutWrap = "WRAP"; row.counterAxisSpacing = 10; } catch (e) { log.push("wrap failed: " + e.message); }
      return s;
    };
    const shopPage = () => {
      pageHeader("Shop", "Bicycles, accessories and merchandise with the Pedalwise logo.", "Sample products, to be confirmed");
      toolbarSection();
      for (const cat of CATS) productGrid(cat, "Sample items, to be confirmed.", PRODUCTS.filter(x => x.cat === cat), cat + " Section");
      bannerSection("Need help choosing?", "Message us on WhatsApp.");
    };
    const crumbs = (items) => {
      const s = mk("Breadcrumb Section", "HORIZONTAL", { fill: sectionFill(), px: S.px, py: 12, gap: 6, cross: "CENTER" });
      f.appendChild(s); fillW(s);
      items.forEach((it, i) => {
        if (i) s.appendChild(T("/", 15, "Regular", th.muted));
        if (it[1]) { const c = mk("Breadcrumb Link - " + it[0], "HORIZONTAL", { py: 12, px: 2 }); c.appendChild(T(it[0], 15, "Medium", th.greenText, { under: true })); s.appendChild(c); link(c, "page", it[1]); }
        else s.appendChild(T(it[0], 15, "Medium", th.muted));
      });
      return s;
    };
    const box48 = (name, txt, active) => {
      const b = mk(name, "HORIZONTAL", { fill: active ? th.green : th.card, r: 12, main: "CENTER", cross: "CENTER", stroke: th.border, sa: active ? 0 : 0.5 });
      b.primaryAxisSizingMode = "FIXED"; b.counterAxisSizingMode = "FIXED"; b.resize(48, 48);
      b.appendChild(T(txt, 16, "Semi Bold", active ? "#ffffff" : th.text));
      return b;
    };
    const labelled = (parent, label, node) => {
      const w = mk("Option - " + label, "VERTICAL", { gap: 8 }); parent.appendChild(w); w.layoutSizingHorizontal = "FILL";
      w.appendChild(T(label, 14, "Semi Bold", th.muted)); w.appendChild(node);
      return w;
    };
    const productPage = () => {
      const p = byId("tshirt");
      crumbs([["Home", "home"], ["Shop", "shop"], [p.name, null]]);
      const s = section("Product Section", sectionFill());
      const body = mk("Product Body", S.hero2 ? "HORIZONTAL" : "VERTICAL", { gap: S.hero2 ? 56 : 28 });
      s.appendChild(body); fillW(body);
      const img = prodImg(p, S.hero2 ? 520 : (S.small ? 300 : 420)); body.appendChild(img);
      img.cornerRadius = 24; img.strokes = [solid(th.border, th.borderA)]; img.strokeWeight = 1;
      if (S.hero2) { img.layoutSizingHorizontal = "FIXED"; img.resize(560, 520); } else img.layoutSizingHorizontal = "FILL";
      const det = mk("Product Details", "VERTICAL", { gap: 18 }); body.appendChild(det); det.layoutSizingHorizontal = "FILL";
      const pills = mk("Product Pills", "HORIZONTAL", { gap: 8 }); det.appendChild(pills);
      pills.appendChild(pill("Sample product")); pills.appendChild(pill("Logo mock-up"));
      para(det, T(p.name, S.h2, "Bold", th.text, { ls: -1.5, lh: 115 }));
      const pr = mk("Price Row", "HORIZONTAL", { gap: 12, cross: "CENTER" }); det.appendChild(pr);
      pr.appendChild(T(p.price, 32, "Bold", th.price)); pr.appendChild(pill("Sample price"));
      para(det, T("Draft wording: a short product description goes here. A plain product with the Pedalwise logo.", S.body, "Regular", th.muted, { lh: 150 }));
      const sizes = mk("Size Options", "HORIZONTAL", { gap: 10 });
      for (const [t, a] of [["S", false], ["M", true], ["L", false], ["XL", false]]) sizes.appendChild(box48("Size Chip - " + t, t, a));
      labelled(det, "Size", sizes);
      const qty = mk("Quantity Stepper", "HORIZONTAL", { gap: 10 });
      qty.appendChild(box48("Quantity Minus", "−", false)); qty.appendChild(box48("Quantity Value", "1", false)); qty.appendChild(box48("Quantity Plus", "+", false));
      labelled(det, "Quantity", qty);
      const add = btn("Add to cart", "green", "Add to Cart Button", true, "cart"); det.appendChild(add);
      if (S.small) add.layoutSizingHorizontal = "FILL";
      const ask = T("Ask us on WhatsApp", 16, "Semi Bold", th.greenText, { under: true }); det.appendChild(ask); link(ask, "url", WA_URL);
      const acc = mk("Product Accordion", "VERTICAL", { fill: th.card, r: 20, px: S.pad, py: 8, stroke: th.border, sa: th.borderA });
      det.appendChild(acc); acc.layoutSizingHorizontal = "FILL";
      [["Details", "Sample product. Details to be confirmed.", true], ["Delivery and returns", null, false], ["Care", null, false]].forEach((r, i, arr) => {
        const row = mk("Accordion Row - " + r[0], "VERTICAL", { py: 16, gap: 8 }); acc.appendChild(row); row.layoutSizingHorizontal = "FILL";
        const top = mk("Accordion Top", "HORIZONTAL", { main: "SPACE_BETWEEN", cross: "CENTER" }); row.appendChild(top); top.layoutSizingHorizontal = "FILL";
        top.appendChild(T(r[0], 18, "Semi Bold", th.text)); top.appendChild(T(r[2] ? "−" : "+", 24, "Bold", th.greenText));
        if (r[1]) para(row, T(r[1], 16, "Regular", th.muted, { lh: 150 }));
        if (i < arr.length - 1) divider(acc);
      });
      productGrid("You may also like", "Sample products, to be confirmed.", ["cap", "tote", "bottle", "light"].map(byId));
      bannerSection("Questions about a product?", "Message us on WhatsApp.");
    };
    const cartItem = (p, variant) => {
      const r = mk("Cart Item - " + p.name, "HORIZONTAL", { gap: 16, cross: "CENTER", py: 16 });
      const im = prodImg(p, 88, true); r.appendChild(im); im.layoutSizingHorizontal = "FIXED"; im.resize(88, 88); im.cornerRadius = 12;
      const mid = mk("Item Info", "VERTICAL", { gap: 4 }); r.appendChild(mid); mid.layoutSizingHorizontal = "FILL";
      para(mid, T(p.name, 18, "Semi Bold", th.text)); para(mid, T(variant, 14, "Regular", th.muted)); para(mid, T("Quantity 1", 14, "Regular", th.muted));
      r.appendChild(T(p.price, 20, "Bold", th.price));
      return r;
    };
    const kv = (parent, k, v, bold) => {
      const r = mk("Summary Row - " + k, "HORIZONTAL", { main: "SPACE_BETWEEN", cross: "CENTER", gap: 12 }); parent.appendChild(r); r.layoutSizingHorizontal = "FILL";
      r.appendChild(T(k, 16, bold ? "Semi Bold" : "Regular", bold ? th.text : th.muted)); r.appendChild(T(v, bold ? 20 : 16, bold ? "Bold" : "Semi Bold", bold ? th.price : th.text));
      return r;
    };
    const summaryPanel = (title, lastBtn) => {
      const sm = panel("Order Summary", 14);
      para(sm, T(title, 22, "Bold", th.text));
      kv(sm, "Subtotal", "$45"); kv(sm, "Delivery", "To be confirmed");
      divider(sm);
      kv(sm, "Total (no delivery)", "$45", true);
      lastBtn(sm);
      return sm;
    };
    const twoCols = (name) => { const b = mk(name, S.hero2 ? "HORIZONTAL" : "VERTICAL", { gap: S.gap + 8 }); return b; };
    const cartPage = () => {
      pageHeader("Cart", "A sample cart. Nothing is charged.", "Design only");
      const s = section("Cart Section", sectionFill());
      const body = twoCols("Cart Body"); s.appendChild(body); fillW(body);
      const items = panel("Cart Items", 0); body.appendChild(items); items.layoutSizingHorizontal = "FILL";
      items.appendChild(cartItem(byId("tshirt"), "Size M")); divider(items); items.appendChild(cartItem(byId("light"), "Black"));
      for (const c of items.children) if (c.name.indexOf("Cart Item") === 0) c.layoutSizingHorizontal = "FILL";
      const sm = summaryPanel("Order summary", par => {
        const cb = btn("Checkout", "green", "Checkout Button", true, "checkout"); par.appendChild(cb); cb.layoutSizingHorizontal = "FILL";
        const cl = shopLink(par, "Continue shopping", "shop", "Continue Shopping Link"); cl.primaryAxisAlignItems = "CENTER"; cl.layoutSizingHorizontal = "FILL";
        para(par, T("Design only: nothing is charged. Prices are samples.", 14, "Regular", th.muted, { align: "CENTER", lh: 150 }));
      });
      body.appendChild(sm);
      if (S.hero2) { sm.layoutSizingHorizontal = "FIXED"; sm.resize(400, sm.height); } else sm.layoutSizingHorizontal = "FILL";
      productGrid("You may also like", "Sample products, to be confirmed.", ["cap", "bottle", "helmet", "lock"].map(byId));
    };
    const field = label => {
      const w = mk("Field - " + label, "VERTICAL", { gap: 6 });
      w.appendChild(T(label, 14, "Medium", th.muted));
      const bx = mk("Field Box", "HORIZONTAL", { fill: th.bg, r: 12, stroke: th.border, sa: 0.5 });
      bx.primaryAxisSizingMode = "FIXED"; bx.counterAxisSizingMode = "FIXED"; bx.resize(100, 52);
      w.appendChild(bx); bx.layoutSizingHorizontal = "FILL";
      return w;
    };
    const choice = (title, sub, on) => {
      const c = mk("Choice - " + title, "HORIZONTAL", { fill: th.bg, r: 12, px: 16, py: 14, gap: 12, cross: "CENTER", stroke: on ? th.green : th.border, sa: on ? 1 : 0.4, sw: on ? 2 : 1 });
      const rd = figma.createEllipse(); rd.name = "Radio"; rd.resize(20, 20); rd.fills = on ? [solid(th.green)] : []; rd.strokes = [solid(th.green)]; rd.strokeWeight = 2; c.appendChild(rd);
      const tx = mk("Choice Text", "VERTICAL", { gap: 2 }); c.appendChild(tx); tx.layoutSizingHorizontal = "FILL";
      para(tx, T(title, 16, "Semi Bold", th.text)); if (sub) para(tx, T(sub, 14, "Regular", th.muted));
      return c;
    };
    const fieldRow = (parent, labels) => {
      const r = mk("Field Row", S.small ? "VERTICAL" : "HORIZONTAL", { gap: 12 }); parent.appendChild(r); r.layoutSizingHorizontal = "FILL";
      for (const l of labels) { const fl = field(l); r.appendChild(fl); fl.layoutSizingHorizontal = "FILL"; }
      return r;
    };
    const checkoutPage = () => {
      pageHeader("Checkout", "Design only: no real payment is taken. Do not enter real card details.", "Sample checkout");
      const s = section("Checkout Section", sectionFill());
      const body = twoCols("Checkout Body"); s.appendChild(body); fillW(body);
      const left = mk("Checkout Steps", "VERTICAL", { gap: S.gap }); body.appendChild(left); left.layoutSizingHorizontal = "FILL";
      const c1 = panel("Step 1 - Contact", 14); left.appendChild(c1); c1.layoutSizingHorizontal = "FILL";
      para(c1, T("1. Contact", 20, "Semi Bold", th.text));
      fieldRow(c1, ["Name", "WhatsApp number"]);
      const c2 = panel("Step 2 - Pickup or delivery", 14); left.appendChild(c2); c2.layoutSizingHorizontal = "FILL";
      para(c2, T("2. Pickup or delivery", 20, "Semi Bold", th.text));
      for (const x of [choice("Pick up at the shop", "Near the train station", true), choice("Delivery", "To be confirmed", false)]) { c2.appendChild(x); x.layoutSizingHorizontal = "FILL"; }
      const c3 = panel("Step 3 - Payment", 14); left.appendChild(c3); c3.layoutSizingHorizontal = "FILL";
      para(c3, T("3. Payment", 20, "Semi Bold", th.text));
      para(c3, T("Sample payment options, to be confirmed.", 14, "Regular", th.muted));
      for (const x of [choice("Card", null, true), choice("Pay at pickup", null, false)]) { c3.appendChild(x); x.layoutSizingHorizontal = "FILL"; }
      const cn = field("Card number"); c3.appendChild(cn); cn.layoutSizingHorizontal = "FILL";
      fieldRow(c3, ["Expiry", "CVC"]);
      const sm = summaryPanel("Your order", par => {
        const pb = btn("Pay $45 (sample)", "green", "Pay Button", true, "confirmation"); par.appendChild(pb); pb.layoutSizingHorizontal = "FILL";
        para(par, T("Design only: no real payment is taken.", 14, "Regular", th.muted, { align: "CENTER", lh: 150 }));
      });
      // items on top of the summary
      const it = mk("Summary Items", "VERTICAL", { gap: 0 }); sm.insertChild(1, it); it.layoutSizingHorizontal = "FILL";
      for (const [p, v] of [[byId("tshirt"), "Size M"], [byId("light"), "Black"]]) { const r = cartItem(p, v); it.appendChild(r); r.layoutSizingHorizontal = "FILL"; }
      body.appendChild(sm);
      if (S.hero2) { sm.layoutSizingHorizontal = "FIXED"; sm.resize(440, sm.height); } else sm.layoutSizingHorizontal = "FILL";
    };
    const confirmationPage = () => {
      const s = section("Confirmation Section", sectionFill());
      const card = panel("Confirmation Card", 16); s.appendChild(card);
      card.layoutSizingHorizontal = "FIXED"; card.resize(Math.min(inner, 640), card.height); card.counterAxisAlignItems = "CENTER";
      const ok = mk("Check Circle", "HORIZONTAL", { fill: th.green, r: 36, main: "CENTER", cross: "CENTER" });
      ok.primaryAxisSizingMode = "FIXED"; ok.counterAxisSizingMode = "FIXED"; ok.resize(72, 72);
      ok.appendChild(T("✓", 36, "Bold", "#ffffff")); card.appendChild(ok);
      para(card, T("Order received", S.h2, "Bold", th.text, { align: "CENTER", ls: -1.5, lh: 115 }));
      card.appendChild(pill("Sample page, design only"));
      para(card, T("Nothing was ordered or charged. This page only shows how the confirmation will look.", S.body, "Regular", th.muted, { align: "CENTER", lh: 150 }));
      const dv = mk("Order Details", "VERTICAL", { gap: 12 }); card.appendChild(dv); dv.layoutSizingHorizontal = "FILL";
      divider(dv); kv(dv, "Sample order number", "PW-0001"); kv(dv, "Items", "T-shirt, bike light"); kv(dv, "Total (no delivery)", "$45", true); divider(dv);
      const b1 = btn("Back to shop", "green", "Back to Shop Button", true, "shop"); card.appendChild(b1);
      const b2 = btn("Chat on WhatsApp", "orange", "Confirmation WhatsApp Button", true); card.appendChild(b2);
      if (S.small) { b1.layoutSizingHorizontal = "FILL"; b2.layoutSizingHorizontal = "FILL"; }
      shopLink(card, "Back to home", "home", "Back to Home Link");
      const st = section("What Happens Next Section", sectionFill());
      heading(st, "What happens next", "Three simple steps.", true);
      const items = [["1", "We confirm", "We message you on WhatsApp."], ["2", "We prepare", "We get your items ready."], ["3", "You collect", "Pick up near the train station."]].map(x => {
        const c = cardBase("Next " + x[0]);
        const n = mk("Step Number", "HORIZONTAL", { fill: th.green, r: 20, main: "CENTER", cross: "CENTER" });
        n.primaryAxisSizingMode = "FIXED"; n.counterAxisSizingMode = "FIXED"; n.resize(40, 40);
        n.appendChild(T(x[0], 18, "Bold", "#ffffff")); c.appendChild(n);
        para(c, T(x[1], 20, "Semi Bold", th.text)); para(c, T(x[2], 16, "Regular", th.muted, { lh: 150 }));
        return c;
      });
      grid(st, items, S.steps, S.gap);
    };

    buildNav();
    if (key === "home") { hero("Bike repair near the train station", "Book your repair on WhatsApp.", true, true, true); infoStrip(); categorySection(); servicesSection(true); stepsSection(); productGrid("Featured products", "Sample products, to be confirmed.", ["city", "ebike", "helmet", "tshirt"].map(byId)); gallerySection(); hoursSection(); faqSection(); newsletterSection(); bannerSection(); }
    else if (key === "services") { pageHeader("Services", SUB); servicesSection(false); stepsSection(); productGrid("Accessories for your bike", "Sample products, to be confirmed.", ["helmet", "helmet2", "lock", "light"].map(byId)); gallerySection(); bannerSection(); }
    else if (key === "prices") { pageHeader("Prices", SUB); priceList(); productGrid("Merchandise with our logo", "Sample products, to be confirmed.", ["tshirt", "cap", "tote", "bottle"].map(byId)); faqSection(); bannerSection(); }
    else if (key === "about") { hero("About Pedalwise", ABOUT_TEXT, false, true); gallerySection(); hoursSection(); categorySection("From our shop"); newsletterSection(); bannerSection(); }
    else if (key === "contact") { pageHeader("Contact", "Book your repair on WhatsApp."); contactSection(); faqSection(); newsletterSection(); }
    else if (key === "shop") shopPage();
    else if (key === "product") productPage();
    else if (key === "cart") cartPage();
    else if (key === "checkout") checkoutPage();
    else if (key === "confirmation") confirmationPage();
    footer();

    if (S.sticky) {
      const bar = mk("Sticky WhatsApp Bar", "HORIZONTAL", { fill: th.nav, px: 16, py: 12, main: "CENTER", cross: "CENTER", fx: [shadow(0.15, -4, 16)] });
      f.appendChild(bar); bar.layoutPositioning = "ABSOLUTE"; bar.resize(S.W, 76);
      bar.x = 0; bar.y = 844 - 76;
      const b = btn("Chat on WhatsApp", "orange", "Sticky WhatsApp Button", true); bar.appendChild(b); b.layoutSizingHorizontal = "FILL";
      bar.constraints = { horizontal: "STRETCH", vertical: "MAX" };
      try { f.overflowDirection = "VERTICAL"; f.numberOfFixedChildren = 1; } catch (e) { log.push("fixed bar failed " + e.message); }
    }
    return f;
  };

  // ---------- build, place, wire
  const results = [];
  const flows = [];
  for (const S of SIZES) {
    const pg = figma.root.children.find(p => p.name === S.page);
    if (!pg) { log.push("MISSING page " + S.page); continue; }
    await figma.setCurrentPageAsync(pg);
    // a shared page (Duo + Tablet): the new frames go below what is already there
    let baseY = 0;
    for (const c of pg.children) baseY = Math.max(baseY, c.y + c.height + 500);
    if (pg.children.some(c => c.name.indexOf(" - " + S.W) !== -1)) { log.push(S.page + " already has " + S.W + " frames, skipped"); continue; }
    const frames = {}, ctxs = {};
    try {
      for (const mode of ["light", "dark"]) for (const [k, lab] of PAGELIST) {
        const ctx = { links: [] };
        frames[k + "|" + mode] = buildPage(S, mode, k, lab, ctx);
        ctxs[k + "|" + mode] = ctx;
      }
    } catch (e) { log.push(S.key + " BUILD FAILED: " + e.message + " | " + String(e.stack || "").split("\n").slice(0, 3).join(" / ")); continue; }
    // 4 rows: light A (Home..Contact), light B (Product..Confirmation), dark A, dark B
    let yy = baseY;
    for (const mode of ["light", "dark"]) for (const rowPages of [NAV, EXTRA]) {
      let mh = 0;
      rowPages.forEach(([k], i) => { const f = frames[k + "|" + mode]; f.x = i * (S.W + 160); f.y = yy; mh = Math.max(mh, f.height); });
      yy += mh + 300;
    }
    // wiring
    let nLinks = 0, nFail = 0;
    for (const id of Object.keys(frames)) {
      const [key, mode] = id.split("|");
      for (const l of ctxs[id].links) {
        let action;
        if (l.kind === "page" && l.target === key) continue; // a link to the page itself needs no reaction
        if (l.kind === "page") action = { type: "NODE", destinationId: frames[l.target + "|" + mode].id, navigation: "NAVIGATE", transition: null, resetVideoPosition: false };
        else if (l.kind === "theme") action = { type: "NODE", destinationId: frames[key + "|" + (mode === "light" ? "dark" : "light")].id, navigation: "NAVIGATE", transition: null, resetVideoPosition: false };
        else action = { type: "URL", url: l.target };
        try { await l.node.setReactionsAsync([{ trigger: { type: "ON_CLICK" }, actions: [action] }]); nLinks++; } catch (e) { nFail++; if (nFail < 3) log.push("link failed: " + e.message); }
      }
    }
    try { pg.flowStartingPoints = pg.flowStartingPoints.concat([{ nodeId: frames["home|light"].id, name: S.W + " light site" }, { nodeId: frames["home|dark"].id, name: S.W + " dark site" }]); } catch (e) { log.push(S.page + " flow start failed: " + e.message); }
    // checks
    let over = 0, small = 0, tiny = 0, tot = 0, fails = 0; const seen = {};
    const bgOf = n => { let p = n.parent; while (p && p.type !== "PAGE") { if (p.type !== "TEXT" && "fills" in p && p.fills !== figma.mixed) { const s = p.fills.filter(q => q.type === "SOLID" && q.visible !== false && (q.opacity === undefined || q.opacity === 1)); if (s.length) return s[s.length - 1].color; } p = p.parent; } return rgb("#ffffff"); };
    for (const id of Object.keys(frames)) {
      const f = frames[id];
      const box = f.absoluteBoundingBox;
      for (const n of f.findAll(() => true)) {
        const b = n.absoluteBoundingBox; if (!b || n.visible === false) continue;
        if (b.x + b.width > box.x + box.width + 1 || b.x < box.x - 1) over++;
        if (n.type === "TEXT") {
          tot++;
          if (n.fontSize < 14) tiny++;
          const p = n.fills !== figma.mixed ? n.fills.find(q => q.type === "SOLID") : null;
          if (p) { const r = ratio(p.color, bgOf(n)); const large = n.fontSize >= 24 || (n.fontSize >= 18.66 && /bold|semi/i.test(n.fontName.style)); if (r < (large ? 3 : 4.5)) { fails++; const k = id.split("|")[1] + " " + n.characters.slice(0, 14) + " " + r.toFixed(2); seen[k] = 1; } }
        }
        if (n.name.indexOf("Button") !== -1 && n.type === "FRAME" && n.height < 47.5) small++;
      }
    }
    results.push(S.page + ": " + PAGELIST.length * 2 + " frames, " + nLinks + " links set" + (nFail ? " (" + nFail + " failed)" : "") + ", heights " + PAGELIST.map(([k]) => Math.round(frames[k + "|light"].height)).join("/") + ", overflow " + over + ", buttons<48 " + small + ", text<14 " + tiny + ", texts " + tot + ", below AA " + fails + (fails ? " [" + Object.keys(seen).slice(0, 6).join("; ") + "]" : ""));
    figma.viewport.scrollAndZoomIntoView(Object.values(frames));
  }
  print(results.concat(log).join("\n"));
})();
