// Scripter script 07 (Round 3, change 3): a WhatsApp button that stays visible at the bottom of the phone screen.
// Client request: "Could the WhatsApp button stay visible at the bottom of the phone screen while people scroll?"
// Backup first: section "Stage 6" (script 06). Runs with figma and print as arguments.
const page = figma.currentPage;
const out = [];
const m = page.children.find(c => c.type === "FRAME" && c.name === "Mobile 390");
const src = m ? m.findOne(n => n.name === "Contact WhatsApp Button") : null;
if (!m || !src) {
  out.push("Mobile 390 or the Contact WhatsApp Button is missing");
} else if (m.findOne(n => n.name === "Sticky WhatsApp Bar")) {
  out.push("Sticky WhatsApp Bar already exists");
} else {
  const bar = figma.createFrame();
  bar.name = "Sticky WhatsApp Bar";
  bar.layoutMode = "VERTICAL";
  bar.primaryAxisSizingMode = "AUTO";
  bar.counterAxisSizingMode = "FIXED";
  bar.resize(390, 76);
  bar.paddingTop = 12;
  bar.paddingBottom = 12;
  bar.paddingLeft = 16;
  bar.paddingRight = 16;
  bar.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.96 }];
  bar.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.12 }, offset: { x: 0, y: -2 }, radius: 12, spread: 0, visible: true, blendMode: "NORMAL" }];
  m.appendChild(bar);
  bar.layoutPositioning = "ABSOLUTE";
  bar.x = 0;
  bar.y = 768;
  const btn = src.clone();
  bar.appendChild(btn);
  btn.layoutSizingHorizontal = "FILL";
  out.push("bar added at y768, button " + Math.round(btn.height) + " px high");
  try {
    m.overflowDirection = "VERTICAL";
    m.numberOfFixedChildren = 1;
    out.push("fixed while scrolling: set");
  } catch (e) {
    out.push("fixed flag failed: " + e.message);
  }
  const foot = m.findOne(n => n.name.startsWith("Footer"));
  if (foot && foot.layoutMode !== "NONE") {
    foot.paddingBottom = foot.paddingBottom + 72;
    out.push("footer bottom padding +72 so the bar does not cover the copyright line");
  }
}
print(out.join(" | "));
