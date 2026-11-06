// Scripter script 17: backup before the QA fixes. Saves Brand Kit and all eight page frames into a new section "Stage 7".
// Changes no original frame. Runs with figma and print as arguments.
const page = figma.currentPage;
const names = ["Brand Kit", "Desktop 1440", "Mobile 390", "Desktop 1440 Dark", "Mobile 390 Dark", "Tablet 768", "iPhone Duo Open 669", "Tablet 768 Dark", "iPhone Duo Open 669 Dark"];
const src = names.map(n => page.children.find(c => c.type === "FRAME" && c.name === n));
if (src.some(s => !s)) {
  print("Missing a frame: " + names.filter((n, i) => !src[i]).join(", "));
} else if (page.children.find(c => c.type === "SECTION" && c.name.startsWith("Stage 7"))) {
  print("Stage 7 exists");
} else {
  const maxY = Math.max(...page.children.map(c => c.y + c.height));
  const pad = 60, top = 120, gap = 120;
  const width = pad * 2 + gap * (src.length - 1) + src.reduce((a, s) => a + s.width, 0);
  const height = top + pad + Math.max(...src.map(s => s.height));
  const sec = figma.createSection();
  sec.name = "Stage 7 - Before QA fixes - 2026-11-06";
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
