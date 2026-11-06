// Scripter script 06: backup before Round 3 changes. Saves Brand Kit, Desktop 1440 and Mobile 390 into a new section "Stage 6".
// Changes no original frame. Loaded by a short loader line (see scripts/README.md), runs with figma and print as arguments.
const page = figma.currentPage;
const names = ["Brand Kit", "Desktop 1440", "Mobile 390"];
const src = names.map(n => page.children.find(c => c.type === "FRAME" && c.name === n));
if (src.some(s => !s)) {
  print("Missing a frame");
} else if (page.children.find(c => c.type === "SECTION" && c.name.startsWith("Stage 6"))) {
  print("Stage 6 exists");
} else {
  const maxY = Math.max(...page.children.map(c => c.y + c.height));
  const pad = 60, top = 120, gap = 120;
  const width = pad * 2 + gap * 2 + src.reduce((a, s) => a + s.width, 0);
  const height = top + pad + Math.max(...src.map(s => s.height));
  const sec = figma.createSection();
  sec.name = "Stage 6 - Round 3 start - 2026-11-06";
  sec.x = 0;
  sec.y = maxY + 200;
  sec.resizeWithoutConstraints(width, height);
  let x = pad;
  for (const s of src) {
    const c = s.clone();
    sec.appendChild(c);
    c.name = s.name + " (archive)";
    c.x = x;
    c.y = top;
    x += c.width + gap;
  }
  print("Created " + sec.name + " with " + sec.children.length + " frames");
}
