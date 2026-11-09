#!/usr/bin/env bash
# Pedalwise one-shot setup with WP-CLI: activates the theme, creates the 7 pages (6 designed + an empty "Blog" page),
# sets the front page and the posts page, creates the two blog categories and the 7 sample posts with photos.
# Safe to run again: pages and posts are found by slug and updated, not duplicated.
#
# Run it from this folder, on the server (or in "Open site shell" of Local):   bash setup.sh
# Needs: WP-CLI (`wp`), the theme folder already in wp-content/themes/pedalwise, and outbound internet for the sample photos.
# Optional: CLEAN_DEFAULTS=1 bash setup.sh   also deletes the default "Hello world!" post and "Sample Page".
set -euo pipefail

WP="${WP:-wp}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! $WP theme is-installed pedalwise; then
  echo "The theme is not installed. Upload theme/pedalwise (as a zip) or copy it to wp-content/themes/pedalwise first." >&2
  exit 1
fi
$WP theme activate pedalwise
$WP option update blogname "Pedalwise"
$WP option update blogdescription "Bike repair near the train station"
$WP option update permalink_structure "/%postname%/"

# upsert_page <slug> <title> <file or empty>  -> prints the page ID
upsert_page() {
  local slug="$1" title="$2" file="$3" id
  id="$($WP post list --post_type=page --name="$slug" --post_status=any --field=ID | head -n1)"
  if [ -z "$id" ]; then
    if [ -n "$file" ]; then
      id="$($WP post create "$file" --post_type=page --post_status=publish --post_title="$title" --post_name="$slug" --porcelain)"
    else
      id="$($WP post create --post_type=page --post_status=publish --post_title="$title" --post_name="$slug" --porcelain)"
    fi
  elif [ -n "$file" ]; then
    $WP post update "$id" "$file" --post_title="$title" >/dev/null
  fi
  echo "$id"
}

HOME_ID="$(upsert_page home "Home" "$DIR/pages/01-home.html")"
upsert_page about "About" "$DIR/pages/02-about.html" >/dev/null
upsert_page services "Services" "$DIR/pages/03-services.html" >/dev/null
upsert_page prices "Prices" "$DIR/pages/04-prices.html" >/dev/null
upsert_page shop "Shop" "$DIR/pages/05-shop.html" >/dev/null
upsert_page contact "Contact" "$DIR/pages/06-contact.html" >/dev/null
BLOG_ID="$(upsert_page blog "Blog" "")"   # empty on purpose: the theme's blog template draws the page

$WP option update show_on_front page
$WP option update page_on_front "$HOME_ID"
$WP option update page_for_posts "$BLOG_ID"

# categories (the Blog filter buttons link to /category/news/ and /category/repair-tips/)
$WP term create category "News" --slug=news >/dev/null 2>&1 || true
$WP term create category "Repair tips" --slug=repair-tips >/dev/null 2>&1 || true

# sample posts: slug <TAB> title <TAB> category <TAB> excerpt <TAB> photo URL (free Unsplash photos, see ../notes/04-photo-credits.md)
TMP="$(mktemp -d)"
while IFS=$'\t' read -r slug title cat excerpt photo; do
  [ -z "$slug" ] && continue
  case "$cat" in "Repair tips") cslug="repair-tips" ;; *) cslug="news" ;; esac
  catid="$($WP term get category "$cslug" --by=slug --field=term_id)"
  pid="$($WP post list --post_type=post --name="$slug" --post_status=any --field=ID | head -n1)"
  if [ -z "$pid" ]; then
    pid="$($WP post create "$DIR/posts/$slug.html" --post_status=publish --post_title="$title" --post_name="$slug" --post_excerpt="$excerpt" --post_category="$catid" --porcelain)"
    if curl -fsSL -o "$TMP/$slug.jpg" "$photo"; then
      $WP media import "$TMP/$slug.jpg" --post_id="$pid" --featured_image --title="$title" --alt="$title" >/dev/null || echo "warning: could not attach the photo to $slug" >&2
    else
      echo "warning: could not download the photo for $slug" >&2
    fi
  else
    $WP post update "$pid" "$DIR/posts/$slug.html" --post_title="$title" --post_excerpt="$excerpt" >/dev/null
  fi
done < "$DIR/posts/posts.tsv"
rm -rf "$TMP"

if [ "${CLEAN_DEFAULTS:-0}" = "1" ]; then
  for s in hello-world sample-page; do
    for t in post page; do
      id="$($WP post list --post_type=$t --name="$s" --field=ID | head -n1)"
      [ -n "$id" ] && $WP post delete "$id" --force
    done
  done
fi

$WP rewrite flush
echo "Done. Open the site and check: Home, About, Services, Prices, Shop, Blog, Contact."
