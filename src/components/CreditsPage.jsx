// ─── Credits Page ──────────────────────────────────────────────────────────────
// Edit this file to add/remove collaborators.

const COLLABORATORS = [
  {
    name: "Example Contributor",
    role: "Project Lead & Principal Developer",
    github: "https://github.com/example-user/",
    linkedin: "https://linkedin.com/in/example-user/",
    website: "https://example.com",
    avatar: null,
    bio: "Example contributor who built and maintains Resume Architect.",
  },
  // Add more collaborators here
];

const PROJECT_INFO = {
  name: "Resume Architect",
  description: "An open-source, browser-based CV builder with 11 professional templates, 4 export formats (Designed PDF, Searchable PDF, Word .docx, PNG Image), and 17 content sections covering everything from academic grants to conference presentations.",
  version: "1.0.0",
  github: "https://github.com/example-org/CV_Template",
  license: "MIT",
  year: new Date().getFullYear(),
};

export default function CreditsPage({ onBack }) {
  return (
    <div className="credits-page">
      <div className="credits-topbar-spacer" />
      <div className="credits-content">
        <button type="button" className="ghost-button credits-back-btn" onClick={onBack}>
          ← Back to Editor
        </button>

        <header className="credits-hero">
          <p className="eyebrow">Open Source</p>
          <h1>{PROJECT_INFO.name}</h1>
          <p className="credits-description">{PROJECT_INFO.description}</p>
          <div className="credits-meta-row">
            <span className="credits-badge">v{PROJECT_INFO.version}</span>
            <span className="credits-badge">{PROJECT_INFO.license} License</span>
            <a href={PROJECT_INFO.github} target="_blank" rel="noreferrer" className="credits-badge credits-badge--link">
              GitHub ↗
            </a>
          </div>
        </header>

        <section className="credits-section">
          <h2 className="credits-section-title">Contributors</h2>
          <div className="credits-grid">
            {COLLABORATORS.map((person) => (
              <article key={person.name} className="credits-card">
                <div className="credits-card-avatar">
                  {person.avatar ? (
                    <img src={person.avatar} alt={person.name} />
                  ) : (
                    <span className="credits-avatar-initials">
                      {person.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="credits-card-body">
                  <h3>{person.name}</h3>
                  <p className="credits-role">{person.role}</p>
                  {person.bio && <p className="credits-bio">{person.bio}</p>}
                  <div className="credits-links">
                    {person.github && (
                      <a href={person.github} target="_blank" rel="noreferrer" className="credits-link">
                        GitHub
                      </a>
                    )}
                    {person.linkedin && (
                      <a href={person.linkedin} target="_blank" rel="noreferrer" className="credits-link">
                        LinkedIn
                      </a>
                    )}
                    {person.website && (
                      <a href={person.website} target="_blank" rel="noreferrer" className="credits-link">
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="credits-footer">
          © {PROJECT_INFO.year} {PROJECT_INFO.name}. Released under the {PROJECT_INFO.license} License.
        </footer>
      </div>
    </div>
  );
}
