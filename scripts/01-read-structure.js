// Scripter script 01: read-only dump of the layer tree of the "Desktop 1440" frame.
// Run in the Scripter Figma plugin. Changes nothing. Used to learn the layer names before writing script 02.
const lines = [];
function walk(n, d) {
  let s = "  ".repeat(d) + n.type + " | " + n.name + " | " + Math.round(n.width) + "x" + Math.round(n.height);
  if ("layoutMode" in n && n.layoutMode !== "NONE") s += " " + n.layoutMode;
  if (n.type === "TEXT") s += ' "' + n.characters + '"';
  lines.push(s);
  if ("children" in n && d < 6) for (const c of n.children) walk(c, d + 1);
}
walk(figma.currentPage.children.find(n => n.name === "Desktop 1440"), 0);
print(lines.join("\n"));
