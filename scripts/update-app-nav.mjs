import fs from "node:fs";

const path = new URL("../src/App.jsx", import.meta.url);
let text = fs.readFileSync(path, "utf8");

if (!text.includes('import UsageGuidePage from "./components/UsageGuidePage";')) {
  text = text.replace(
    'import ResumePreview from "./components/ResumePreview";',
    'import ResumePreview from "./components/ResumePreview";\nimport UsageGuidePage from "./components/UsageGuidePage";',
  );
}

const editorTopbar = `        <div className="topbar-actions">
          <button type="button" className="topbar-link-btn" onClick={() => setPage("guide")}>
            How it works
          </button>
          <button type="button" className="topbar-link-btn" onClick={() => setPage("credits")}>
            Credits
          </button>
          <button
            type="button"
            className={\`compile-btn\${compiling ? " is-compiling" : ""}\${previewOpen ? " is-close" : ""}\`}
            onClick={handleCompile}
            disabled={compiling}
          >
            {compiling ? (
              <><span className="compile-spinner" aria-hidden="true" />Compilingâ€¦</>
            ) : previewOpen ? (
              <>âœ•&thinsp; Close Preview</>
            ) : (
              <>â¬¡&thinsp; Compile &amp; Preview</>
            )}
          </button>
        </div>`;

text = text.replace(
  /        <div className="topbar-actions">\r?\n[\s\S]*?className=\{\`compile-btn[\s\S]*?        <\/div>/,
  editorTopbar,
);

const creditsTopbar = `          <div className="topbar-actions">
            <button type="button" className="topbar-link-btn" onClick={() => setPage("guide")}>
              How it works
            </button>
            <button type="button" className="topbar-link-btn" onClick={() => setPage("editor")}>
              Back to Editor
            </button>
          </div>`;

text = text.replace(
  /          <div className="topbar-actions">\r?\n            <button type="button" className="topbar-link-btn" onClick=\{\(\) => setPage\("editor"\)\}>\r?\n[\s\S]*?            <\/button>\r?\n          <\/div>/,
  creditsTopbar,
);

const guideBranch = `  if (page === "guide") {
    return (
      <>
        <header className="app-topbar">
          <div className="topbar-brand">
            <span className="topbar-logo-mark" aria-hidden="true">◈</span>
            <span className="topbar-title">Resume Architect</span>
          </div>
          <div className="topbar-center" />
          <div className="topbar-actions">
            <button type="button" className="topbar-link-btn" onClick={() => setPage("credits")}>
              Credits
            </button>
            <button type="button" className="topbar-link-btn" onClick={() => setPage("editor")}>
              Back to Editor
            </button>
          </div>
        </header>
        <UsageGuidePage onBack={() => setPage("editor")} onOpenCredits={() => setPage("credits")} />
      </>
    );
  }
`;

const editorReturnTarget = '  return (\n    <div className={`app-shell ${previewOpen ? "preview-open" : ""}`}>';

text = text.replace(
  editorReturnTarget,
  `${guideBranch}\n  return (\n    <div className={\`app-shell \${previewOpen ? "preview-open" : ""}\`}>`,
);

fs.writeFileSync(path, text, "utf8");

const cssPath = new URL("../src/index.css", import.meta.url);
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".guide-page {")) {
  const guideStyles = fs
    .readFileSync(new URL("./guide-styles.css", import.meta.url), "utf8")
    .trimEnd();
  const marker = ".custom-header {";
  const markerIndex = css.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error("Could not find the custom theme section in src/index.css");
  }
  css = `${css.slice(0, markerIndex)}${guideStyles}\n\n${css.slice(markerIndex)}`;
  fs.writeFileSync(cssPath, css, "utf8");
}
