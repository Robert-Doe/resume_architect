import { DEFAULT_CUSTOM_THEME_JSON, DEFAULT_SECTION_ORDER, FONT_OPTIONS } from "../data/resumeModel";

// ─── Form Primitives ──────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={onChange} />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="field field-textarea">
      <span>{label}</span>
      <textarea rows={rows} value={value} placeholder={placeholder} onChange={onChange} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={onChange} className="field-select">
        <option value="">— Select —</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

// ─── Layout Components ────────────────────────────────────────────────────────

function EditorBlock({ title, subtitle, visible, onToggle, onMoveUp, onMoveDown, children }) {
  return (
    <details open className="editor-section">
      <summary>
        <div className="editor-section-info">
          <strong>{title}</strong>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <div className="editor-section-controls" onClick={e => e.stopPropagation()}>
          {onMoveUp && (
            <button type="button" className="reorder-btn" onClick={onMoveUp} title="Move section up">↑</button>
          )}
          {onMoveDown && (
            <button type="button" className="reorder-btn" onClick={onMoveDown} title="Move section down">↓</button>
          )}
          <span className="summary-chevron" aria-hidden="true">›</span>
        </div>
      </summary>
      <div className="editor-section-body">
        {typeof visible === "boolean" ? (
          <label className="toggle-row">
            <input type="checkbox" checked={visible} onChange={onToggle} />
            <span>Show this section in the resume preview and exported files</span>
          </label>
        ) : null}
        {children}
      </div>
    </details>
  );
}

function EntryCard({ title, subtitle, children, onRemove }) {
  return (
    <article className="entry-card">
      <div className="entry-card-head">
        <div>
          <h4>{title}</h4>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {onRemove ? (
          <button type="button" className="ghost-button danger-button" onClick={onRemove}>
            Remove
          </button>
        ) : null}
      </div>
      <div className="entry-card-body">{children}</div>
    </article>
  );
}

// ─── Main EditorPanel ─────────────────────────────────────────────────────────

const LANGUAGE_PROFICIENCY = ["Native", "Fluent", "Professional Working", "Conversational", "Basic"];

export default function EditorPanel({
  resume,
  templates,
  exporting,
  compiling,
  previewOpen,
  onCompile,
  onTemplateChange,
  onLoadSample,
  onLoadBlank,
  onPersonalChange,
  onStatementChange,
  onToggleVisibility,
  onResearchInterestsChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onMoveSection,
  onCustomThemeChange,
}) {
  const sectionOrder = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;

  // Build a map from section key to its editor JSX
  const sectionEditorMap = {
    statement: null, // handled statically above orderable sections

    education: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Education"
        subtitle="List your degrees in reverse chronological order."
        visible={resume.visibility.education}
        onToggle={() => onToggleVisibility("education")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.education.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.degree || `Education Entry ${i + 1}`}
            subtitle={entry.institution}
            onRemove={resume.education.length > 1 ? () => onRemoveItem("education", entry.id) : undefined}
          >
            <div className="field-grid two-up">
              <Field label="Degree or program" value={entry.degree} placeholder="PhD Computer Science" onChange={(e) => onUpdateItem("education", entry.id, "degree", e.target.value)} />
              <Field label="Institution" value={entry.institution} placeholder="Example University" onChange={(e) => onUpdateItem("education", entry.id, "institution", e.target.value)} />
              <Field label="Location" value={entry.location} placeholder="Example City, Country" onChange={(e) => onUpdateItem("education", entry.id, "location", e.target.value)} />
              <Field label="Date" value={entry.date} placeholder="Expected May 2028" onChange={(e) => onUpdateItem("education", entry.id, "date", e.target.value)} />
              <Field label="Grade / honors" value={entry.grade} placeholder="3.9 GPA · Summa Cum Laude" onChange={(e) => onUpdateItem("education", entry.id, "grade", e.target.value)} />
            </div>
            <TextAreaField label="Additional details" rows={3} value={entry.details} placeholder="Thesis title, scholarships, awards, relevant coursework, societies…" onChange={(e) => onUpdateItem("education", entry.id, "details", e.target.value)} />
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("education")}>+ Add education entry</button>
      </EditorBlock>
    ),

    researchInterests: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Research Interests"
        subtitle="Academic and professional research focus areas, shown as tags."
        visible={resume.visibility.researchInterests}
        onToggle={() => onToggleVisibility("researchInterests")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        <TextAreaField
          label="Topics (one per line)"
          rows={5}
          value={resume.researchInterests}
          placeholder={"Web security & vulnerability analysis\nPrivacy-preserving systems\nHuman-computer interaction"}
          onChange={(e) => onResearchInterestsChange(e.target.value)}
        />
      </EditorBlock>
    ),

    researchExperience: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Research Experience"
        subtitle="Lab positions, graduate research assistantships, and independent research."
        visible={resume.visibility.researchExperience}
        onToggle={() => onToggleVisibility("researchExperience")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.researchExperience?.map((entry, i) => (
          <EntryCard key={entry.id} title={entry.role || `Research Entry ${i + 1}`} subtitle={entry.lab} onRemove={() => onRemoveItem("researchExperience", entry.id)}>
            <div className="field-grid two-up">
              <Field label="Role" value={entry.role} placeholder="Graduate Research Assistant" onChange={e => onUpdateItem("researchExperience", entry.id, "role", e.target.value)} />
              <Field label="Lab / Research group" value={entry.lab} placeholder="Example Research Lab" onChange={e => onUpdateItem("researchExperience", entry.id, "lab", e.target.value)} />
              <Field label="Supervisor (optional)" value={entry.supervisor} placeholder="Prof. Example Name" onChange={e => onUpdateItem("researchExperience", entry.id, "supervisor", e.target.value)} />
              <Field label="Institution" value={entry.institution} placeholder="Example University" onChange={e => onUpdateItem("researchExperience", entry.id, "institution", e.target.value)} />
              <Field label="Location" value={entry.location} placeholder="Example City, Country" onChange={e => onUpdateItem("researchExperience", entry.id, "location", e.target.value)} />
              <Field label="Date" value={entry.date} placeholder="Jan 2024 – Present" onChange={e => onUpdateItem("researchExperience", entry.id, "date", e.target.value)} />
            </div>
            <TextAreaField label="Contributions & outcomes (one per line)" rows={4} value={entry.bullets} placeholder="Explored a sample research question and summarized the results..." onChange={e => onUpdateItem("researchExperience", entry.id, "bullets", e.target.value)} />
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("researchExperience")}>+ Add research position</button>
      </EditorBlock>
    ),

    teachingExperience: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Teaching Experience"
        subtitle="Courses taught, lab sections led, tutoring roles."
        visible={resume.visibility.teachingExperience}
        onToggle={() => onToggleVisibility("teachingExperience")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.teachingExperience?.map((entry, i) => (
          <EntryCard key={entry.id} title={entry.role || `Teaching Entry ${i + 1}`} subtitle={entry.course} onRemove={() => onRemoveItem("teachingExperience", entry.id)}>
            <div className="field-grid two-up">
              <Field label="Role" value={entry.role} placeholder="Teaching Assistant" onChange={e => onUpdateItem("teachingExperience", entry.id, "role", e.target.value)} />
              <Field label="Course name / code" value={entry.course} placeholder="CS 101 - Intro to Computing" onChange={e => onUpdateItem("teachingExperience", entry.id, "course", e.target.value)} />
              <Field label="Institution" value={entry.institution} placeholder="Example University" onChange={e => onUpdateItem("teachingExperience", entry.id, "institution", e.target.value)} />
              <Field label="Location" value={entry.location} placeholder="Example City, Country" onChange={e => onUpdateItem("teachingExperience", entry.id, "location", e.target.value)} />
              <Field label="Date" value={entry.date} placeholder="Aug 2023 – May 2024" onChange={e => onUpdateItem("teachingExperience", entry.id, "date", e.target.value)} />
            </div>
            <TextAreaField label="Responsibilities & achievements (one per line)" rows={4} value={entry.bullets} placeholder="Led weekly lab sections..." onChange={e => onUpdateItem("teachingExperience", entry.id, "bullets", e.target.value)} />
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("teachingExperience")}>+ Add teaching role</button>
      </EditorBlock>
    ),

    experience: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Professional Experience"
        subtitle="List roles in reverse chronological order. One accomplishment per line creates bullet points."
        visible={resume.visibility.experience}
        onToggle={() => onToggleVisibility("experience")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.experience.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.role || `Experience Entry ${i + 1}`}
            subtitle={entry.organization}
            onRemove={resume.experience.length > 1 ? () => onRemoveItem("experience", entry.id) : undefined}
          >
            <div className="field-grid two-up">
              <Field label="Role / title" value={entry.role} placeholder="Senior Research Engineer" onChange={(e) => onUpdateItem("experience", entry.id, "role", e.target.value)} />
              <Field label="Organization" value={entry.organization} placeholder="Acme Corporation" onChange={(e) => onUpdateItem("experience", entry.id, "organization", e.target.value)} />
              <Field label="Location" value={entry.location} placeholder="New York, NY or Remote" onChange={(e) => onUpdateItem("experience", entry.id, "location", e.target.value)} />
              <Field label="Date range" value={entry.date} placeholder="Jan 2022 – Present" onChange={(e) => onUpdateItem("experience", entry.id, "date", e.target.value)} />
            </div>
            <TextAreaField label="Accomplishments (one per line)" rows={5} value={entry.bullets} placeholder={"Led a cross-functional team of 8 engineers…\nReduced API latency by 42% through…\nLaunched product to 50,000 users in Q3 2023"} onChange={(e) => onUpdateItem("experience", entry.id, "bullets", e.target.value)} />
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("experience")}>+ Add experience entry</button>
      </EditorBlock>
    ),

    publications: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Publications"
        subtitle="Academic papers, conference proceedings, books, or reports."
        visible={resume.visibility.publications}
        onToggle={() => onToggleVisibility("publications")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.publications.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.citation ? entry.citation.slice(0, 60) + "…" : `Publication ${i + 1}`}
            onRemove={resume.publications.length > 1 ? () => onRemoveItem("publications", entry.id) : undefined}
          >
            <TextAreaField label="Full citation" rows={4} value={entry.citation} placeholder="Author, A. (Year). Article title. Journal Name, Vol(Issue), pages." onChange={(e) => onUpdateItem("publications", entry.id, "citation", e.target.value)} />
            <Field label="DOI or URL" value={entry.link} placeholder="https://doi.org/…" onChange={(e) => onUpdateItem("publications", entry.id, "link", e.target.value)} />
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("publications")}>+ Add publication</button>
      </EditorBlock>
    ),

    conferencePresentation: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Conference Presentations"
        subtitle="Oral presentations and poster sessions at academic conferences."
        visible={resume.visibility.conferencePresentation}
        onToggle={() => onToggleVisibility("conferencePresentation")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.conferencePresentation?.map((entry, i) => (
          <EntryCard key={entry.id} title={entry.title || `Presentation ${i + 1}`} subtitle={`${entry.type === 'poster' ? 'Poster' : 'Oral'} — ${entry.conference || ''}`} onRemove={() => onRemoveItem("conferencePresentation", entry.id)}>
            <div className="field-grid two-up">
              <Field label="Paper / talk title" value={entry.title} placeholder="Example Research Paper Title" onChange={e => onUpdateItem("conferencePresentation", entry.id, "title", e.target.value)} />
              <SelectField label="Type" value={entry.type} onChange={e => onUpdateItem("conferencePresentation", entry.id, "type", e.target.value)} options={["oral", "poster"]} />
              <Field label="Conference name" value={entry.conference} placeholder="Example Research Symposium" onChange={e => onUpdateItem("conferencePresentation", entry.id, "conference", e.target.value)} />
              <Field label="Location" value={entry.location} placeholder="Example City, Country" onChange={e => onUpdateItem("conferencePresentation", entry.id, "location", e.target.value)} />
              <Field label="Date" value={entry.date} placeholder="Nov 2024" onChange={e => onUpdateItem("conferencePresentation", entry.id, "date", e.target.value)} />
              <Field label="Co-authors" value={entry.coauthors} placeholder="A. Example, B. Sample" onChange={e => onUpdateItem("conferencePresentation", entry.id, "coauthors", e.target.value)} />
              <Field label="Link (optional)" value={entry.link} placeholder="https://dl.acm.org/..." onChange={e => onUpdateItem("conferencePresentation", entry.id, "link", e.target.value)} />
            </div>
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("conferencePresentation")}>+ Add presentation</button>
      </EditorBlock>
    ),

    invitedTalks: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Invited Talks & Keynotes"
        subtitle="Talks you were invited to deliver at other institutions or events."
        visible={resume.visibility.invitedTalks}
        onToggle={() => onToggleVisibility("invitedTalks")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.invitedTalks?.map((entry, i) => (
          <EntryCard key={entry.id} title={entry.title || `Talk ${i + 1}`} subtitle={entry.event} onRemove={() => onRemoveItem("invitedTalks", entry.id)}>
            <div className="field-grid two-up">
              <Field label="Talk title" value={entry.title} placeholder="Example Invited Talk Title" onChange={e => onUpdateItem("invitedTalks", entry.id, "title", e.target.value)} />
              <Field label="Event / seminar" value={entry.event} placeholder="Example Security Seminar" onChange={e => onUpdateItem("invitedTalks", entry.id, "event", e.target.value)} />
              <Field label="Host institution" value={entry.institution} placeholder="Example University" onChange={e => onUpdateItem("invitedTalks", entry.id, "institution", e.target.value)} />
              <Field label="Location" value={entry.location} placeholder="Example City, Country" onChange={e => onUpdateItem("invitedTalks", entry.id, "location", e.target.value)} />
              <Field label="Date" value={entry.date} placeholder="March 2025" onChange={e => onUpdateItem("invitedTalks", entry.id, "date", e.target.value)} />
              <Field label="Recording / slides link (optional)" value={entry.link} placeholder="https://youtube.com/..." onChange={e => onUpdateItem("invitedTalks", entry.id, "link", e.target.value)} />
            </div>
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("invitedTalks")}>+ Add invited talk</button>
      </EditorBlock>
    ),

    projects: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Projects"
        subtitle="Research prototypes, products, side projects, or portfolio work."
        visible={resume.visibility.projects}
        onToggle={() => onToggleVisibility("projects")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.projects.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.name || `Project ${i + 1}`}
            subtitle={entry.organization}
            onRemove={resume.projects.length > 1 ? () => onRemoveItem("projects", entry.id) : undefined}
          >
            <div className="field-grid two-up">
              <Field label="Project name" value={entry.name} placeholder="Example Project Name" onChange={(e) => onUpdateItem("projects", entry.id, "name", e.target.value)} />
              <Field label="Organization / client" value={entry.organization} placeholder="Example Lab, Company, or Personal Project" onChange={(e) => onUpdateItem("projects", entry.id, "organization", e.target.value)} />
              <Field label="Location" value={entry.location} placeholder="Remote" onChange={(e) => onUpdateItem("projects", entry.id, "location", e.target.value)} />
              <Field label="Date" value={entry.date} placeholder="2024 – Present" onChange={(e) => onUpdateItem("projects", entry.id, "date", e.target.value)} />
              <Field label="Link" value={entry.link} placeholder="https://github.com/…" onChange={(e) => onUpdateItem("projects", entry.id, "link", e.target.value)} />
            </div>
            <TextAreaField label="Summary (one line)" rows={2} value={entry.summary} placeholder="Brief description of the project purpose and scope." onChange={(e) => onUpdateItem("projects", entry.id, "summary", e.target.value)} />
            <TextAreaField label="Highlights (one per line)" rows={4} value={entry.bullets} placeholder={"What you built or discovered\nTechnologies and methods used\nImpact, users, or results"} onChange={(e) => onUpdateItem("projects", entry.id, "bullets", e.target.value)} />
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("projects")}>+ Add project</button>
      </EditorBlock>
    ),

    grantsAndFunding: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Grants & Funding"
        subtitle="Research grants, fellowships, and funding you have received or led."
        visible={resume.visibility.grantsAndFunding}
        onToggle={() => onToggleVisibility("grantsAndFunding")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.grantsAndFunding?.map((entry, i) => (
          <EntryCard key={entry.id} title={entry.title || `Grant ${i + 1}`} subtitle={entry.agency} onRemove={() => onRemoveItem("grantsAndFunding", entry.id)}>
            <div className="field-grid two-up">
              <Field label="Grant / fellowship title" value={entry.title} placeholder="Example Graduate Fellowship" onChange={e => onUpdateItem("grantsAndFunding", entry.id, "title", e.target.value)} />
              <Field label="Funding agency" value={entry.agency} placeholder="Example Funding Agency" onChange={e => onUpdateItem("grantsAndFunding", entry.id, "agency", e.target.value)} />
              <Field label="Your role" value={entry.role} placeholder="Graduate Fellow / PI / Co-PI" onChange={e => onUpdateItem("grantsAndFunding", entry.id, "role", e.target.value)} />
              <Field label="Amount" value={entry.amount} placeholder="$37,000 / year" onChange={e => onUpdateItem("grantsAndFunding", entry.id, "amount", e.target.value)} />
              <Field label="Period" value={entry.period} placeholder="2024 – 2027" onChange={e => onUpdateItem("grantsAndFunding", entry.id, "period", e.target.value)} />
              <SelectField label="Status" value={entry.status} onChange={e => onUpdateItem("grantsAndFunding", entry.id, "status", e.target.value)} options={["Active", "Completed", "Pending", "Under Review"]} />
            </div>
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("grantsAndFunding")}>+ Add grant or fellowship</button>
      </EditorBlock>
    ),

    technicalSkills: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Skills"
        subtitle="Group by area. Separate items with commas or new lines."
        visible={resume.visibility.technicalSkills}
        onToggle={() => onToggleVisibility("technicalSkills")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.skillGroups.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.name || `Skill Group ${i + 1}`}
            onRemove={resume.skillGroups.length > 1 ? () => onRemoveItem("skillGroups", entry.id) : undefined}
          >
            <div className="field-grid two-up">
              <Field label="Category name" value={entry.name} placeholder="Programming Languages" onChange={(e) => onUpdateItem("skillGroups", entry.id, "name", e.target.value)} />
            </div>
            <TextAreaField label="Skills" rows={3} value={entry.items} placeholder="Python, TypeScript, Go, SQL, Bash" onChange={(e) => onUpdateItem("skillGroups", entry.id, "items", e.target.value)} />
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("skillGroups")}>+ Add skill group</button>
      </EditorBlock>
    ),

    certifications: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Certifications & Licenses"
        subtitle="Professional certifications, board licenses, and industry credentials."
        visible={resume.visibility.certifications}
        onToggle={() => onToggleVisibility("certifications")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.certifications.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.name || `Certification ${i + 1}`}
            subtitle={entry.issuer}
            onRemove={resume.certifications.length > 1 ? () => onRemoveItem("certifications", entry.id) : undefined}
          >
            <div className="field-grid two-up">
              <Field label="Certification name" value={entry.name} placeholder="AWS Certified Solutions Architect" onChange={(e) => onUpdateItem("certifications", entry.id, "name", e.target.value)} />
              <Field label="Issuing organization" value={entry.issuer} placeholder="Amazon Web Services" onChange={(e) => onUpdateItem("certifications", entry.id, "issuer", e.target.value)} />
              <Field label="Date issued" value={entry.date} placeholder="Mar 2024" onChange={(e) => onUpdateItem("certifications", entry.id, "date", e.target.value)} />
              <Field label="Expiry date" value={entry.expiry} placeholder="Mar 2027 (leave blank if no expiry)" onChange={(e) => onUpdateItem("certifications", entry.id, "expiry", e.target.value)} />
              <Field label="Credential ID or URL" value={entry.credential} placeholder="ABC-12345 or https://…" onChange={(e) => onUpdateItem("certifications", entry.id, "credential", e.target.value)} />
            </div>
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("certifications")}>+ Add certification</button>
      </EditorBlock>
    ),

    awards: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Awards & Honors"
        subtitle="Scholarships, fellowships, prizes, and formal recognitions."
        visible={resume.visibility.awards}
        onToggle={() => onToggleVisibility("awards")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.awards.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.title || `Award ${i + 1}`}
            subtitle={entry.issuer}
            onRemove={resume.awards.length > 1 ? () => onRemoveItem("awards", entry.id) : undefined}
          >
            <div className="field-grid two-up">
              <Field label="Award / honor title" value={entry.title} placeholder="Example Award" onChange={(e) => onUpdateItem("awards", entry.id, "title", e.target.value)} />
              <Field label="Awarding body" value={entry.issuer} placeholder="Example Organization" onChange={(e) => onUpdateItem("awards", entry.id, "issuer", e.target.value)} />
              <Field label="Year / date" value={entry.date} placeholder="2024" onChange={(e) => onUpdateItem("awards", entry.id, "date", e.target.value)} />
            </div>
            <TextAreaField label="Description (optional)" rows={3} value={entry.description} placeholder="Brief context about the significance of this recognition." onChange={(e) => onUpdateItem("awards", entry.id, "description", e.target.value)} />
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("awards")}>+ Add award</button>
      </EditorBlock>
    ),

    leadership: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Leadership & Community"
        subtitle="Mentoring, volunteering, startups, student organizations, and outreach."
        visible={resume.visibility.leadership}
        onToggle={() => onToggleVisibility("leadership")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.leadership.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.title || `Entry ${i + 1}`}
            subtitle={entry.organization}
            onRemove={resume.leadership.length > 1 ? () => onRemoveItem("leadership", entry.id) : undefined}
          >
            <div className="field-grid two-up">
              <Field label="Role / title" value={entry.title} placeholder="Chapter President" onChange={(e) => onUpdateItem("leadership", entry.id, "title", e.target.value)} />
              <Field label="Organization" value={entry.organization} placeholder="Example Student Organization" onChange={(e) => onUpdateItem("leadership", entry.id, "organization", e.target.value)} />
              <Field label="Location" value={entry.location} placeholder="Campus / Remote" onChange={(e) => onUpdateItem("leadership", entry.id, "location", e.target.value)} />
              <Field label="Date range" value={entry.date} placeholder="2022 – Present" onChange={(e) => onUpdateItem("leadership", entry.id, "date", e.target.value)} />
              <Field label="Link" value={entry.link} placeholder="https://…" onChange={(e) => onUpdateItem("leadership", entry.id, "link", e.target.value)} />
            </div>
            <TextAreaField label="Highlights (one per line)" rows={4} value={entry.bullets} placeholder={"Led a team of 12 volunteers…\nOrganized events with 200+ attendees\nMentored 15 junior members"} onChange={(e) => onUpdateItem("leadership", entry.id, "bullets", e.target.value)} />
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("leadership")}>+ Add leadership entry</button>
      </EditorBlock>
    ),

    languages: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Languages"
        subtitle="Spoken and written language proficiencies."
        visible={resume.visibility.languages}
        onToggle={() => onToggleVisibility("languages")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.languages.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.language || `Language ${i + 1}`}
            subtitle={entry.proficiency}
            onRemove={resume.languages.length > 1 ? () => onRemoveItem("languages", entry.id) : undefined}
          >
            <div className="field-grid two-up">
              <Field label="Language" value={entry.language} placeholder="Spanish" onChange={(e) => onUpdateItem("languages", entry.id, "language", e.target.value)} />
              <SelectField label="Proficiency level" value={entry.proficiency} options={LANGUAGE_PROFICIENCY} onChange={(e) => onUpdateItem("languages", entry.id, "proficiency", e.target.value)} />
            </div>
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("languages")}>+ Add language</button>
      </EditorBlock>
    ),

    memberships: (key, index, total) => (
      <EditorBlock
        key={key}
        title="Professional Affiliations"
        subtitle="Memberships in professional societies, boards, and formal associations."
        visible={resume.visibility.memberships}
        onToggle={() => onToggleVisibility("memberships")}
        onMoveUp={index > 0 ? () => onMoveSection(key, "up") : undefined}
        onMoveDown={index < total - 1 ? () => onMoveSection(key, "down") : undefined}
      >
        {resume.memberships.map((entry, i) => (
          <EntryCard
            key={entry.id}
            title={entry.organization || `Membership ${i + 1}`}
            subtitle={entry.role}
            onRemove={resume.memberships.length > 1 ? () => onRemoveItem("memberships", entry.id) : undefined}
          >
            <div className="field-grid two-up">
              <Field label="Organization" value={entry.organization} placeholder="Example Computer Society" onChange={(e) => onUpdateItem("memberships", entry.id, "organization", e.target.value)} />
              <Field label="Role / status" value={entry.role} placeholder="Senior Member" onChange={(e) => onUpdateItem("memberships", entry.id, "role", e.target.value)} />
              <Field label="Date range" value={entry.date} placeholder="2022 – Present" onChange={(e) => onUpdateItem("memberships", entry.id, "date", e.target.value)} />
            </div>
          </EntryCard>
        ))}
        <button type="button" className="ghost-button add-button" onClick={() => onAddItem("memberships")}>+ Add membership</button>
      </EditorBlock>
    ),
  };

  return (
    <div className="editor-panel">

      {/* ── Hero Card ── */}
      <section className="hero-card">
        <div className="hero-card-main">
          <p className="eyebrow">Resume Builder</p>
          <h1>Build a polished, export-ready CV.</h1>
          <p className="hero-copy">
            Fill in the sections below, pick from {templates.length} professional templates, then
            hit <strong>Compile &amp; Preview</strong> to see your resume. Download as a designed
            PDF, a searchable PDF, an editable Word document, or a PNG image.
          </p>
          <div className="hero-actions">
            <button type="button" className="secondary-button" onClick={onLoadSample}>
              Load sample
            </button>
            <button type="button" className="ghost-button" onClick={onLoadBlank}>
              Start blank
            </button>
            <button
              type="button"
              className={`primary-button compile-btn-hero${compiling ? " is-compiling" : ""}`}
              onClick={onCompile}
              disabled={compiling}
            >
              {compiling ? (
                <><span className="compile-spinner" aria-hidden="true" />Compiling…</>
              ) : previewOpen ? (
                "✕ Close Preview"
              ) : (
                "⬡ Compile & Preview"
              )}
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{templates.length}</span>
            <span className="hero-stat-label">Templates</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">4</span>
            <span className="hero-stat-label">Export formats</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">17</span>
            <span className="hero-stat-label">CV sections</span>
          </div>
        </div>
      </section>

      {/* ── Template Gallery ── */}
      <EditorBlock
        title="Template Gallery"
        subtitle={`Pick a layout. All ${templates.length} templates share the same content and export cleanly to PDF.`}
      >
        <div className="template-grid">
          {templates.map((template) => {
            const active = resume.selectedTemplate === template.id;
            return (
              <button
                type="button"
                key={template.id}
                className={`template-tile ${active ? "is-active" : ""}`}
                style={{
                  "--tile-accent": template.palette.accent,
                  "--tile-paper": template.palette.paper,
                  "--tile-ink": template.palette.ink,
                }}
                onClick={() => onTemplateChange(template.id)}
              >
                <span className="template-preview-chip">{template.preview}</span>
                <strong>{template.name}</strong>
                <p>{template.tagline}</p>
              </button>
            );
          })}
        </div>
      </EditorBlock>

      {/* ── Identity & Links ── */}
      <EditorBlock
        title="Identity & Links"
        subtitle="Powers the header across every template. Only fill in what you want visible."
      >
        <div className="field-grid two-up">
          <Field label="Full name" value={resume.personal.fullName} placeholder="Alex Example" onChange={(e) => onPersonalChange("fullName", e.target.value)} />
          <Field label="Professional title / role" value={resume.personal.title} placeholder="Researcher / Developer" onChange={(e) => onPersonalChange("title", e.target.value)} />
          <Field label="Phone" value={resume.personal.phone} placeholder="+1 555 010 1234" onChange={(e) => onPersonalChange("phone", e.target.value)} />
          <Field label="Email" type="email" value={resume.personal.email} placeholder="alex@example.com" onChange={(e) => onPersonalChange("email", e.target.value)} />
          <Field label="Location" value={resume.personal.location} placeholder="Example City, Country" onChange={(e) => onPersonalChange("location", e.target.value)} />
          <Field label="Accent color" type="color" value={resume.personal.accentColor} onChange={(e) => onPersonalChange("accentColor", e.target.value)} />
        </div>

        {/* ── Font Selector ── */}
        <div className="font-selector-block">
          <span className="font-selector-label">Body font</span>
          <div className="font-option-grid">
            {FONT_OPTIONS.map((opt) => {
              const active = resume.personal.fontFamily === opt.value;
              return (
                <button
                  key={opt.value || "__default__"}
                  type="button"
                  className={`font-option-tile${active ? " is-active" : ""}`}
                  style={{ fontFamily: opt.value || "inherit" }}
                  title={opt.description}
                  onClick={() => onPersonalChange("fontFamily", opt.value)}
                >
                  <span className="font-option-preview">{opt.preview}</span>
                  <span className="font-option-name">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="field-grid two-up">
          <Field label="Website / portfolio" value={resume.personal.website} placeholder="https://example.com" onChange={(e) => onPersonalChange("website", e.target.value)} />
          <Field label="LinkedIn" value={resume.personal.linkedIn} placeholder="https://linkedin.com/in/alex-example" onChange={(e) => onPersonalChange("linkedIn", e.target.value)} />
          <Field label="GitHub" value={resume.personal.github} placeholder="https://github.com/alex-example" onChange={(e) => onPersonalChange("github", e.target.value)} />
          <Field label="Extra link" value={resume.personal.extraLink} placeholder="Portfolio, lab page, or ORCID" onChange={(e) => onPersonalChange("extraLink", e.target.value)} />
        </div>
      </EditorBlock>

      {/* ── Personal Statement (static, always before orderable sections) ── */}
      <EditorBlock
        title="Personal Statement / Objective"
        subtitle="A 2–4 sentence summary of who you are and what you bring. Optional but powerful."
      >
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={resume.statement.enabled}
            onChange={(e) => onStatementChange("enabled", e.target.checked)}
          />
          <span>Include statement at the top of the resume</span>
        </label>
        <div className="field-grid two-up">
          <Field label="Section heading" value={resume.statement.label} placeholder="Personal Statement" onChange={(e) => onStatementChange("label", e.target.value)} />
        </div>
        <TextAreaField
          label="Statement text"
          rows={5}
          value={resume.statement.content}
          placeholder="Write 2–4 sentences that frame your profile, focus, and unique value. Tailor to the role you're applying for."
          onChange={(e) => onStatementChange("content", e.target.value)}
        />
      </EditorBlock>

      {/* ── Orderable Sections ── */}
      {sectionOrder
        .filter(key => key !== "statement") // statement is handled statically above
        .map((key, index, filteredOrder) => {
          const renderer = sectionEditorMap[key];
          return renderer ? renderer(key, index, filteredOrder.length) : null;
        })
      }

      {/* ── Custom Theme (Advanced) — always at bottom, not reorderable ── */}
      <EditorBlock
        title="Custom Theme (Advanced)"
        subtitle="Define your own template by pasting a JSON configuration. See the placeholder for the schema."
      >
        <div className="custom-theme-editor">
          <div className="custom-theme-controls">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={resume.selectedTemplate === "custom"}
                onChange={(e) => {
                  if (e.target.checked) onTemplateChange("custom");
                  else onTemplateChange("scholar");
                }}
              />
              <span>Use custom theme (override selected template)</span>
            </label>
          </div>
          <TextAreaField
            label="Theme JSON"
            rows={18}
            value={resume.customThemeJson ?? DEFAULT_CUSTOM_THEME_JSON}
            onChange={(e) => onCustomThemeChange(e.target.value)}
            placeholder={DEFAULT_CUSTOM_THEME_JSON}
          />
          <p className="custom-theme-hint">
            Schema: palette (accent/ink/paper/muted hex), font (CSS font-family string),
            layout ("single" | "two-column" | "sidebar-left"),
            headerStyle ("split" | "centered" | "left"),
            sectionStyle ("line" | "box" | "underline" | "plain"),
            spacing ("compact" | "normal" | "spacious")
          </p>
        </div>
      </EditorBlock>

    </div>
  );
}
