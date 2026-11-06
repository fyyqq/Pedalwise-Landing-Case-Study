// Scripter script 08 (read-only): list every solid colour used in Desktop 1440 and Mobile 390, by role (fill, text, stroke), with counts.
// Used to plan the dark mode. Changes nothing. Runs with figma and print as arguments.
const page = figma.currentPage;
const hex = c => "#" + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
const count = {};
function add(role, paint, extra) {
  if (!paint || paint.type !== "SOLID" || paint.visible === false) return;
  const key = role + " " + hex(paint.color) + (paint.opacity !== undefined && paint.opacity < 1 ? "@" + paint.opacity.toFixed(2) : "");
  count[key] = (count[key] || 0) + 1;
}
function walk(n) {
  if (n.type === "TEXT") {
    if (n.fills !== figma.mixed) for (const p of n.fills) add("text", p);
  } else {
    if ("fills" in n && n.fills !== figma.mixed) for (const p of n.fills) add("fill", p);
    if ("strokes" in n) for (const p of n.strokes) add("stroke", p);
  }
  if ("children" in n) for (const c of n.children) walk(c);
}
for (const name of ["Desktop 1440", "Mobile 390"]) {
  const f = page.children.find(c => c.type === "FRAME" && c.name === name);
  if (f) walk(f);
}
print(Object.entries(count).sort((a, b) => b[1] - a[1]).map(e => e[0] + " x" + e[1]).join(" | "));
