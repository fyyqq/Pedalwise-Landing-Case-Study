// Scripter script 34, renamed 41 in Round 5b (photos, config): builds the whole site on the four size pages from ONE generator, so nothing is duplicated by hand.
// Pages (Starter plan = 3 pages): "Desktop 1440", "Mobile 390", "iPhone Duo 669 + Tablet 768" (Duo on top, Tablet below it). Created by script 33.
// Each page gets Home, Services, Prices, About, Contact in light (top row) and dark (bottom row) = 10 frames, fully wired:
// menu links, logo, footer links -> the page frames; orange/green buttons -> WhatsApp URL; theme switch -> the same page in the other mode.
// Text only uses facts the client gave (service names, prices, hours, location, phone, About text). Process steps are marked "Draft wording".
// Prints a link table, an overflow check and a WCAG contrast report. Runs with figma and print as arguments (leading await).
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
    { key: "desktop", page: "Desktop 1440", W: 1440, px: 120, cols: 3, hero2: true, h1: 64, h2: 40, body: 18, navTwo: false, steps: 3, gal: 3, sec: 96, pad: 28, gap: 24, linkGap: 28 },
    { key: "tablet", page: "iPhone Duo 669 + Tablet 768", W: 768, px: 40, cols: 2, hero2: false, h1: 48, h2: 34, body: 17, navTwo: true, steps: 3, gal: 3, sec: 72, pad: 24, gap: 20, linkGap: 24 },
    { key: "mobile", page: "Mobile 390", W: 390, px: 20, cols: 1, hero2: false, h1: 36, h2: 28, body: 16, navTwo: true, steps: 1, gal: 2, sec: 56, pad: 20, gap: 16, linkGap: 8, small: true, sticky: true },
    { key: "duo", page: "iPhone Duo 669 + Tablet 768", W: 669, px: 32, cols: 2, hero2: false, h1: 44, h2: 32, body: 17, navTwo: true, steps: 3, gal: 3, sec: 64, pad: 24, gap: 20, linkGap: 20 }
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
    { id: "1760310936486-4dd450aab2a8", by: "camera obscura" }
  ];
  const PHOTO_START = { home: 0, about: 4, services: 2 };
  const NAV = [["home", "Home"], ["about", "About"], ["services", "Services"], ["prices", "Prices"], ["contact", "Contact"]];
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

    const btn = (text, kind, name, big) => {
      const o = kind === "orange";
      const b = mk(name, "HORIZONTAL", { fill: o ? th.orange : th.green, py: big ? 17 : 15, px: big ? 32 : (S.small ? 16 : 24), main: "CENTER", cross: "CENTER", r: 12, fx: [o ? glow : shadow(0.12, 4, 10)] });
      b.appendChild(T(text, big ? 18 : (S.small ? 15 : 16), "Semi Bold", o ? th.onOrange : "#ffffff"));
      link(b, "url", WA_URL);
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
      for (const [k, lab] of NAV) {
        const item = mk("Nav Link - " + lab, "HORIZONTAL", { py: 10, px: 2, cross: "CENTER" });
        item.appendChild(T(lab, 16, k === key ? "Bold" : "Medium", k === key ? th.greenText : th.text, { under: k === key }));
        row.appendChild(item); link(item, "page", k);
      }
      return row;
    };
    const buildNav = () => {
      const n = mk("Nav", S.navTwo ? "VERTICAL" : "HORIZONTAL", { fill: th.nav, px: S.px, py: S.navTwo ? 12 : 16, gap: S.navTwo ? 4 : 0, main: "SPACE_BETWEEN", cross: S.navTwo ? "CENTER" : "CENTER", fx: [shadow(th.sh * 0.75, 2, 12)] });
      f.appendChild(n); fillW(n);
      const actions = mk("Nav Actions", "HORIZONTAL", { gap: S.small ? 10 : 16, cross: "CENTER" });
      actions.appendChild(sw()); actions.appendChild(btn("Chat on WhatsApp", "green", "Nav WhatsApp Button"));
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
      if (label === "Photo placeholder") {
        const i = (phIdx++) % PHOTOS.length;
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
    const hero = (title, sub, withBadge, withButton) => {
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
      if (withButton) { const b = btn("Chat on WhatsApp", "orange", "Hero WhatsApp Button", true); text.appendChild(b); }
      const ph = placeholder("Photo placeholder", S.hero2 ? 520 : 300, S.hero2 ? 400 : (S.small ? 240 : 320));
      body.appendChild(ph);
      if (S.hero2) { ph.layoutSizingHorizontal = "FIXED"; } else { ph.layoutSizingHorizontal = "FILL"; }
      return s;
    };
    const pageHeader = (title, sub) => {
      const s = mk("Page Header", "VERTICAL", { fill: th.tint, px: S.px, py: Math.round(S.sec * 0.8), gap: 16, cross: "CENTER" });
      f.appendChild(s); fillW(s);
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
    const bannerSection = () => {
      const s = mk("WhatsApp Banner", "VERTICAL", { fill: th.banner, px: S.px, py: Math.round(S.sec * 0.8), gap: 20, cross: "CENTER" });
      f.appendChild(s); fillW(s);
      para(s, T("Ready to book your repair?", S.h2, "Bold", "#ffffff", { align: "CENTER", ls: -1.5, lh: 115 }));
      para(s, T("Message us on WhatsApp.", S.body, "Regular", "#ffffff", { align: "CENTER" }), Math.min(inner, 640));
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
      return s;
    };
    const footer = () => {
      const s = mk("Footer", S.hero2 ? "HORIZONTAL" : "VERTICAL", { fill: th.footer, px: S.px, py: 40, gap: 20, main: "SPACE_BETWEEN", cross: S.hero2 ? "CENTER" : "MIN" });
      f.appendChild(s); fillW(s);
      const lg = mk("Footer Logo", "HORIZONTAL", { gap: 10, cross: "CENTER" });
      const d = figma.createEllipse(); d.name = "Logo Mark"; d.resize(24, 24); d.fills = [solid(th.green)]; lg.appendChild(d);
      lg.appendChild(T("Pedalwise", 20, "Bold", th.footerText)); s.appendChild(lg); link(lg, "page", "home");
      const row = mk("Footer Links", "HORIZONTAL", { gap: 20, cross: "CENTER" }); s.appendChild(row);
      for (const [k, lab] of NAV.filter(n => n[0] !== "home")) {
        const item = mk("Footer Link - " + lab, "HORIZONTAL", { py: 10, px: 2 }); item.appendChild(T(lab, 16, "Medium", th.footerText)); row.appendChild(item); link(item, "page", k);
      }
      s.appendChild(T("© 2026 Pedalwise", 14, "Regular", th.footerText));
      return s;
    };

    buildNav();
    if (key === "home") { hero("Bike repair near the train station", "Book your repair on WhatsApp.", true, true); servicesSection(true); stepsSection(); gallerySection(); hoursSection(); faqSection(); bannerSection(); }
    else if (key === "services") { pageHeader("Services", SUB); servicesSection(false); stepsSection(); gallerySection(); bannerSection(); }
    else if (key === "prices") { pageHeader("Prices", SUB); priceList(); faqSection(); bannerSection(); }
    else if (key === "about") { hero("About Pedalwise", ABOUT_TEXT, false, true); gallerySection(); hoursSection(); bannerSection(); }
    else if (key === "contact") { pageHeader("Contact", "Book your repair on WhatsApp."); contactSection(); faqSection(); }
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
      for (const mode of ["light", "dark"]) for (const [k, lab] of NAV) {
        const ctx = { links: [] };
        frames[k + "|" + mode] = buildPage(S, mode, k, lab, ctx);
        ctxs[k + "|" + mode] = ctx;
      }
    } catch (e) { log.push(S.key + " BUILD FAILED: " + e.message + " | " + String(e.stack || "").split("\n").slice(0, 3).join(" / ")); continue; }
    let maxH = 0;
    NAV.forEach(([k], i) => { const f = frames[k + "|light"]; f.x = i * (S.W + 160); f.y = baseY; maxH = Math.max(maxH, f.height); });
    NAV.forEach(([k], i) => { const f = frames[k + "|dark"]; f.x = i * (S.W + 160); f.y = baseY + maxH + 300; });
    // wiring
    let nLinks = 0, nFail = 0;
    for (const id of Object.keys(frames)) {
      const [key, mode] = id.split("|");
      for (const l of ctxs[id].links) {
        let action;
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
        if (n.name.indexOf("WhatsApp Button") !== -1 && n.type === "FRAME" && n.height < 47.5) small++;
      }
    }
    results.push(S.page + ": 10 frames, " + nLinks + " links set" + (nFail ? " (" + nFail + " failed)" : "") + ", heights " + NAV.map(([k]) => Math.round(frames[k + "|light"].height)).join("/") + ", overflow " + over + ", buttons<48 " + small + ", text<14 " + tiny + ", texts " + tot + ", below AA " + fails + (fails ? " [" + Object.keys(seen).slice(0, 6).join("; ") + "]" : ""));
    figma.viewport.scrollAndZoomIntoView(Object.values(frames));
  }
  print(results.concat(log).join("\n"));
})();
