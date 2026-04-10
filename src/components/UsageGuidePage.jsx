import { useState } from "react";

const STEPS = [
  {
    eyebrow: "Step 1",
    title: "Start with a sample or a blank slate",
    summary:
      "Use the sample resume if you want a guided tour, or start blank if you want to build from scratch.",
    action: "Load sample or start blank",
    tag: "Warm start",
  },
  {
    eyebrow: "Step 2",
    title: "Fill your details and pick a template",
    summary:
      "Enter your name, links, and content, then click a template tile to change the look without rewriting anything.",
    action: "Identity + template",
    tag: "Make it yours",
  },
  {
    eyebrow: "Step 3",
    title: "Compile and preview before exporting",
    summary:
      "Open the live preview to check layout, spacing, and section order before you download the final result.",
    action: "Compile & preview",
    tag: "Quick check",
  },
  {
    eyebrow: "Step 4",
    title: "Export the format you need",
    summary:
      "Download a designed PDF, searchable PDF, Word document, or PNG image depending on the use case.",
    action: "PDF, DOCX, or PNG",
    tag: "Ship it",
  },
];

function StepMock({ step }) {
  if (step === 0) {
    return (
      <div className="guide-mock-stack">
        <div className="guide-mock-card guide-mock-card--soft">
          <span className="guide-mock-kicker">Start here</span>
          <strong>Load sample</strong>
          <p>Instantly fills the app with example content so you can explore every section.</p>
        </div>
        <div className="guide-mock-row">
          <div className="guide-mock-pill guide-mock-pill--active">Load sample</div>
          <div className="guide-mock-pill">Start blank</div>
        </div>
        <div className="guide-mock-note">
          <strong>Tip</strong>
          <span>Great when you want to see the full flow in one pass.</span>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="guide-mock-stack">
        <div className="guide-mock-grid">
          <div className="guide-mock-field">
            <span>Full name</span>
            <strong>Alex Example</strong>
          </div>
          <div className="guide-mock-field">
            <span>Email</span>
            <strong>alex@example.com</strong>
          </div>
        </div>
        <div className="guide-mock-grid">
          <div className="guide-mock-field">
            <span>Website</span>
            <strong>example.com</strong>
          </div>
          <div className="guide-mock-field">
            <span>Location</span>
            <strong>Example City, USA</strong>
          </div>
        </div>
        <div className="guide-mock-template-row">
          <div className="guide-mock-template active">Scholar</div>
          <div className="guide-mock-template">Modern</div>
          <div className="guide-mock-template">Executive</div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="guide-mock-stack">
        <div className="guide-mock-compile">
          <span className="guide-spinner" aria-hidden="true" />
          <strong>Compiling resume preview</strong>
          <p>The app builds a live preview from the same data you entered in the editor.</p>
        </div>
        <div className="guide-mock-preview">
          <div className="guide-mock-preview-head">
            <span className="guide-mock-preview-title">Live Preview</span>
            <span className="guide-mock-preview-badge">Ready</span>
          </div>
          <div className="guide-mock-preview-lines">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-mock-stack">
      <div className="guide-mock-export-grid">
        <div className="guide-mock-export active">PDF</div>
        <div className="guide-mock-export">Searchable PDF</div>
        <div className="guide-mock-export">Word</div>
        <div className="guide-mock-export">PNG</div>
      </div>
      <div className="guide-mock-note guide-mock-note--success">
        <strong>Done</strong>
        <span>Your resume is ready to share, submit, or post.</span>
      </div>
    </div>
  );
}

export default function UsageGuidePage({ onBack, onOpenCredits }) {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];

  return (
    <div className="guide-page">
      <div className="credits-topbar-spacer" />
      <div className="guide-content">
        <button type="button" className="ghost-button guide-back-btn" onClick={onBack}>
          Back to Editor
        </button>

        <header className="guide-hero">
          <p className="eyebrow">Quick Tour</p>
          <h1>How to use Resume Architect</h1>
          <p className="guide-description">
            A short walkthrough so anyone can open the app, build a resume, preview it, and export it without guessing.
          </p>
          <div className="guide-meta-row">
            <span className="credits-badge">4 steps</span>
            <span className="credits-badge">Interactive tour</span>
            <button type="button" className="credits-badge credits-badge--button" onClick={onOpenCredits}>
              Credits
            </button>
          </div>
        </header>

        <div className="guide-layout">
          <section className="guide-step-list" aria-label="Guide steps">
            {STEPS.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`guide-step-card${activeStep === index ? " is-active" : ""}`}
                onClick={() => setActiveStep(index)}
              >
                <span className="guide-step-eyebrow">{item.eyebrow}</span>
                <strong>{item.title}</strong>
                <p>{item.summary}</p>
                <span className="guide-step-action">{item.action}</span>
              </button>
            ))}
          </section>

          <aside className="guide-preview-panel" aria-label="Guide preview">
            <div className="guide-preview-frame">
              <div className="guide-preview-topbar">
                <span className="guide-window-dot" />
                <span className="guide-window-dot" />
                <span className="guide-window-dot" />
                <span className="guide-preview-label">{step.tag}</span>
              </div>
              <div className="guide-preview-body">
                <div className="guide-preview-header">
                  <span className="guide-preview-kicker">{step.eyebrow}</span>
                  <h2>{step.title}</h2>
                  <p>{step.summary}</p>
                </div>
                <StepMock step={activeStep} />
              </div>
            </div>
          </aside>
        </div>

        <footer className="guide-footer">
          Click a step to see the flow, then jump back to the editor and try it yourself.
        </footer>
      </div>
    </div>
  );
}
