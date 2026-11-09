# Pedalwise in WordPress: Figma design to live pages, fast

> The client (Sam) is simulated. This folder turns the approved Figma design into a WordPress block theme plus ready-made pages, so nobody builds the pages by hand.

**Status: generated and checked in a local browser preview. NOT yet tried on a real WordPress site** (no WordPress was reachable from where this was built). Do the 10-minute check at the bottom first.

## The old way vs this way

| | Old way | This way |
|---|---|---|
| Install | Theme, page builder, forms, CMS plugins | **One block theme** (no page-builder plugin) |
| Pages | Create each page, place every element by hand (about a week) | **One command** creates the pages (or paste one file per page) |
| Colors, fonts, spacing | Set by hand in each block | **Set once** in `theme.json` and `style.css`, from the Figma values |
| Header, footer | Rebuilt per page | **Once**, shared by every page (Appearance > Editor) |
| Client edits | Depends on the builder | Sam edits text and images in the normal block editor |

The page *content* is real WordPress core blocks (Group, Heading, Paragraph, Buttons, Image, Navigation, Query Loop). No plugin is needed for any designed page except the shop (see below).

## What is in this folder

| Path | What it is |
|---|---|
| `theme/pedalwise/` | The block theme: `theme.json` (palette, Inter font, content width), `style.css` (layout, 4 breakpoints, dark mode), `parts/` (header, footer), `templates/` (page, blog, archive, single post), `assets/` (font, tiny script for the dark mode switch) |
| `pedalwise-theme.zip` | The same theme, zipped, ready to upload |
| `pages/01-home.html` ... `06-contact.html` | One file per page, block markup for the **Code editor** |
| `posts/` | The 7 sample blog posts (`posts.tsv` holds title, category, excerpt, photo) |
| `setup.sh` | WP-CLI script: activate the theme, create the pages and posts, set front page and blog page |
| `build/` | The generator (`generate.cjs`) and the browser preview (`preview.cjs`) |

## Fastest route (about 4 steps)

1. **Upload the theme.** Appearance > Themes > Add New > Upload `pedalwise-theme.zip` > Activate. (Or copy `theme/pedalwise` to `wp-content/themes/`.)
2. **Create the pages and posts.** On the server (or Local's "Open site shell"), from this folder: `bash setup.sh`. It is safe to run again.
3. **Check the site** against the Figma frames (list at the bottom).
4. **Replace the stand-ins** (photos, map, shop) as described under "What is not finished".

**No command line?** For each page: Pages > Add New > title > menu (three dots) > **Code editor** > paste the file from `pages/` > Publish. Then Settings > Reading > "A static page": Home as front page, an empty page called "Blog" as posts page. Posts: paste `posts/*.html` the same way.

**Where it works:** a self-hosted WordPress (any host, or Local for staging) or a WordPress.com plan that allows uploading themes (verify on the official WordPress.com page). On a plan without theme upload you cannot use `theme/`; you could only paste the page files and re-create colors and CSS by hand, which loses most of the speed gain.

**Needs:** a recent WordPress (6.5 or newer, for font files in `theme.json` and the block features used; verify against your install).

## How the Figma design maps to WordPress

| Figma | WordPress |
|---|---|
| Colors (light and dark) | `theme.json` palette. Dark mode swaps the same colors in `style.css`, so every block switches |
| Inter font | Self-hosted file in `assets/fonts/` (declared in `theme.json`) |
| Desktop 1440 / Tablet 768 / iPhone Duo 669 / Mobile 390 | Breakpoints at 1200 / 768 / 600 in `style.css` (variables at the top: padding, gaps, font sizes) |
| Light / dark switch | Small switch in the header (`assets/theme.js`). First visit follows the visitor's system setting, then it remembers the choice |
| Sticky WhatsApp bar on phones | Footer part, shown under 600 px only |
| Logo B (P tile) | A small group block plus CSS (no image file) |
| Menu and footer links | Navigation blocks in `parts/header.html` and `parts/footer.html` |
| Blog page and news article | Real posts: the Query Loop in `templates/index.html` and `templates/single.html`, so Sam adds posts in the editor |

## What is not the same as Figma (honest list)

- **Photos** are hotlinked free Unsplash URLs, so the staging site looks right at once. Before launch, upload them to the Media Library and swap them (the posts' photos are already imported into the library by `setup.sh`). Credits: `notes/04-photo-credits.md`.
- **Map**: the Figma map was drawn in Figma and cannot be exported. The pages show a simple map-colored box with a caption. When Sam gives the address, replace it with a Map embed (Google Maps or OpenStreetMap "embed" code in a Custom HTML block).
- **"Draft wording, to be confirmed" pills** are kept for the client review. Add `.pw-draft { display: none; }` in Appearance > Editor > Styles > Additional CSS before launch.
- **Newsletter block: left out.** The Figma one has a fake email field that stores nothing. A real one needs a form or newsletter plugin; add it when Sam picks one.
- **Cart button in the header: left out.** There is no cart without a shop plugin, so the link would be broken. Add WooCommerce's mini-cart block (see below).
- **Blog "featured post" and "More from the blog"** are not built (Query Loop cannot cleanly skip the current post here). The blog filter buttons (All / News / Repair tips) are real category links.
- **Shop filter chips** link to the sections on the page (no live filtering). **"Add to cart" is "View product"**, because nothing can be added to a cart yet.
- **Current page in the menu**: the menu items are plain links, so a few lines of script (`assets/theme.js`) bold and underline the current one.
- Product, Cart, Checkout and Confirmation pages are **not generated on purpose**: in the Figma they are design only (fake fields, "do not enter real card details"). Publishing static copies would be a fake shop. They come from WooCommerce, below.

## The shop: what is needed

`pages/05-shop.html` (and the product cards on Home, Services, Prices, About) are a **static preview** of the Figma shop. For a working shop (verify names on the official WooCommerce docs):

1. Install **WooCommerce** (free) and run its setup. It creates the Cart and Checkout pages itself, using its own blocks, and the theme's colors and fonts apply to them.
2. Add the products (the 12 sample products and prices are in `scripts/76-build-site-blog.js` and the Figma, all marked "sample").
3. On the Shop page, replace the three product grids with WooCommerce's **Product Collection** block. In the header, add the **Mini-Cart** block next to the WhatsApp button.
4. The single product page is a template: Appearance > Editor > Templates > Single Product.
5. Payments, delivery rules and taxes need a payment-gateway plugin and real business decisions from Sam. None of that is in the Figma.

## Rebuilding after a design change

```
cd wordpress/build
npm install
node generate.cjs      # rewrites pages/, posts/, theme templates and parts; fails if any block is invalid
bash make-zip.sh       # rebuilds pedalwise-theme.zip
PREVIEW_SHOTS=1 node preview.cjs out   # optional: local browser preview + overflow check (needs Playwright)
```

`generate.cjs` builds every page with WordPress's own block code (`@wordpress/block-library`), then reads the output back and checks each block is valid. That is why the markup does not trigger "this block contains unexpected or invalid content". It checks the markup, not your WordPress version: if the editor offers "Attempt block recovery" on a page, tell me which block.

## 10-minute check on a real site (do this first)

1. Upload and activate the theme, run `setup.sh`.
2. Open each page at desktop width, then 768, 669 and 390 (browser dev tools), light and dark. Compare with `screens/round7-*.jpg` and `screens/round5b-*.jpg`.
3. In the editor, open Home and the header: no "invalid content" warnings, the menu and WhatsApp buttons work.
4. Report what differs. Likely first fixes: spacing in the header menu, the dark switch, WordPress version differences.
