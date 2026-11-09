// Local preview WITHOUT WordPress: rebuilds what WordPress would output around the generated markup, so the CSS can be checked in a browser.
// It uses the real core block CSS (@wordpress/block-library/build-style/style.css), the theme.json palette (as WordPress prints it), the theme's
// style.css and theme.js, the real header/footer part markup, and static stand-ins for the few dynamic blocks (menu, site title, post query).
// What it can NOT show: real WordPress output, the Site Editor, Unsplash photos (replaced by grey pictures here), WooCommerce.
// Usage: node preview.cjs <outDir> [page ...]   (pages: 01-home 02-about 03-services 04-prices 05-shop 06-contact blog single)
// Screenshots need Playwright (optional): PREVIEW_SHOTS=1 node preview.cjs out 01-home
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const theme = path.join(root, "theme", "pedalwise");
const out = path.resolve(process.argv[2] || "preview-out");
const names = process.argv.slice(3).length ? process.argv.slice(3) : ["01-home", "02-about", "03-services", "04-prices", "05-shop", "06-contact", "blog", "single"];
fs.mkdirSync(out, { recursive: true });

const themeJson = JSON.parse(fs.readFileSync(path.join(theme, "theme.json"), "utf8"));
const palette = themeJson.settings.color.palette;
const coreCss = fs.readFileSync(path.join(__dirname, "node_modules/@wordpress/block-library/build-style/style.css"), "utf8");
const ownCss = fs.readFileSync(path.join(theme, "style.css"), "utf8");
const themeJs = fs.readFileSync(path.join(theme, "assets/theme.js"), "utf8");
const fontB64 = fs.readFileSync(path.join(theme, "assets/fonts/Inter-latin-variable.woff2")).toString("base64");
const posts = fs.readFileSync(path.join(root, "posts", "posts.tsv"), "utf8").trim().split("\n").map(l => { const [slug, title, cat, ex] = l.split("\t"); return { slug, title, cat, ex }; });

// what WordPress prints for the palette and body (global styles)
const globalCss = "body{" + palette.map(p => "--wp--preset--color--" + p.slug + ":" + p.color + ";").join("") +
  "--wp--preset--font-family--inter:" + themeJson.settings.typography.fontFamilies[0].fontFamily + ";margin:0;background-color:var(--wp--preset--color--bg);color:var(--wp--preset--color--ink);font-family:var(--wp--preset--font-family--inter);font-size:18px;line-height:1.5}" +
  palette.map(p => ".has-" + p.slug + "-color{color:var(--wp--preset--color--" + p.slug + ") !important}.has-" + p.slug + "-background-color{background-color:var(--wp--preset--color--" + p.slug + ") !important}").join("") +
  "a{color:var(--wp--preset--color--green-text)}h1,h2,h3,h4{font-weight:700;line-height:1.15;letter-spacing:-0.015em}" +
  ".is-layout-flex{display:flex;flex-wrap:wrap;align-items:center;gap:.5em}.wp-site-blocks{padding:0}" +
  "@font-face{font-family:Inter;font-weight:400 700;font-style:normal;src:url(data:font/woff2;base64," + fontB64 + ") format('woff2')}";

const grey = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9c7bf"/><stop offset="1" stop-color="#8fa498"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/></svg>');

const stubNav = (m) => {
  const items = [...m.matchAll(/<!-- wp:navigation-link (\{.*?\}) \/-->/g)].map(x => JSON.parse(x[1]));
  const cls = (m.match(/"className":"([^"]+)"/) || [])[1] || "";
  return '<nav class="wp-block-navigation is-layout-flex ' + cls + '"><ul class="wp-block-navigation__container is-responsive wp-block-navigation">' + items.map(i => '<li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content" href="' + i.url + '"><span class="wp-block-navigation-item__label">' + i.label + "</span></a></li>").join("") + "</ul></nav>";
};
const stubQuery = (n) => '<div class="wp-block-query pw-posts"><ul class="wp-block-post-template is-layout-grid">' + posts.slice(0, n).map(p =>
  '<li class="wp-block-post"><div class="wp-block-group pw-card pw-card--media pw-post has-card-background-color has-background"><figure class="wp-block-post-featured-image pw-post__img"><a href="#"><img src="' + grey + '" alt=""></a></figure><div class="wp-block-group pw-card__body"><div class="taxonomy-category wp-block-post-terms pw-eyebrow"><a href="#">' + p.cat + '</a></div><h3 class="wp-block-post-title pw-h3"><a href="#">' + p.title + '</a></h3><div class="wp-block-post-excerpt pw-muted"><p class="wp-block-post-excerpt__excerpt">' + p.ex + '</p></div><div class="wp-block-post-date pw-small pw-muted"><time>November 9, 2026</time></div></div></div></li>').join("") + "</ul></div>";

const render = (markup) => markup
  .replace(/<!-- wp:site-title [^>]*\/-->/g, '<p class="wp-block-site-title pw-logo__text"><a href="/" rel="home">Pedalwise</a></p>')
  .replace(/<!-- wp:navigation [\s\S]*?<!-- \/wp:navigation -->/g, stubNav)
  .replace(/<!-- wp:query \{[^\n]*"perPage":(\d+)[\s\S]*?<!-- \/wp:query -->(?!\s*<!-- \/wp:query)/g, (m, n) => stubQuery(Math.min(+n, 6)))
  .replace(/<!-- wp:post-title [^>]*\/-->/g, '<h1 class="wp-block-post-title pw-h1 pw-h1--article">Welcome to Pedalwise</h1>')
  .replace(/<!-- wp:post-terms [^>]*\/-->/g, '<div class="wp-block-post-terms pw-eyebrow"><a href="#">News</a></div>')
  .replace(/<!-- wp:post-date [^>]*\/-->/g, '<div class="wp-block-post-date"><time>November 9, 2026</time></div>')
  .replace(/<!-- wp:post-featured-image [^>]*\/-->/g, '<figure class="wp-block-post-featured-image pw-photo pw-article__photo"><img src="' + grey + '" alt=""></figure>')
  .replace(/<!-- wp:post-content [^>]*\/-->/g, () => '<div class="wp-block-post-content pw-article__body">' + stripC(fs.readFileSync(path.join(root, "posts/welcome-to-pedalwise.html"), "utf8")) + "</div>")
  .replace(/<!-- wp:query-title [^>]*\/-->/g, '<h1 class="wp-block-query-title pw-h1">Category: News</h1>')
  .replace(/<!-- wp:template-part \{"slug":"(header|footer)"[^>]*\/-->/g, (m, s) => stripC(fs.readFileSync(path.join(theme, "parts", s + ".html"), "utf8")));
function stripC(m) { return render2(m).replace(/<!--[\s\S]*?-->/g, ""); }
function render2(m) { return render(m); }
const finish = (m) => m.replace(/<!--[\s\S]*?-->/g, "").replace(/src="https:\/\/images\.unsplash\.com[^"]*"/g, 'src="' + grey + '"');

const doc = (title, bodyMarkup, dark) => "<!doctype html><html lang=\"en\" data-theme=\"" + (dark ? "dark" : "light") + "\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>" + title + "</title><style>" + coreCss + "\n" + globalCss + "\n" + ownCss + "</style></head><body class=\"wp-site-blocks-body\"><div class=\"wp-site-blocks\">" + finish(render(bodyMarkup)) + "</div><script>" + themeJs + "</script></body></html>";

const pageMarkup = (n) => {
  if (n === "blog") return fs.readFileSync(path.join(theme, "templates/index.html"), "utf8");
  if (n === "single") return fs.readFileSync(path.join(theme, "templates/single.html"), "utf8");
  return fs.readFileSync(path.join(theme, "parts/header.html"), "utf8") + fs.readFileSync(path.join(root, "pages", n + ".html"), "utf8") + fs.readFileSync(path.join(theme, "parts/footer.html"), "utf8");
};
for (const n of names) for (const dark of [false, true]) {
  const m = pageMarkup(n);
  // the blog templates hold the stand-ins for header/footer and the posts; the page query uses perPage 6
  fs.writeFileSync(path.join(out, n + (dark ? "-dark" : "") + ".html"), doc(n, m, dark));
}
console.log("wrote " + names.length * 2 + " files to " + out);

if (process.env.PREVIEW_SHOTS) {
  (async () => {
    const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
    const b = await chromium.launch();
    const sizes = (process.env.PREVIEW_SIZES || "1440,768,669,390").split(",").map(Number);
    for (const n of names) for (const dark of [false, true]) for (const w of sizes) {
      const pg = await b.newPage({ viewport: { width: w, height: 900 } });
      await pg.goto("file://" + path.join(out, n + (dark ? "-dark" : "") + ".html"));
      await pg.waitForTimeout(150);
      const over = await pg.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      await pg.screenshot({ path: path.join(out, n + (dark ? "-dark" : "") + "-" + w + ".png"), fullPage: true });
      console.log(n + (dark ? " dark " : " light ") + w + ": scrollWidth " + over.sw + " vs " + over.cw + (over.sw > over.cw ? "  <-- horizontal overflow" : ""));
      await pg.close();
    }
    await b.close();
  })();
}
