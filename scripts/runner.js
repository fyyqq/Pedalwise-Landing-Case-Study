// Runner for the Scripter loader. The loader fetches this file once; this file reads scripts/next.txt (the name of the script to run)
// and the script itself through the GitHub API, which is never cached (raw.githubusercontent.com keeps old versions for minutes).
// To run another script: write its file name into scripts/next.txt, push, press cmd+Return in Scripter. Leading await in the loader.
return (async () => {
  const h = { headers: { Accept: "application/vnd.github.raw" } };
  const api = "https://api.github.com/repos/fyyqq/pedalwise-landing-case-study/contents/scripts/";
  const name = (await (await fetch(api + "next.txt?r=" + Date.now(), h)).text()).trim();
  const src = await (await fetch(api + name + "?r=" + Date.now(), h)).text();
  print("running " + name + " (" + src.length + " chars)");
  return new Function("figma", "print", src)(figma, print);
})();
