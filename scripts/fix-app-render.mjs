import fs from "node:fs";

const path = new URL("../src/App.jsx", import.meta.url);
const text = fs.readFileSync(path, "utf8");

const marker = '  if (page === "credits") {';
const start = text.indexOf(marker);

if (start === -1) {
  throw new Error('Could not find the render branch start in App.jsx');
}

const tail = `
  if (page === "credits") {
    return <CreditsPage onBack={() => setPage("editor")} />;
  }

  if (page === "guide") {
    return (
      <UsageGuidePage
        onBack={() => setPage("editor")}
        onOpenCredits={() => setPage("credits")}
      />
    );
  }

  return (
    <div className={\`app-shell \${previewOpen ? "preview-open" : ""}\`}>
      <header className="app-topbar">
        <div className="topbar-brand">
          <span className="topbar-logo-mark" aria-hidden="true">*</span>
          <span className="topbar-title">Resume Architect</span>
        </div>
        <div className="topbar-center">
          <span className="topbar-template-pill">
            Template: {activeTemplate.name}
          </span>
          <span className="topbar-template-pill">
            Sections: {enabledSections}/{totalSections}
          </span>
        </div>
        <div className="topbar-actions">
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
              <>
                <span className="compile-spinner" aria-hidden="true" />
                Compiling...
              </>
            ) : previewOpen ? (
              <>Close Preview</>
            ) : (
              <>Compile &amp; Preview</>
            )}
          </button>
        </div>
      </header>

      <div className="app-body">
        <EditorPanel
          resume={resume}
          templates={templateCatalog}
          exporting={exporting}
          compiling={compiling}
          previewOpen={previewOpen}
          onCompile={handleCompile}
          onTemplateChange={(id) => setResume((r) => ({ ...r, selectedTemplate: id }))}
          onLoadSample={() => setResume(createSampleResume())}
          onLoadBlank={() => setResume(createBlankResume())}
          onPersonalChange={handlePersonalChange}
          onStatementChange={handleStatementChange}
          onToggleVisibility={handleToggleVisibility}
          onResearchInterestsChange={(value) => setResume((r) => ({ ...r, researchInterests: value }))}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onMoveSection={handleMoveSection}
          onCustomThemeChange={handleCustomThemeChange}
        />
      </div>

      {previewOpen && (
        <div
          className="preview-overlay-bg"
          onClick={() => setPreviewOpen(false)}
          aria-hidden="true"
        />
      )}

      {previewOpen && (
        <aside className="preview-panel" aria-label="Resume preview panel">
          <div className="preview-panel-head">
            <div className="preview-panel-title-block">
              <p className="eyebrow">Live Preview</p>
              <h2>{activeTemplate.name}</h2>
              <p className="preview-panel-tagline">{activeTemplate.tagline}</p>
            </div>
            <button
              type="button"
              className="preview-close-btn"
              onClick={() => setPreviewOpen(false)}
              aria-label="Close preview"
            >
              X
            </button>
          </div>

          <div className="download-bar">
            <div className="format-pills">
              {[
                {
                  id: "pdf-image",
                  label: "PDF (Designed)",
                  hint: "Pixel-perfect - matches the visual template exactly",
                },
                {
                  id: "pdf-text",
                  label: "PDF (Searchable)",
                  hint: "Text-based PDF - selectable & highlightable in any PDF reader",
                },
                {
                  id: "docx",
                  label: "Word (.docx)",
                  hint: "Fully editable in Microsoft Word, Google Docs, or LibreOffice",
                },
                {
                  id: "image",
                  label: "PNG Image",
                  hint: "High-quality image for sharing, posting, or embedding",
                },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  title={fmt.hint}
                  className={\`format-pill\${exportFormat === fmt.id ? " is-active" : ""}\`}
                  onClick={() => setExportFormat(fmt.id)}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="primary-button download-btn"
              onClick={handleDownload}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Download"}
            </button>
          </div>

          {exportStatus && (
            <div className={\`export-toast export-toast--\${exportStatus}\`} role="status">
              {exportMsg}
            </div>
          )}

          <div className="preview-scroll">
            <div ref={previewRef}>
              <ResumePreview resume={resume} templates={templateCatalog} />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path, text.slice(0, start) + tail, "utf8");
