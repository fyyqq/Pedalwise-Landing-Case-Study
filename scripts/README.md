# scripts

Figma Plugin API scripts for the free Scripter plugin. Each one is numbered in the order it was run.

How an AI assistant runs them without pasting long code: Scripter gets one short loader line, which fetches the script from this repo and runs it.
Typing long code into Scripter's editor breaks (autocomplete and dropped characters), so the loader is typed once and only the file name changes.

```js
new Function("figma","print",await (await fetch("https://raw.githubusercontent.com/fyyqq/pedalwise-landing-case-study/main/scripts/NAME.js")).text())(figma,print)
```

Only scripts from this repository are loaded. Each script is read before it is committed.
