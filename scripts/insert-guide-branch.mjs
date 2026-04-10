import fs from "node:fs";

const path = new URL("../src/App.jsx", import.meta.url);
let text = fs.readFileSync(path, "utf8");

if (!text.includes('if (page === "guide")')) {
  const guideBranch = `  if (page === "guide") {
    return (
      <>
        <header className="app-topbar">
          <div className="topbar-brand">
            <span className="topbar-logo-mark" aria-hidden="true">*</span>
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

  const marker = '\n\n  return (\n    <div className={`app-shell ${previewOpen ? "preview-open" : ""}`}>';
  if (!text.includes(marker)) {
    throw new Error("Could not find the main editor return marker in App.jsx");
  }

  text = text.replace(marker, `${guideBranch}${marker}`);
  fs.writeFileSync(path, text, "utf8");
}
