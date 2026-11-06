// Scripter script 35 (Round 5): re-wires every link on the three pages and prints a table.
// Script 34 set 128 links per page but 22 failed (error text was empty) and the flow-start step failed (Figma already makes one).
// Here every connection is rebuilt from layer names, one kind at a time, with the real error text, and the URL action is tried
// with and without openInNewTab. Kinds: page (logo, nav links, footer links), theme (switch), url (WhatsApp buttons and "Ask us on WhatsApp").
// Frame names: "<Home|Services|Prices|About|Contact> - <Light|Dark> - <width>". Runs with figma and print as arguments (leading await).
return (async () => {
  const out = [];
  const WA = "https://wa.me/15550100";
  await figma.loadAllPagesAsync();
  const pages = figma.root.children;
  const errs = {};
  const note = (k, e) => { const m = String((e && e.message) || e); errs[k] = errs[k] || {}; errs[k][m] = (errs[k][m] || 0) + 1; };
  for (const pg of pages) {
    await figma.setCurrentPageAsync(pg);
    const tops = pg.children.filter(c => c.type === "FRAME" && / - (Light|Dark) - \d+$/.test(c.name));
    const byKey = {};
    for (const f of tops) { const m = f.name.match(/^(\w+) - (Light|Dark) - (\d+)$/); byKey[m[1].toLowerCase() + "|" + m[2].toLowerCase() + "|" + m[3]] = f; }
    const cnt = { page: 0, theme: 0, url: 0, failed: 0 };
    for (const f of tops) {
      const m = f.name.match(/^(\w+) - (Light|Dark) - (\d+)$/);
      const key = m[1].toLowerCase(), mode = m[2].toLowerCase(), w = m[3];
      const set = async (node, action, kind) => {
        try { await node.setReactionsAsync([{ trigger: { type: "ON_CLICK" }, actions: [action] }]); cnt[kind]++; return true; }
        catch (e) { note(kind, e); cnt.failed++; return false; }
      };
      const toPage = k => ({ type: "NODE", destinationId: byKey[k + "|" + mode + "|" + w].id, navigation: "NAVIGATE", transition: null, resetVideoPosition: false });
      for (const n of f.findAll(() => true)) {
        if (n.name === "Logo" || n.name === "Footer Logo") await set(n, toPage("home"), "page");
        else if (n.name.indexOf("Nav Link - ") === 0 || n.name.indexOf("Footer Link - ") === 0) await set(n, toPage(n.name.split(" - ")[1].toLowerCase()), "page");
        else if (n.name === "Theme Switch") await set(n, { type: "NODE", destinationId: byKey[key + "|" + (mode === "light" ? "dark" : "light") + "|" + w].id, navigation: "NAVIGATE", transition: null, resetVideoPosition: false }, "theme");
        else if ((n.type === "FRAME" && n.name.indexOf("WhatsApp Button") !== -1) || (n.type === "TEXT" && n.characters === "Ask us on WhatsApp")) {
          let ok = await set(n, { type: "URL", url: WA }, "url");
          if (!ok) { cnt.failed--; ok = await set(n, { type: "URL", url: WA, openInNewTab: true }, "url"); }
        }
      }
    }
    let flows = "?";
    try { flows = pg.flowStartingPoints.map(x => x.name).join(",") || "none"; } catch (e) { flows = "err"; }
    out.push(pg.name + ": frames " + tops.length + ", page links " + cnt.page + ", theme " + cnt.theme + ", url " + cnt.url + ", failed " + cnt.failed + ", flow starts: " + flows);
  }
  for (const k of Object.keys(errs)) out.push("ERR " + k + ": " + JSON.stringify(errs[k]).slice(0, 300));
  print(out.join("\n"));
})();
