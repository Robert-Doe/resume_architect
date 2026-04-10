import fs from "node:fs";

const path = new URL("../src/App.jsx", import.meta.url);
let text = fs.readFileSync(path, "utf8");

text = text.replace(/Compiling[^<]*<\/>/, "Compiling...</>");
text = text.replace(/<>[^<]*Close Preview<\/>/, "<>Close Preview</>");
text = text.replace(/<>[^<]*Compile &amp; Preview<\/>/, "<>Compile &amp; Preview</>");

fs.writeFileSync(path, text, "utf8");
