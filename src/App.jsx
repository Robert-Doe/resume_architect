import { useEffect, useMemo, useRef, useState } from "react";
import CreditsPage from "./components/CreditsPage";
import EditorPanel from "./components/EditorPanel";
import ResumePreview from "./components/ResumePreview";
import UsageGuidePage from "./components/UsageGuidePage";
import {
  createBlankResume,
  createSampleResume,
  DEFAULT_SECTION_ORDER,
  factories,
  templateCatalog,
} from "./data/resumeModel";
import { exportElementToPdf } from "./utils/exportPdf";
import { exportPdfText } from "./utils/exportPdfText";
import { exportToDocx } from "./utils/exportDocx";
import { exportElementToImage } from "./utils/exportImage";

const STORAGE_KEY = "resume-architect-draft-v2";

const slugify = (value) =>
  String(value || "resume")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function migrateResume(stored) {
  const blank = createBlankResume();
  return {
    ...blank,
    ...stored,
    personal: { ...blank.personal, ...stored.personal },
    statement: { ...blank.statement, ...stored.statement },
    visibility: { ...blank.visibility, ...stored.visibility },
    certifications: stored.certifications ?? blank.certifications,
    awards:         stored.awards         ?? blank.awards,
    languages:      stored.languages      ?? blank.languages,
    memberships:    stored.memberships    ?? blank.memberships,
    teachingExperience:      stored.teachingExperience      ?? blank.teachingExperience,
    researchExperience:      stored.researchExperience      ?? blank.researchExperience,
    conferencePresentation:  stored.conferencePresentation  ?? blank.conferencePresentation,
    invitedTalks:            stored.invitedTalks            ?? blank.invitedTalks,
    grantsAndFunding:        stored.grantsAndFunding        ?? blank.grantsAndFunding,
    sectionOrder:            stored.sectionOrder            ?? blank.sectionOrder,
    customThemeJson:         stored.customThemeJson         ?? blank.customThemeJson,
  };
}

const loadStoredResume = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSampleResume();
    return migrateResume(JSON.parse(raw));
  } catch {
    return createSampleResume();
  }
};

export default function App() {
  const previewRef = useRef(null);

  const [resume, setResume] = useState(loadStoredResume);
  const [page, setPage] = useState("editor");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf-image");
  const [exportStatus, setExportStatus] = useState(null); // null | "preparing" | "done" | "error"
  const [exportMsg, setExportMsg] = useState("");

  // Persist
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume)); } catch {}
  }, [resume]);

  // Escape closes preview
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && previewOpen) setPreviewOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [previewOpen]);

  const activeTemplate = useMemo(
    () => templateCatalog.find((t) => t.id === resume.selectedTemplate) ?? templateCatalog[0],
    [resume.selectedTemplate],
  );

  // ── Resume Handlers ───────────────────────────────────────────────────────────

  const handlePersonalChange = (field, value) =>
    setResume((r) => ({ ...r, personal: { ...r.personal, [field]: value } }));

  const handleStatementChange = (field, value) =>
    setResume((r) => ({ ...r, statement: { ...r.statement, [field]: value } }));

  const handleToggleVisibility = (section) =>
    setResume((r) => ({
      ...r,
      visibility: { ...r.visibility, [section]: !r.visibility[section] },
    }));

  const handleAddItem = (section) =>
    setResume((r) => ({
      ...r,
      [section]: [...(r[section] ?? []), factories[section]()],
    }));

  const handleUpdateItem = (section, id, field, value) =>
    setResume((r) => ({
      ...r,
      [section]: (r[section] ?? []).map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    }));

  const handleRemoveItem = (section, id) =>
    setResume((r) => ({
      ...r,
      [section]: (r[section] ?? []).filter((entry) => entry.id !== id),
    }));

  const handleMoveSection = (key, direction) => {
    setResume(r => {
      const order = [...(r.sectionOrder ?? DEFAULT_SECTION_ORDER)];
      const idx = order.indexOf(key);
      if (idx === -1) return r;
      if (direction === 'up' && idx > 0) {
        [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
      } else if (direction === 'down' && idx < order.length - 1) {
        [order[idx], order[idx + 1]] = [order[idx + 1], order[idx]];
      }
      return { ...r, sectionOrder: order };
    });
  };

  const handleCustomThemeChange = (value) =>
    setResume(r => ({ ...r, customThemeJson: value }));

  // ── Compile / Preview ─────────────────────────────────────────────────────────

  const handleCompile = () => {
    if (previewOpen) { setPreviewOpen(false); return; }
    setCompiling(true);
    setTimeout(() => { setCompiling(false); setPreviewOpen(true); }, 520);
  };

  // ── Download ──────────────────────────────────────────────────────────────────

  const baseFilename = `${slugify(resume.personal.fullName || "resume")}-${resume.selectedTemplate}`;

  const handleDownload = async () => {
    if (exporting) return;
    setExporting(true);
    setExportStatus("preparing");
    setExportMsg("Preparing download…");
    try {
      if (exportFormat === "pdf-image") {
        if (!previewRef.current) throw new Error("Preview not rendered.");
        await exportElementToPdf(previewRef.current, `${baseFilename}.pdf`);
        setExportMsg("Designed PDF downloaded.");
      } else if (exportFormat === "pdf-text") {
        await exportPdfText(resume, `${baseFilename}.pdf`);
        setExportMsg("Searchable PDF downloaded.");
      } else if (exportFormat === "docx") {
        await exportToDocx(resume, baseFilename);
        setExportMsg("Word document downloaded.");
      } else if (exportFormat === "image") {
        if (!previewRef.current) throw new Error("Preview not rendered.");
        await exportElementToImage(previewRef.current, baseFilename);
        setExportMsg("Image downloaded.");
      }
      setExportStatus("done");
    } catch (err) {
      console.error("Export failed", err);
      setExportMsg("Export failed — please try again.");
      setExportStatus("error");
    } finally {
      setExporting(false);
      setTimeout(() => setExportStatus(null), 5000);
    }
  };

  // ── Dashboard stats ───────────────────────────────────────────────────────────

  const enabledSections = Object.values(resume.visibility).filter(Boolean).length;
  const totalSections   = Object.values(resume.visibility).length;

  // ── Render ────────────────────────────────────────────────────────────────────


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
    <div className={`app-shell ${previewOpen ? "preview-open" : ""}`}>
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
            className={`compile-btn${compiling ? " is-compiling" : ""}${previewOpen ? " is-close" : ""}`}
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
                  className={`format-pill${exportFormat === fmt.id ? " is-active" : ""}`}
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
            <div className={`export-toast export-toast--${exportStatus}`} role="status">
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
