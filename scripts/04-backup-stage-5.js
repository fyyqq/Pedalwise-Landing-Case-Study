// Scripter script 04: save a backup of the three finished frames in a new section "Stage 5".
// Adds a new section below everything else and copies the frames into it. Changes no original frame.
const page = figma.currentPage;
const names = ["Brand Kit", "Desktop 1440", "Mobile 390"];
const src = names.map(n => page.children.find(c => c.type === "FRAME" && c.name === n));
if (src.some(s => !s)) {
  print("Missing a frame: " + names.filter((n, i) => !src[i]).join(", "));
} else if (page.children.find(c => c.type === "SECTION" && c.name.startsWith("Stage 5"))) {
  print("A Stage 5 section already exists. Stopping.");
} else {
  const maxY = Math.max(...page.children.map(c => c.y + c.height));
  const pad = 60, top = 120, gap = 120;
  const width = pad * 2 + gap * (src.length - 1) + src.reduce((a, s) => a + s.width, 0);
  const height = top + pad + Math.max(...src.map(s => s.height));
  const section = figma.createSection();
  section.name = "Stage 5 · Round 2 done · 2026-11-06";
  section.x = 0;
  section.y = maxY + 200;
  section.resizeWithoutConstraints(width, height);
  let x = pad;
  for (const s of src) {
    const c = s.clone();
    section.appendChild(c);
    c.name = s.name + " (archive)";
    c.x = x;
    c.y = top;
    x += c.width + gap;
  }
  figma.viewport.scrollAndZoomIntoView([section]);
  print("Created: " + section.name + " (" + Math.round(width) + "x" + Math.round(height) + ") with " + section.children.length + " frames");
}
