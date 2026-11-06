// Dispatcher: the Scripter loader always fetches this file (with a cache-busting query) and this file runs the script named below.
// Change NAME, push, press cmd+Return in Scripter. Runs with figma and print as arguments (leading await in the loader).
const NAME = "33-restructure-pages.js";
return (async () => {
  const base = "https://raw.githubusercontent.com/fyyqq/pedalwise-landing-case-study/main/scripts/";
  const src = await (await fetch(base + NAME + "?t=" + Date.now())).text();
  print("running " + NAME + " (" + src.length + " chars)");
  return new Function("figma", "print", src)(figma, print);
})();
