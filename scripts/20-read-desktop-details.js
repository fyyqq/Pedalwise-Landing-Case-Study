// Scripter script 20 (read-only): compact dump of "Desktop 1440" to plan the new look (Round 4).
// Per layer (depth 0 to 4): name, size, layout, padding, gap, fill, radius, stroke, font. Changes nothing.
const hex = c => "#" + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
const f = figma.currentPage.children.find(n => n.type === "FRAME" && n.name === "Desktop 1440");
const lines = [];
function walk(n, d) {
  let s = "  ".repeat(d) + n.name + " " + Math.round(n.width) + "x" + Math.round(n.height);
  if ("layoutMode" in n && n.layoutMode !== "NONE") s += " " + n.layoutMode[0] + " gap" + n.itemSpacing + " pad" + n.paddingTop + "/" + n.paddingRight + "/" + n.paddingBottom + "/" + n.paddingLeft;
  if (n.type !== "TEXT" && "fills" in n && n.fills !== figma.mixed) { const p = n.fills.find(x => x.type === "SOLID" && x.visible !== false); if (p) s += " fill" + hex(p.color); }
  if ("cornerRadius" in n && n.cornerRadius !== figma.mixed && n.cornerRadius) s += " r" + n.cornerRadius;
  if ("strokes" in n && n.strokes.length) s += " stroke" + n.strokeWeight;
  if (n.type === "TEXT") s += " " + n.fontSize + (n.fontName !== figma.mixed ? n.fontName.style : "") + ' "' + n.characters.slice(0, 18) + '"';
  lines.push(s);
  if ("children" in n && d < 4) for (const c of n.children) walk(c, d + 1);
}
walk(f, 0);
print(lines.join("\n"));
