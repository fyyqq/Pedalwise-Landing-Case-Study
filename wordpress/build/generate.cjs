// Generates the WordPress block markup for the Pedalwise site from the Figma generator's content (scripts/76-build-site-blog.js).
// It builds block trees with createBlock() and writes them with the REAL core serializers (@wordpress/blocks + @wordpress/block-library),
// then parses every output again and fails if a block is not valid. So the markup is what WordPress itself would save, not hand-typed.
// Run: cd wordpress/build && npm install && node generate.cjs
// Output: ../pages/*.html, ../posts/*.html, ../theme/pedalwise/{templates,parts}/*.html
"use strict";
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
for (const k of ["navigator", "Node", "Element", "HTMLElement", "DOMParser", "MutationObserver", "getComputedStyle", "CustomEvent", "Event", "requestAnimationFrame", "cancelAnimationFrame", "HTMLInputElement", "SVGElement", "Text"]) {
  try { Object.defineProperty(global, k, { value: dom.window[k], configurable: true, writable: true }); } catch (e) { /* ignore */ }
}
const origWarn = console.warn; console.warn = () => {}; // block-library prints harmless "memo" warnings under jsdom
const origError = console.error; console.error = () => {};
const { registerCoreBlocks } = require("@wordpress/block-library");
const { createBlock, serialize, parse } = require("@wordpress/blocks");
registerCoreBlocks();
console.warn = origWarn; console.error = origError;

const OUT = path.join(__dirname, "..");
const THEME = path.join(OUT, "theme", "pedalwise");

// ---------------------------------------------------------------- content (from the Figma generator, client facts only)
const WA = "https://wa.me/15550100"; // placeholder number from the brief (+1 555 0100)
const PHONE = "+1 555 0100";
const SUB = "No surprise fees. We ask before any extra work.";
const ABOUT_TEXT = "We repair bikes and e-bikes near the train station. Open Tue to Sun, 9am to 6pm. Book your repair on WhatsApp.";
const DRAFT = "Draft wording, to be confirmed";
const SAMPLE = "Sample products, to be confirmed.";
const MAP_CAPTION = "Sample map illustration. The real map of the shop replaces it once the address is confirmed.";

const PHOTOS = [
  ["1675798227643-da319f8ee8f7", "A person working on a bike"],
  ["1675798225739-d8919b7a23f7", "A man working on a bicycle in a garage"],
  ["1676531356064-0a527118baf4", "A man working on a bike in a garage"],
  ["1671790639553-43973054c51e", "A person holding a bike"],
  ["1671543565338-8b22a87b8359", "Tools hanging on a wall"],
  ["1684166472907-e17eec7e9475", "Close-up of a bike's gears and chain"],
  ["1767193315630-6a6683df1186", "A man working on a red bicycle outside a shop"],
  ["1760310936486-4dd450aab2a8", "A workshop wall with tools and a workbench"],
  ["1591047139334-337807f2b3e5", "A blue city bike parked beside a black wooden door"],
  ["1673121414328-52eff37bc6d0", "A red mountain bike on a grassy hill"],
  ["1786441113553-43414b842378", "An electric bicycle on a suburban street"],
  ["1612638152051-ff2d83be4c5b", "A black and gray road bike"],
  ["1701522814809-c339c2b60a7b", "A bike helmet on a gray background"],
  ["1590092940833-0af304b36ee7", "A white and black bicycle helmet"],
  ["1775209601094-d2e9045652db", "Bicycle locks and chains hanging on a wall"],
  ["1579118690145-7753994c2d56", "A black bike light"],
  ["1581655353564-df123a1eb820", "A white crew neck T-shirt"],
  ["1521369909029-2afed882baee", "A gray baseball cap"],
  ["1544816155-12df9643f363", "A beige tote bag"],
  ["1544003484-3cd181d17917", "A black stainless steel water bottle"]
];
const photoUrl = (i, w) => "https://images.unsplash.com/photo-" + PHOTOS[i][0] + "?auto=format&fit=crop&w=" + (w || 1200) + "&q=70&fm=jpg";

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
const SERVICES = [
  { name: "Basic tune-up", price: "$25", desc: "A general check and adjustment." },
  { name: "Full service", price: "$55", desc: "A complete check and service." },
  { name: "Flat tire fix", price: "$10", desc: "Puncture repair." },
  { name: "Brake or gear adjustment", price: "$15", desc: "Brake and gear adjustment." },
  { name: "E-bike repair", price: "", desc: "", link: "Ask us on WhatsApp" }
];
const NAV = [["Home", "/"], ["About", "/about/"], ["Services", "/services/"], ["Prices", "/prices/"], ["Shop", "/shop/"], ["Blog", "/blog/"], ["Contact", "/contact/"]];
const POSTS = [
  { slug: "welcome-to-pedalwise", cat: "News", title: "Welcome to Pedalwise", ex: "Bike and e-bike repair near the train station. See what we do and how to book.", photo: 6 },
  { slug: "five-quick-checks-before-you-ride", cat: "Repair tips", title: "Five quick checks before you ride", ex: "Tyres, brakes, chain, lights and bolts: a short routine you can do in two minutes.", photo: 0 },
  { slug: "why-a-bike-needs-a-regular-tune-up", cat: "Repair tips", title: "Why a bike needs a regular tune-up", ex: "Small adjustments keep a bike safe and smooth. Here is what a tune-up looks at.", photo: 1 },
  { slug: "what-to-do-when-you-get-a-flat-tyre", cat: "Repair tips", title: "What to do when you get a flat tyre", ex: "Stay calm, check the tyre and decide: fix it yourself or bring it to us.", photo: 2 },
  { slug: "e-bike-repair-ask-us-on-whatsapp", cat: "News", title: "E-bike repair: ask us on WhatsApp", ex: "We repair e-bikes too. Message us on WhatsApp and tell us what is wrong.", photo: 3 },
  { slug: "we-are-open-tuesday-to-sunday", cat: "News", title: "We are open Tuesday to Sunday", ex: "Find us near the train station, 9am to 6pm. Book your repair on WhatsApp.", photo: 5 },
  { slug: "the-pedalwise-shop-sample", cat: "News", title: "The Pedalwise shop (sample)", ex: "Bicycles, accessories and merchandise with our logo. Sample items, to be confirmed.", photo: 16 }
];

// ---------------------------------------------------------------- block helpers
const B = (name, attrs, inner) => createBlock(name, attrs || {}, inner || []);
const cx = (...a) => a.filter(Boolean).join(" ");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const para = (html, o) => { o = o || {}; return B("core/paragraph", { content: html, className: cx(o.cls, o.align === "center" && "pw-center"), textColor: o.color }); }; // centering is a theme class: the paragraph "align" attribute is not saved the same way in every WordPress version
const heading = (text, level, o) => { o = o || {}; return B("core/heading", { content: esc(text), level: level, className: cx(o.cls, o.align === "center" && "pw-center"), textColor: o.color }); };
const group = (kids, className, o) => { o = o || {}; return B("core/group", { className: className, backgroundColor: o.bg, textColor: o.color, tagName: o.tag, anchor: o.anchor, align: o.align, layout: o.layout }, kids); };
const link = (text, url, o) => { o = o || {}; return '<a href="' + url + '"' + (o.ext ? ' target="_blank" rel="noreferrer noopener"' : "") + ">" + esc(text) + "</a>"; };

// kind: orange | green | outline
const button = (text, kind, url, o) => {
  o = o || {};
  const ext = /^https?:/.test(url);
  const a = { text: esc(text), url: url, className: cx("pw-btn", "pw-btn--" + kind, o.big && "pw-btn--lg", o.full && "pw-btn--full", kind === "outline" && "is-style-outline") };
  if (kind === "orange") { a.backgroundColor = "orange"; a.textColor = "on-orange"; }
  else if (kind === "green") { a.backgroundColor = "green"; a.textColor = "white"; }
  else a.textColor = "ink";
  if (ext) { a.linkTarget = "_blank"; a.rel = "noreferrer noopener"; }
  return B("core/button", a);
};
const buttons = (items, o) => { o = o || {}; return B("core/buttons", { className: cx("pw-buttons", o.cls), layout: { type: "flex", justifyContent: o.justify || "left" } }, items); };
const waButton = (o) => button("Chat on WhatsApp", "orange", WA, o);

const photo = (i, o) => { o = o || {}; return B("core/image", { url: photoUrl(i, o.w), alt: PHOTOS[i][1], className: cx("pw-photo", o.cls), sizeSlug: "large", linkDestination: "none" }); };
const bar = () => B("core/separator", { className: "pw-bar" });
const pill = text => para(esc(text), { cls: "pw-pill pw-draft" });

// a full-width coloured section with the 1200 px content column inside
const section = (className, bg, kids, o) => {
  o = o || {};
  return group([group(kids, cx("pw-inner", o.inner))], cx("pw-section", className), { bg: bg, align: "full", tag: o.tag || "section", anchor: o.anchor, color: o.color });
};
const head = (title, sub, o) => {
  o = o || {};
  const k = [];
  if (o.pill) k.push(pill(DRAFT));
  k.push(heading(title, o.h1 ? 1 : 2, { cls: o.h1 ? "pw-h1" : "pw-h2", align: "center" }));
  k.push(bar());
  if (sub) k.push(para(esc(sub), { cls: "pw-sub", align: "center" }));
  return group(k, "pw-head");
};
const grid = (kind, items) => group(items, "pw-grid pw-grid--" + kind);
const card = (kids, cls) => group(kids, cx("pw-card", cls), { bg: "card" });
const logoMark = (small) => group([para("P")], cx("pw-logo-mark", small && "pw-logo-mark--sm"), { bg: "green", color: "white" });

// ---------------------------------------------------------------- Figma sections, rebuilt with blocks
let phCursor = 0;
const nextPhoto = () => (phCursor++) % 8; // the 8 workshop photos cycle, as in the Figma generator
const startPhotos = n => { phCursor = n; };

const pageHeader = (title, sub, pillOn) => group([].concat(pillOn ? [pill(pillOn)] : [], [heading(title, 1, { cls: "pw-h1", align: "center" }), bar()], sub ? [para(esc(sub), { cls: "pw-sub", align: "center" })] : []), "pw-section pw-section--header pw-page-header", { bg: "tint", align: "full", tag: "section" });

const hero = (title, sub, o) => {
  o = o || {};
  const text = [];
  if (o.badge) text.push(para(esc("Near the train station · Open Tue to Sun, 9am to 6pm"), { cls: "pw-badge" }));
  text.push(heading(title, 1, { cls: "pw-h1" }));
  text.push(para(esc(sub), { cls: "pw-lead" }));
  text.push(buttons([waButton({ big: true })].concat(o.shop ? [button("Shop now", "outline", "/shop/", { big: true })] : [])));
  const body = group([group(text, "pw-hero__text"), photo(nextPhoto(), { cls: "pw-hero__photo", w: 1200 })], "pw-hero__body");
  return group([group([body], "pw-inner")], "pw-section pw-section--hero", { bg: "tint", align: "full", tag: "section" });
};

const infoStrip = () => section("pw-section--strip", "bg", [group(["Open Tue to Sun, 9am to 6pm", "Near the train station", "WhatsApp " + PHONE].map(t => para(esc(t), { cls: "pw-strip__item" })), "pw-card pw-strip", { bg: "card" })]);

const catCard = cat => {
  const p0 = PRODUCTS.find(x => x.cat === cat), n = PRODUCTS.filter(x => x.cat === cat).length;
  return group([
    photo(p0.photo, { cls: "pw-card__photo", w: 800 }),
    group([heading(cat, 3, { cls: "pw-h3" }), para(n + " sample items", { cls: "pw-muted pw-small" }), para(link("Shop " + cat.toLowerCase(), "/shop/#" + cat.toLowerCase()), { cls: "pw-link" })], "pw-card__body")
  ], "pw-card pw-card--media", { bg: "card" });
};
const categorySection = (title, sub) => section("", "alt", [head(title || "Shop by category", sub || "Bicycles, accessories and merchandise. Sample items, to be confirmed."), grid("cats", CATS.map(catCard))]);

const serviceCard = svc => card([].concat(
  [heading(svc.name, 3, { cls: "pw-h3" })],
  svc.price ? [para(esc(svc.price), { cls: "pw-price" })] : [],
  svc.desc ? [para(esc(svc.desc), { cls: "pw-muted" })] : [],
  svc.link ? [para(link(svc.link, WA, { ext: true }), { cls: "pw-link" })] : []
));
const servicesSection = (withTitle, bg) => section("", bg || "bg", [].concat(withTitle ? [head("Services", SUB)] : [], [grid("services", SERVICES.map(serviceCard))]));

const stepCard = (n, title, text) => card([group([para(String(n))], "pw-step-num", { bg: "green", color: "white" }), heading(title, 3, { cls: "pw-h3" }), para(esc(text), { cls: "pw-muted" })]);
const stepsSection = (bg) => section("", bg || "alt", [head("How it works", "Three simple steps.", { pill: true }), grid("steps", [stepCard(1, "Message us", "Tell us about your bike on WhatsApp."), stepCard(2, "Bring it in", "Drop your bike off near the train station."), stepCard(3, "Pick it up", "Collect it when the repair is done.")])]);

const productCard = p => {
  const media = [photo(p.photo, { cls: "pw-card__photo", w: 800 })];
  if (p.logo) media.push(group([logoMark(true), para("Pedalwise")], "pw-chip"));
  return group([
    group(media, "pw-card__media"),
    group([
      para(esc(p.cat.toUpperCase()), { cls: "pw-eyebrow" }),
      heading(p.name, 3, { cls: "pw-h3" }),
      para(esc(p.price), { cls: "pw-price pw-price--sm" }),
      buttons([button("View product", "green", "/shop/", { full: true })])
    ], "pw-card__body")
  ], "pw-card pw-card--media pw-product", { bg: "card" });
};
const productSection = (title, sub, ids, bg, anchor) => section("", bg, [head(title, sub), grid("shop", ids.map(byId).map(productCard))], { anchor: anchor });

const gallerySection = (bg) => { const p = [nextPhoto(), nextPhoto(), nextPhoto()]; return section("", bg || "bg", [head("Bike repair in pictures", "Stock photos for now. Photos of the shop will replace them."), grid("gallery", p.map(i => photo(i, { cls: "pw-gallery__photo", w: 800 })))]); };

const infoCard = (t, v) => card([para(esc(t), { cls: "pw-eyebrow" }), para(esc(v), { cls: "pw-info__value" })]);
const mapBlock = () => group([para("Map", { cls: "pw-map__label" })], "pw-map");
const hoursSection = (bg) => section("", bg || "bg", [head("Visit us", "Open Tue to Sun, near the train station."), grid("info", [infoCard("OPENING HOURS", "Tue to Sun, 9am to 6pm"), infoCard("LOCATION", "Near the train station"), infoCard("WHATSAPP", PHONE)]), mapBlock(), para(esc(MAP_CAPTION), { cls: "pw-small pw-muted pw-caption", align: "center" })]);

const faqSection = (bg) => section("", bg || "alt", [head("Questions", "Short answers to the most common ones."), grid("faq", [["How do I book a repair?", "Message us on WhatsApp."], ["Do you repair e-bikes?", "Yes. Ask us on WhatsApp."], ["Are there extra fees?", SUB], ["When are you open?", "Tue to Sun, 9am to 6pm."]].map(x => card([heading(x[0], 3, { cls: "pw-h3 pw-h3--sm" }), para(esc(x[1]), { cls: "pw-muted" })])))]);

const banner = (title, sub) => group([heading(title || "Ready to book your repair?", 2, { cls: "pw-h2", color: "white", align: "center" }), para(esc(sub || "Message us on WhatsApp."), { cls: "pw-sub", color: "white", align: "center" }), buttons([waButton({ big: true })], { justify: "center" })], "pw-section pw-section--banner", { bg: "banner", align: "full", tag: "section" });

// ----- query loop (posts) used by Home, the blog template and archives
let queryId = 1;
const postCardBlocks = () => group([
  B("core/post-featured-image", { isLink: true, className: "pw-post__img" }),
  group([
    B("core/post-terms", { term: "category", className: "pw-eyebrow" }),
    B("core/post-title", { level: 3, isLink: true, className: "pw-h3" }),
    B("core/post-excerpt", { excerptLength: 22, className: "pw-muted" }),
    B("core/post-date", { className: "pw-small pw-muted" })
  ], "pw-card__body")
], "pw-card pw-card--media pw-post", { bg: "card" });
const postsQuery = (perPage, inherit, pagination) => B("core/query", { queryId: queryId++, query: { perPage: perPage, pages: 0, offset: 0, postType: "post", order: "desc", orderBy: "date", author: "", search: "", exclude: [], sticky: "", inherit: !!inherit }, className: "pw-posts" }, [].concat(
  [B("core/post-template", { layout: { type: "grid", columnCount: 3 } }, [postCardBlocks()])],
  pagination ? [B("core/query-pagination", { layout: { type: "flex", justifyContent: "center" } }, [B("core/query-pagination-previous"), B("core/query-pagination-numbers"), B("core/query-pagination-next")])] : []
));
const blogTeaser = (bg) => section("", bg || "alt", [head("From the blog", "News and repair tips."), postsQuery(3, false, false), para(link("Read the blog", "/blog/"), { cls: "pw-link", align: "center" })]);

// ---------------------------------------------------------------- pages
const pages = {};
startPhotos(0);
pages["01-home"] = [
  hero("Bike repair near the train station", "Book your repair on WhatsApp.", { badge: true, shop: true }),
  infoStrip(), categorySection(), servicesSection(true, "bg"), stepsSection("alt"),
  productSection("Featured products", SAMPLE, ["city", "ebike", "helmet", "tshirt"], "bg"),
  gallerySection("alt"), hoursSection("bg"), faqSection("alt"), blogTeaser("bg"), banner()
];
startPhotos(4);
pages["02-about"] = [hero("About Pedalwise", ABOUT_TEXT), gallerySection("bg"), hoursSection("alt"), categorySection("From our shop"), banner()];
startPhotos(2);
pages["03-services"] = [pageHeader("Services", SUB), servicesSection(false, "bg"), stepsSection("alt"), productSection("Accessories for your bike", SAMPLE, ["helmet", "helmet2", "lock", "light"], "bg"), gallerySection("alt"), banner()];
const priceRow = (svc) => group([para(esc(svc.name), { cls: "pw-price-row__name" }), svc.price ? para(esc(svc.price), { cls: "pw-price" }) : para(link(svc.link, WA, { ext: true }), { cls: "pw-link" })], "pw-price-row");
pages["04-prices"] = [
  pageHeader("Prices", SUB),
  section("", "bg", [group(SERVICES.map(priceRow), "pw-card pw-price-list", { bg: "card" }), para(esc(SUB), { cls: "pw-sub", align: "center" })]),
  productSection("Merchandise with our logo", SAMPLE, ["tshirt", "cap", "tote", "bottle"], "alt"),
  faqSection("bg"), banner()
];
const chips = (items, active) => buttons(items.map(([t, u]) => button(t, t === active ? "green" : "outline", u)), { justify: "center", cls: "pw-chips" });
const shopSection = cat => productSection(cat, "Sample items, to be confirmed.", PRODUCTS.filter(x => x.cat === cat).map(x => x.id), CATS.indexOf(cat) % 2 ? "alt" : "bg", cat.toLowerCase());
pages["05-shop"] = [
  pageHeader("Shop", "Bicycles, accessories and merchandise with the Pedalwise logo.", DRAFT),
  section("pw-section--strip", "alt", [chips([["All", "/shop/"], ["Bicycles", "#bicycles"], ["Accessories", "#accessories"], ["Merchandise", "#merchandise"]], "All")]),
  shopSection("Bicycles"), shopSection("Accessories"), shopSection("Merchandise"),
  banner("Need help choosing?", "Message us on WhatsApp.")
];
pages["06-contact"] = [
  pageHeader("Contact", "Book your repair on WhatsApp."),
  section("", "bg", [head("Contact", "The fastest way to reach us is WhatsApp."),
    group([buttons([waButton({ big: true })], { justify: "center" }), para(esc(PHONE), { cls: "pw-info__value", align: "center" }), para("Open Tue to Sun, 9am to 6pm", { cls: "pw-muted", align: "center" }), para("Near the train station", { cls: "pw-muted", align: "center" })], "pw-card pw-contact-card", { bg: "card" }),
    mapBlock(), para(esc(MAP_CAPTION), { cls: "pw-small pw-muted pw-caption", align: "center" })]),
  faqSection("alt")
];

// ---------------------------------------------------------------- posts (content only; title, excerpt, category are set by setup.sh)
const posts = {};
const articleTable = B("core/table", { className: "pw-price-table", hasFixedLayout: true, body: SERVICES.map(s => ({ cells: [{ content: esc(s.name), tag: "td" }, { content: s.price ? esc(s.price) : link(s.link, WA, { ext: true }), tag: "td" }] })) });
posts["welcome-to-pedalwise"] = [
  para("Pedalwise repairs bikes and e-bikes near the train station. We are open Tuesday to Sunday, 9am to 6pm."),
  heading("What we do", 2), para("Here are our repair services and what they cost."), articleTable,
  heading("How to book", 2), para("Message us on WhatsApp and tell us about your bike. Then bring it in near the train station and pick it up when the repair is done."),
  B("core/quote", { className: "pw-quote" }, [para(esc(SUB))])
];
for (const p of POSTS.slice(1)) posts[p.slug] = [para(esc(p.ex)), para("Sample post: the full text is to be written and confirmed.", { cls: "pw-small pw-muted" })];

// ---------------------------------------------------------------- theme: header, footer, templates
const navBlock = (name, cls) => B("core/navigation", { ariaLabel: name, overlayMenu: "never", className: cls, layout: { type: "flex", setCascadingProperties: true, justifyContent: "center" } }, NAV.filter(n => name !== "Footer menu" || n[0] !== "Home").map(n => B("core/navigation-link", { label: n[0], url: n[1], kind: "custom" })));
const header = B("core/group", { tagName: "header", className: "pw-header", backgroundColor: "card", align: "full" }, [
  group([group([logoMark(false), B("core/site-title", { level: 0, isLink: true, className: "pw-logo__text" })], "pw-logo"), navBlock("Main menu", "pw-nav"), group([buttons([button("Chat on WhatsApp", "green", WA)], { cls: "pw-header__cta" })], "pw-header__actions")], "pw-header__inner")
]);
const footer = B("core/group", { tagName: "footer", className: "pw-footer", backgroundColor: "footer", textColor: "footer-text", align: "full" }, [
  group([group([logoMark(true), para("Pedalwise", { cls: "pw-logo__text" })], "pw-logo pw-logo--footer"), navBlock("Footer menu", "pw-nav pw-nav--footer"), para("© 2026 Pedalwise", { cls: "pw-small" })], "pw-footer__inner"),
  group([buttons([waButton({ full: true, big: true })])], "pw-sticky-wa", { bg: "card" })
]);
const tpart = (slug, tag) => B("core/template-part", { slug: slug, tagName: tag, theme: "pedalwise" });
const main = kids => B("core/group", { tagName: "main", className: "pw-main", layout: { type: "default" } }, kids);

const templates = {};
templates["page"] = [tpart("header", "header"), main([B("core/post-content", { layout: { type: "default" } })]), tpart("footer", "footer")];
const blogBody = (titleBlock) => [
  group([titleBlock, bar(), para("News and repair tips from the Pedalwise workshop.", { cls: "pw-sub", align: "center" })], "pw-section pw-section--header pw-page-header", { bg: "tint", align: "full", tag: "section" }),
  section("pw-section--strip", "alt", [chips([["All", "/blog/"], ["News", "/category/news/"], ["Repair tips", "/category/repair-tips/"]], null)]),
  section("", "bg", [head("Latest posts", "News and repair tips."), postsQuery(6, true, true)]),
  banner("Have a question about your bike?", "Message us on WhatsApp.")
];
templates["index"] = [tpart("header", "header"), main(blogBody(heading("Blog", 1, { cls: "pw-h1", align: "center" }))), tpart("footer", "footer")];
templates["archive"] = [tpart("header", "header"), main(blogBody(B("core/query-title", { type: "archive", level: 1, className: "pw-h1 pw-center", showPrefix: false }))), tpart("footer", "footer")];
templates["single"] = [tpart("header", "header"), main([
  section("pw-section--article", "bg", [group([
    B("core/post-terms", { term: "category", className: "pw-eyebrow" }),
    B("core/post-title", { level: 1, className: "pw-h1 pw-h1--article" }),
    group([B("core/post-date"), para("By the Pedalwise team")], "pw-article__meta pw-small pw-muted"),
    B("core/post-featured-image", { className: "pw-photo pw-article__photo" }),
    B("core/post-content", { className: "pw-article__body", layout: { type: "default" } }),
    buttons([waButton({ big: true })]),
    para(link("Back to the blog", "/blog/"), { cls: "pw-link" })
  ], "pw-article")], { inner: "pw-inner--article" }),
  banner("Ready to book your repair?", "Message us on WhatsApp.")
]), tpart("footer", "footer")];

// ---------------------------------------------------------------- write + validate
const invalid = [];
const write = (file, blocks) => {
  const out = serialize(blocks) + "\n";
  const reparsed = parse(out);
  const check = bs => bs.forEach(b => { if (b.isValid === false) invalid.push(file + " :: " + b.name + " :: " + (b.validationIssues || []).map(i => (i.args || []).join(" | ")).join(" ; ").slice(0, 300)); check(b.innerBlocks || []); });
  check(reparsed);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  return { file, blocks: JSON.stringify(blocks.length), bytes: out.length, count: (out.match(/<!-- wp:/g) || []).length };
};

const report = [];
for (const [name, blocks] of Object.entries(pages)) report.push(write(path.join(OUT, "pages", name + ".html"), blocks));
for (const [name, blocks] of Object.entries(posts)) report.push(write(path.join(OUT, "posts", name + ".html"), blocks));
report.push(write(path.join(THEME, "parts", "header.html"), [header]));
report.push(write(path.join(THEME, "parts", "footer.html"), [footer]));
for (const [name, blocks] of Object.entries(templates)) report.push(write(path.join(THEME, "templates", name + ".html"), blocks));
// the data setup.sh needs for the posts
fs.writeFileSync(path.join(OUT, "posts", "posts.tsv"), POSTS.map(p => [p.slug, p.title, p.cat, p.ex, photoUrl(p.photo, 1600)].join("\t")).join("\n") + "\n");

for (const r of report) console.log(path.relative(OUT, r.file).padEnd(52), String(r.count).padStart(4), "blocks", String(r.bytes).padStart(7), "bytes");
if (invalid.length) { console.error("\nINVALID BLOCKS:\n" + invalid.join("\n")); process.exit(1); }
console.log("\nAll output re-parsed: every block is valid.");
