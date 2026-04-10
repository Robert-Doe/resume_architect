import { DEFAULT_SECTION_ORDER } from "../data/resumeModel";

// ─── Utilities ────────────────────────────────────────────────────────────────

const splitLines = (value) =>
  String(value || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const splitSkills = (value) =>
  String(value || "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

const normalizeUrl = (value) => {
  if (!value) return "";
  if (/^(mailto:|tel:|https?:\/\/)/i.test(value)) return value;
  return `https://${value}`;
};

const compactUrl = (value) =>
  String(value || "")
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");

// ─── Shared Primitives ────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <section className="resume-section">
      <div className="resume-section-head">
        <h3>{title}</h3>
      </div>
      <div className="resume-section-body">{children}</div>
    </section>
  );
}

function ContactList({ personal, stacked = false }) {
  const contacts = [
    personal.phone ? { label: personal.phone, href: `tel:${String(personal.phone).replace(/\s+/g, "")}` } : null,
    personal.email ? { label: personal.email, href: `mailto:${personal.email}` } : null,
    personal.location ? { label: personal.location } : null,
    personal.website ? { label: compactUrl(personal.website), href: normalizeUrl(personal.website) } : null,
    personal.linkedIn ? { label: compactUrl(personal.linkedIn), href: normalizeUrl(personal.linkedIn) } : null,
    personal.github ? { label: compactUrl(personal.github), href: normalizeUrl(personal.github) } : null,
    personal.extraLink ? { label: compactUrl(personal.extraLink), href: normalizeUrl(personal.extraLink) } : null,
  ].filter(Boolean);

  return (
    <div className={`contact-list ${stacked ? "is-stacked" : ""}`}>
      {contacts.map((contact) =>
        contact.href ? (
          <a key={`${contact.label}-${contact.href}`} href={contact.href} target="_blank" rel="noreferrer">
            {contact.label}
          </a>
        ) : (
          <span key={contact.label}>{contact.label}</span>
        ),
      )}
    </div>
  );
}

function BulletList({ value }) {
  const items = Array.isArray(value) ? value : splitLines(value);
  if (!items.length) return null;
  return (
    <ul className="bullet-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function ResumeEntry({ title, subtitle, location, date, summary, bullets, link }) {
  const hasMeta = location || date;
  return (
    <article className="resume-entry">
      <header className="resume-entry-head">
        <div className="resume-entry-title-group">
          <h4>{title}</h4>
          {subtitle ? <p className="resume-entry-subtitle">{subtitle}</p> : null}
        </div>
        {hasMeta ? (
          <p className="resume-entry-meta">{[location, date].filter(Boolean).join(" · ")}</p>
        ) : null}
      </header>
      {summary ? <p className="resume-entry-summary">{summary}</p> : null}
      {link ? (
        <p className="resume-entry-link">
          <a href={normalizeUrl(link)} target="_blank" rel="noreferrer">
            {compactUrl(link)}
          </a>
        </p>
      ) : null}
      <BulletList value={bullets} />
    </article>
  );
}

// ─── Shared Section Components ────────────────────────────────────────────────

function StatementSection({ resume }) {
  if (!resume.statement.enabled || !resume.statement.content?.trim()) return null;
  return (
    <Section title={resume.statement.label || "Personal Statement"}>
      <p className="statement-copy">{resume.statement.content}</p>
    </Section>
  );
}

function EducationSection({ resume }) {
  if (!resume.visibility.education || !resume.education.length) return null;
  return (
    <Section title="Education">
      {resume.education.map((entry) => (
        <article className="resume-entry education-entry" key={entry.id}>
          <header className="resume-entry-head">
            <div className="resume-entry-title-group">
              <h4>{entry.degree}</h4>
              <p className="resume-entry-subtitle">{entry.institution}</p>
            </div>
            <p className="resume-entry-meta">{[entry.location, entry.date].filter(Boolean).join(" · ")}</p>
          </header>
          {entry.grade ? <p className="resume-entry-summary">Grade / Honors: {entry.grade}</p> : null}
          {entry.details ? <p className="resume-entry-summary">{entry.details}</p> : null}
        </article>
      ))}
    </Section>
  );
}

function ResearchSection({ resume }) {
  const items = splitLines(resume.researchInterests);
  if (!resume.visibility.researchInterests || !items.length) return null;
  return (
    <Section title="Research Interests">
      <div className="tag-cloud">
        {items.map((item) => (
          <span key={item} className="interest-tag">{item}</span>
        ))}
      </div>
    </Section>
  );
}

/** Plain variant — no pill badges, renders as a simple dot-separated list */
function ResearchSectionPlain({ resume }) {
  const items = splitLines(resume.researchInterests);
  if (!resume.visibility.researchInterests || !items.length) return null;
  return (
    <Section title="Research Interests">
      <p className="research-plain-list">
        {items.join(" · ")}
      </p>
    </Section>
  );
}

function SkillsSection({ resume }) {
  const groups = resume.skillGroups.filter((g) => g.name || g.items);
  if (!resume.visibility.technicalSkills || !groups.length) return null;
  return (
    <Section title="Skills">
      <div className="skill-groups">
        {groups.map((group) => {
          const items = splitSkills(group.items);
          return (
            <article className="skill-group" key={group.id}>
              <h4>{group.name}</h4>
              <p>{items.join(" · ")}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function ExperienceSection({ resume }) {
  const items = resume.experience.filter((e) => e.role || e.organization);
  if (!resume.visibility.experience || !items.length) return null;
  return (
    <Section title="Professional Experience">
      {items.map((entry) => (
        <ResumeEntry
          key={entry.id}
          title={entry.role}
          subtitle={entry.organization}
          location={entry.location}
          date={entry.date}
          bullets={entry.bullets}
        />
      ))}
    </Section>
  );
}

function PublicationsSection({ resume }) {
  const items = resume.publications.filter((e) => e.citation);
  if (!resume.visibility.publications || !items.length) return null;
  return (
    <Section title="Publications">
      <ol className="publication-list">
        {items.map((entry) => (
          <li key={entry.id}>
            <span>{entry.citation}</span>
            {entry.link ? (
              <a href={normalizeUrl(entry.link)} target="_blank" rel="noreferrer">
                {compactUrl(entry.link)}
              </a>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}

function ProjectsSection({ resume }) {
  const items = resume.projects.filter((e) => e.name || e.organization);
  if (!resume.visibility.projects || !items.length) return null;
  return (
    <Section title="Projects">
      {items.map((entry) => (
        <ResumeEntry
          key={entry.id}
          title={entry.name}
          subtitle={entry.organization}
          location={entry.location}
          date={entry.date}
          summary={entry.summary}
          bullets={entry.bullets}
          link={entry.link}
        />
      ))}
    </Section>
  );
}

function LeadershipSection({ resume }) {
  const items = resume.leadership.filter((e) => e.title || e.organization);
  if (!resume.visibility.leadership || !items.length) return null;
  return (
    <Section title="Leadership & Community">
      {items.map((entry) => (
        <ResumeEntry
          key={entry.id}
          title={entry.title}
          subtitle={entry.organization}
          location={entry.location}
          date={entry.date}
          bullets={entry.bullets}
          link={entry.link}
        />
      ))}
    </Section>
  );
}

function CertificationsSection({ resume }) {
  const items = (resume.certifications ?? []).filter((e) => e.name || e.issuer);
  if (!resume.visibility.certifications || !items.length) return null;
  return (
    <Section title="Certifications & Licenses">
      {items.map((entry) => (
        <article className="resume-entry" key={entry.id}>
          <header className="resume-entry-head">
            <div className="resume-entry-title-group">
              <h4>{entry.name}</h4>
              {entry.issuer ? <p className="resume-entry-subtitle">{entry.issuer}</p> : null}
            </div>
            <p className="resume-entry-meta">
              {[entry.date, entry.expiry ? `Exp. ${entry.expiry}` : null].filter(Boolean).join(" · ")}
            </p>
          </header>
          {entry.credential ? (
            <p className="resume-entry-summary">
              Credential ID:{" "}
              {/^https?:\/\//i.test(entry.credential) ? (
                <a href={entry.credential} target="_blank" rel="noreferrer">{compactUrl(entry.credential)}</a>
              ) : (
                entry.credential
              )}
            </p>
          ) : null}
        </article>
      ))}
    </Section>
  );
}

function AwardsSection({ resume }) {
  const items = (resume.awards ?? []).filter((e) => e.title || e.issuer);
  if (!resume.visibility.awards || !items.length) return null;
  return (
    <Section title="Awards & Honors">
      {items.map((entry) => (
        <article className="resume-entry" key={entry.id}>
          <header className="resume-entry-head">
            <div className="resume-entry-title-group">
              <h4>{entry.title}</h4>
              {entry.issuer ? <p className="resume-entry-subtitle">{entry.issuer}</p> : null}
            </div>
            {entry.date ? <p className="resume-entry-meta">{entry.date}</p> : null}
          </header>
          {entry.description ? <p className="resume-entry-summary">{entry.description}</p> : null}
        </article>
      ))}
    </Section>
  );
}

function LanguagesSection({ resume }) {
  const items = (resume.languages ?? []).filter((e) => e.language);
  if (!resume.visibility.languages || !items.length) return null;
  return (
    <Section title="Languages">
      <div className="language-list">
        {items.map((entry) => (
          <div className="language-item" key={entry.id}>
            <span className="language-name">{entry.language}</span>
            {entry.proficiency ? (
              <span className="language-badge">{entry.proficiency}</span>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}

function MembershipsSection({ resume }) {
  const items = (resume.memberships ?? []).filter((e) => e.organization);
  if (!resume.visibility.memberships || !items.length) return null;
  return (
    <Section title="Professional Affiliations">
      {items.map((entry) => (
        <article className="resume-entry" key={entry.id}>
          <header className="resume-entry-head">
            <div className="resume-entry-title-group">
              <h4>{entry.organization}</h4>
              {entry.role ? <p className="resume-entry-subtitle">{entry.role}</p> : null}
            </div>
            {entry.date ? <p className="resume-entry-meta">{entry.date}</p> : null}
          </header>
        </article>
      ))}
    </Section>
  );
}

// ─── New Academic Section Components ─────────────────────────────────────────

function TeachingSection({ resume }) {
  const items = (resume.teachingExperience ?? []).filter(e => e.role || e.course);
  if (!resume.visibility.teachingExperience || !items.length) return null;
  return (
    <Section title="Teaching Experience">
      {items.map(entry => (
        <ResumeEntry
          key={entry.id}
          title={entry.role}
          subtitle={`${entry.course}${entry.institution ? ` — ${entry.institution}` : ''}`}
          location={entry.location}
          date={entry.date}
          bullets={entry.bullets}
        />
      ))}
    </Section>
  );
}

function ResearchExpSection({ resume }) {
  const items = (resume.researchExperience ?? []).filter(e => e.role || e.lab);
  if (!resume.visibility.researchExperience || !items.length) return null;
  return (
    <Section title="Research Experience">
      {items.map(entry => (
        <article className="resume-entry" key={entry.id}>
          <header className="resume-entry-head">
            <div className="resume-entry-title-group">
              <h4>{entry.role}</h4>
              {entry.lab && <p className="resume-entry-subtitle">{entry.lab}</p>}
              {entry.supervisor && <p className="resume-entry-summary">Supervisor: {entry.supervisor}</p>}
            </div>
            <p className="resume-entry-meta">
              {[entry.location, entry.date].filter(Boolean).join(' · ')}
            </p>
          </header>
          {entry.institution && <p className="resume-entry-summary">{entry.institution}</p>}
          <BulletList value={entry.bullets} />
        </article>
      ))}
    </Section>
  );
}

function ConferencePresentationSection({ resume }) {
  const items = (resume.conferencePresentation ?? []).filter(e => e.title || e.conference);
  if (!resume.visibility.conferencePresentation || !items.length) return null;
  const oral = items.filter(e => e.type !== 'poster');
  const poster = items.filter(e => e.type === 'poster');
  return (
    <Section title="Conference Presentations">
      {oral.length > 0 && (
        <div className="conf-subsection">
          <p className="conf-type-label">Oral Presentations</p>
          <ol className="conf-list">
            {oral.map(e => (
              <li key={e.id}>
                <span className="conf-title">"{e.title}"</span>
                {e.coauthors && <span className="conf-authors"> — {e.coauthors}</span>}
                {(e.conference || e.date || e.location) && (
                  <span className="conf-meta">
                    {' '}{[e.conference, e.location, e.date].filter(Boolean).join(', ')}.
                  </span>
                )}
                {e.link && <a href={normalizeUrl(e.link)} className="conf-link" target="_blank" rel="noreferrer">{compactUrl(e.link)}</a>}
              </li>
            ))}
          </ol>
        </div>
      )}
      {poster.length > 0 && (
        <div className="conf-subsection">
          <p className="conf-type-label">Posters</p>
          <ol className="conf-list">
            {poster.map(e => (
              <li key={e.id}>
                <span className="conf-title">"{e.title}"</span>
                {e.coauthors && <span className="conf-authors"> — {e.coauthors}</span>}
                {(e.conference || e.date || e.location) && (
                  <span className="conf-meta">
                    {' '}{[e.conference, e.location, e.date].filter(Boolean).join(', ')}.
                  </span>
                )}
                {e.link && <a href={normalizeUrl(e.link)} className="conf-link" target="_blank" rel="noreferrer">{compactUrl(e.link)}</a>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </Section>
  );
}

function InvitedTalksSection({ resume }) {
  const items = (resume.invitedTalks ?? []).filter(e => e.title || e.event);
  if (!resume.visibility.invitedTalks || !items.length) return null;
  return (
    <Section title="Invited Talks & Keynotes">
      {items.map(e => (
        <article className="resume-entry" key={e.id}>
          <header className="resume-entry-head">
            <div className="resume-entry-title-group">
              <h4>"{e.title}"</h4>
              {(e.event || e.institution) && (
                <p className="resume-entry-subtitle">
                  {[e.event, e.institution].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <p className="resume-entry-meta">
              {[e.location, e.date].filter(Boolean).join(' · ')}
            </p>
          </header>
          {e.link && (
            <p className="resume-entry-link">
              <a href={normalizeUrl(e.link)} target="_blank" rel="noreferrer">{compactUrl(e.link)}</a>
            </p>
          )}
        </article>
      ))}
    </Section>
  );
}

function GrantsSection({ resume }) {
  const items = (resume.grantsAndFunding ?? []).filter(e => e.title || e.agency);
  if (!resume.visibility.grantsAndFunding || !items.length) return null;
  return (
    <Section title="Grants & Funding">
      {items.map(e => (
        <article className="resume-entry" key={e.id}>
          <header className="resume-entry-head">
            <div className="resume-entry-title-group">
              <h4>{e.title}</h4>
              {e.agency && <p className="resume-entry-subtitle">{e.agency}</p>}
            </div>
            <p className="resume-entry-meta">{e.period}</p>
          </header>
          {(e.role || e.amount || e.status) && (
            <p className="resume-entry-summary">
              {[e.role, e.amount, e.status ? `Status: ${e.status}` : ""].filter(Boolean).join("  ·  ")}
            </p>
          )}
        </article>
      ))}
    </Section>
  );
}

// ─── SECTION_MAP — used by GradStudentLayout, CustomLayout, and sectionOrder rendering ──

const SECTION_MAP = {
  statement: (r) => <StatementSection resume={r} />,
  education: (r) => <EducationSection resume={r} />,
  researchInterests: (r) => <ResearchSection resume={r} />,
  researchExperience: (r) => <ResearchExpSection resume={r} />,
  teachingExperience: (r) => <TeachingSection resume={r} />,
  experience: (r) => <ExperienceSection resume={r} />,
  publications: (r) => <PublicationsSection resume={r} />,
  conferencePresentation: (r) => <ConferencePresentationSection resume={r} />,
  invitedTalks: (r) => <InvitedTalksSection resume={r} />,
  projects: (r) => <ProjectsSection resume={r} />,
  grantsAndFunding: (r) => <GrantsSection resume={r} />,
  technicalSkills: (r) => <SkillsSection resume={r} />,
  certifications: (r) => <CertificationsSection resume={r} />,
  awards: (r) => <AwardsSection resume={r} />,
  leadership: (r) => <LeadershipSection resume={r} />,
  languages: (r) => <LanguagesSection resume={r} />,
  memberships: (r) => <MembershipsSection resume={r} />,
};

function renderSectionOrder(resume, order) {
  return order.map(key => {
    const renderer = SECTION_MAP[key];
    return renderer ? <>{renderer(resume)}</> : null;
  });
}

// ─── Template Layouts ─────────────────────────────────────────────────────────

/** Grad Student — refined academic CV, sectionOrder-driven */
function GradStudentLayout({ resume }) {
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return (
    <>
      <header className="resume-header grad-header">
        <div className="grad-header-name">
          <h1>{resume.personal.fullName}</h1>
          <p className="resume-kicker">{resume.personal.title}</p>
        </div>
        <ContactList personal={resume.personal} />
      </header>
      <div className="resume-flow">
        {order.map(key => {
          const renderer = SECTION_MAP[key];
          return renderer ? <React.Fragment key={key}>{renderer(resume)}</React.Fragment> : null;
        })}
      </div>
    </>
  );
}

/** Scholar Classic — single column, serif, academic */
function ScholarLayout({ resume }) {
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return (
    <>
      <header className="resume-header scholar-header">
        <div>
          <p className="resume-kicker">{resume.personal.title}</p>
          <h1>{resume.personal.fullName}</h1>
        </div>
        <ContactList personal={resume.personal} />
      </header>
      <div className="resume-flow">
        {order.map(key => {
          const renderer = SECTION_MAP[key];
          // scholar uses plain research interests variant
          if (key === "researchInterests") return <React.Fragment key={key}><ResearchSection resume={resume} /></React.Fragment>;
          return renderer ? <React.Fragment key={key}>{renderer(resume)}</React.Fragment> : null;
        })}
      </div>
    </>
  );
}

/** Scholar Plain — same as Scholar Classic but research interests are a plain text list */
function ScholarPlainLayout({ resume }) {
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return (
    <>
      <header className="resume-header scholar-header">
        <div>
          <p className="resume-kicker">{resume.personal.title}</p>
          <h1>{resume.personal.fullName}</h1>
        </div>
        <ContactList personal={resume.personal} />
      </header>
      <div className="resume-flow">
        {order.map(key => {
          const renderer = SECTION_MAP[key];
          if (key === "researchInterests") return <React.Fragment key={key}><ResearchSectionPlain resume={resume} /></React.Fragment>;
          return renderer ? <React.Fragment key={key}>{renderer(resume)}</React.Fragment> : null;
        })}
      </div>
    </>
  );
}

/** Executive Slate — two-column grid, dark header */
function ExecutiveLayout({ resume }) {
  return (
    <>
      <header className="resume-header executive-header">
        <div>
          <p className="resume-kicker">{resume.personal.title}</p>
          <h1>{resume.personal.fullName}</h1>
        </div>
        <ContactList personal={resume.personal} />
      </header>
      <div className="resume-grid executive-grid">
        <div className="resume-column aside-column">
          <StatementSection resume={resume} />
          <ResearchSection resume={resume} />
          <SkillsSection resume={resume} />
          <CertificationsSection resume={resume} />
          <AwardsSection resume={resume} />
          <LanguagesSection resume={resume} />
          <MembershipsSection resume={resume} />
          <PublicationsSection resume={resume} />
          <GrantsSection resume={resume} />
          <ConferencePresentationSection resume={resume} />
          <InvitedTalksSection resume={resume} />
        </div>
        <div className="resume-column main-column">
          <ExperienceSection resume={resume} />
          <ResearchExpSection resume={resume} />
          <TeachingSection resume={resume} />
          <ProjectsSection resume={resume} />
          <EducationSection resume={resume} />
          <LeadershipSection resume={resume} />
        </div>
      </div>
    </>
  );
}

/** Metro Sidebar — dark sidebar, modern tech */
function MetroLayout({ resume }) {
  return (
    <div className="metro-shell">
      <aside className="metro-sidebar">
        <p className="resume-kicker">{resume.personal.title}</p>
        <h1>{resume.personal.fullName}</h1>
        <ContactList personal={resume.personal} stacked />
        <StatementSection resume={resume} />
        <ResearchSection resume={resume} />
        <SkillsSection resume={resume} />
        <CertificationsSection resume={resume} />
        <LanguagesSection resume={resume} />
        <AwardsSection resume={resume} />
        <MembershipsSection resume={resume} />
        <GrantsSection resume={resume} />
      </aside>
      <main className="metro-main">
        <ExperienceSection resume={resume} />
        <ResearchExpSection resume={resume} />
        <TeachingSection resume={resume} />
        <EducationSection resume={resume} />
        <ProjectsSection resume={resume} />
        <PublicationsSection resume={resume} />
        <ConferencePresentationSection resume={resume} />
        <InvitedTalksSection resume={resume} />
        <LeadershipSection resume={resume} />
      </main>
    </div>
  );
}

/** Studio Canvas — editorial two-column, creative */
function StudioLayout({ resume }) {
  return (
    <>
      <header className="resume-header studio-header">
        <div className="studio-title">
          <p className="resume-kicker">{resume.personal.title}</p>
          <h1>{resume.personal.fullName}</h1>
        </div>
        <ContactList personal={resume.personal} />
      </header>
      <div className="resume-grid studio-grid">
        <div className="resume-column">
          <StatementSection resume={resume} />
          <EducationSection resume={resume} />
          <ResearchSection resume={resume} />
          <SkillsSection resume={resume} />
          <LanguagesSection resume={resume} />
          <MembershipsSection resume={resume} />
          <GrantsSection resume={resume} />
        </div>
        <div className="resume-column">
          <ExperienceSection resume={resume} />
          <ResearchExpSection resume={resume} />
          <TeachingSection resume={resume} />
          <ProjectsSection resume={resume} />
          <CertificationsSection resume={resume} />
          <AwardsSection resume={resume} />
          <PublicationsSection resume={resume} />
          <ConferencePresentationSection resume={resume} />
          <InvitedTalksSection resume={resume} />
          <LeadershipSection resume={resume} />
        </div>
      </div>
    </>
  );
}

/** Apex Pro — flat corporate, single column, ATS-safe */
function ApexLayout({ resume }) {
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return (
    <>
      <header className="resume-header apex-header">
        <div className="apex-name-block">
          <h1>{resume.personal.fullName}</h1>
          <p className="resume-kicker">{resume.personal.title}</p>
        </div>
        <ContactList personal={resume.personal} />
      </header>
      <div className="resume-flow apex-body">
        {order.map(key => {
          const renderer = SECTION_MAP[key];
          return renderer ? <React.Fragment key={key}>{renderer(resume)}</React.Fragment> : null;
        })}
      </div>
    </>
  );
}

/** Counsel — traditional formal, serif, legal/finance/consulting */
function CounselLayout({ resume }) {
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return (
    <>
      <header className="counsel-header">
        <h1>{resume.personal.fullName}</h1>
        <p className="resume-kicker">{resume.personal.title}</p>
        <ContactList personal={resume.personal} />
      </header>
      <div className="resume-flow">
        {order.map(key => {
          const renderer = SECTION_MAP[key];
          return renderer ? <React.Fragment key={key}>{renderer(resume)}</React.Fragment> : null;
        })}
      </div>
    </>
  );
}

/** Clinician — structured two-column, healthcare / scientific */
function ClinicianLayout({ resume }) {
  return (
    <>
      <header className="resume-header clinician-header">
        <div>
          <h1>{resume.personal.fullName}</h1>
          <p className="resume-kicker">{resume.personal.title}</p>
        </div>
        <ContactList personal={resume.personal} />
      </header>
      <div className="clinician-body">
        <aside className="clinician-aside">
          <StatementSection resume={resume} />
          <SkillsSection resume={resume} />
          <CertificationsSection resume={resume} />
          <LanguagesSection resume={resume} />
          <AwardsSection resume={resume} />
          <MembershipsSection resume={resume} />
          <ResearchSection resume={resume} />
          <GrantsSection resume={resume} />
        </aside>
        <main className="clinician-main">
          <ExperienceSection resume={resume} />
          <ResearchExpSection resume={resume} />
          <TeachingSection resume={resume} />
          <EducationSection resume={resume} />
          <ProjectsSection resume={resume} />
          <PublicationsSection resume={resume} />
          <ConferencePresentationSection resume={resume} />
          <InvitedTalksSection resume={resume} />
          <LeadershipSection resume={resume} />
        </main>
      </div>
    </>
  );
}

/** Prestige — dark header, gold accents, senior executive / board */
function PrestigeLayout({ resume }) {
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return (
    <>
      <header className="resume-header prestige-header">
        <div>
          <p className="resume-kicker">{resume.personal.title}</p>
          <h1>{resume.personal.fullName}</h1>
        </div>
        <ContactList personal={resume.personal} />
      </header>
      <div className="resume-flow prestige-body">
        {order.map(key => {
          const renderer = SECTION_MAP[key];
          return renderer ? <React.Fragment key={key}>{renderer(resume)}</React.Fragment> : null;
        })}
      </div>
    </>
  );
}

/** Diplomat — centered header, two-column body, European / international */
function DiplomatLayout({ resume }) {
  return (
    <>
      <header className="diplomat-header">
        <h1>{resume.personal.fullName}</h1>
        <p className="resume-kicker">{resume.personal.title}</p>
        <ContactList personal={resume.personal} />
      </header>
      <div className="diplomat-body">
        <div className="resume-column">
          <StatementSection resume={resume} />
          <EducationSection resume={resume} />
          <SkillsSection resume={resume} />
          <LanguagesSection resume={resume} />
          <MembershipsSection resume={resume} />
          <AwardsSection resume={resume} />
          <ResearchSection resume={resume} />
          <GrantsSection resume={resume} />
        </div>
        <div className="resume-column">
          <ExperienceSection resume={resume} />
          <ResearchExpSection resume={resume} />
          <TeachingSection resume={resume} />
          <ProjectsSection resume={resume} />
          <PublicationsSection resume={resume} />
          <ConferencePresentationSection resume={resume} />
          <InvitedTalksSection resume={resume} />
          <CertificationsSection resume={resume} />
          <LeadershipSection resume={resume} />
        </div>
      </div>
    </>
  );
}

/** Federal — government-style, hierarchical, very formal */
function FederalLayout({ resume }) {
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return (
    <>
      <header className="federal-header">
        <h1>{resume.personal.fullName}</h1>
        <p className="resume-kicker">{resume.personal.title}</p>
        <ContactList personal={resume.personal} />
      </header>
      <div className="resume-flow federal-body">
        {order.map(key => {
          const renderer = SECTION_MAP[key];
          return renderer ? <React.Fragment key={key}>{renderer(resume)}</React.Fragment> : null;
        })}
      </div>
    </>
  );
}

// ─── Custom Theme Layout ──────────────────────────────────────────────────────

function parseCustomTheme(json) {
  try {
    return JSON.parse(json || "{}");
  } catch {
    return {};
  }
}

function CustomLayout({ resume }) {
  const theme = parseCustomTheme(resume.customThemeJson);
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const layout = theme.layout ?? "single";
  const headerStyle = theme.headerStyle ?? "split";
  const sectionStyle = theme.sectionStyle ?? "line";
  const spacing = theme.spacing ?? "normal";

  const headerClass = `custom-header custom-header--${headerStyle}`;
  const bodyClass = `custom-body custom-body--${layout} custom-spacing--${spacing}`;
  const sheetExtra = `custom-section-style--${sectionStyle}`;

  if (layout === "two-column") {
    const half = Math.ceil(order.length / 2);
    const leftKeys = order.slice(0, half);
    const rightKeys = order.slice(half);
    return (
      <div className={sheetExtra}>
        <header className={headerClass}>
          <div className="custom-header-name">
            <h1>{resume.personal.fullName}</h1>
            {resume.personal.title && <p className="resume-kicker">{resume.personal.title}</p>}
          </div>
          <ContactList personal={resume.personal} />
        </header>
        <div className={bodyClass}>
          <div className="custom-col">
            {leftKeys.map(key => { const r = SECTION_MAP[key]; return r ? <React.Fragment key={key}>{r(resume)}</React.Fragment> : null; })}
          </div>
          <div className="custom-col">
            {rightKeys.map(key => { const r = SECTION_MAP[key]; return r ? <React.Fragment key={key}>{r(resume)}</React.Fragment> : null; })}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "sidebar-left") {
    const sidebarKeys = order.filter((_, i) => i % 3 === 0);
    const mainKeys = order.filter((_, i) => i % 3 !== 0);
    return (
      <div className={sheetExtra}>
        <header className={headerClass}>
          <div className="custom-header-name">
            <h1>{resume.personal.fullName}</h1>
            {resume.personal.title && <p className="resume-kicker">{resume.personal.title}</p>}
          </div>
          <ContactList personal={resume.personal} />
        </header>
        <div className={bodyClass}>
          <aside className="custom-sidebar">
            {sidebarKeys.map(key => { const r = SECTION_MAP[key]; return r ? <React.Fragment key={key}>{r(resume)}</React.Fragment> : null; })}
          </aside>
          <main className="custom-main">
            {mainKeys.map(key => { const r = SECTION_MAP[key]; return r ? <React.Fragment key={key}>{r(resume)}</React.Fragment> : null; })}
          </main>
        </div>
      </div>
    );
  }

  // Single column (default)
  return (
    <div className={sheetExtra}>
      <header className={headerClass}>
        {headerStyle === "centered" ? (
          <div className="custom-header-centered">
            <h1>{resume.personal.fullName}</h1>
            {resume.personal.title && <p className="resume-kicker">{resume.personal.title}</p>}
            <ContactList personal={resume.personal} />
          </div>
        ) : (
          <>
            <div className="custom-header-name">
              <h1>{resume.personal.fullName}</h1>
              {resume.personal.title && <p className="resume-kicker">{resume.personal.title}</p>}
            </div>
            <ContactList personal={resume.personal} />
          </>
        )}
      </header>
      <div className={bodyClass}>
        {order.map(key => {
          const renderer = SECTION_MAP[key];
          return renderer ? <React.Fragment key={key}>{renderer(resume)}</React.Fragment> : null;
        })}
      </div>
    </div>
  );
}

// ─── Template Registry ────────────────────────────────────────────────────────

const LAYOUTS = {
  "grad-student": GradStudentLayout,
  scholar: ScholarLayout,
  "scholar-plain": ScholarPlainLayout,
  executive: ExecutiveLayout,
  metro: MetroLayout,
  studio: StudioLayout,
  apex: ApexLayout,
  counsel: CounselLayout,
  clinician: ClinicianLayout,
  prestige: PrestigeLayout,
  diplomat: DiplomatLayout,
  federal: FederalLayout,
  custom: CustomLayout,
};

// ─── Color Utilities ──────────────────────────────────────────────────────────
// html2canvas v1.x does NOT support color-mix(). Every derived color used in
// the resume sheet must be pre-computed as a concrete rgb() value and injected
// as a CSS custom property so html2canvas can read it.

function parseHex(hex) {
  const h = (hex || "#000000").trim().replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Mix hex1 (at `ratio` 0–1) with hex2. Returns "rgb(r, g, b)". */
function mix(hex1, hex2, ratio) {
  const [r1, g1, b1] = parseHex(hex1);
  const [r2, g2, b2] = parseHex(hex2);
  const r = Math.round(r1 * ratio + r2 * (1 - ratio));
  const g = Math.round(g1 * ratio + g2 * (1 - ratio));
  const b = Math.round(b1 * ratio + b2 * (1 - ratio));
  return `rgb(${r}, ${g}, ${b})`;
}

/** Blend hex with pure white at `ratio` opacity. Returns "rgb(r, g, b)". */
const tint = (hex, ratio) => mix(hex, "#ffffff", ratio);

function buildColorVars(accentHex, inkHex, paperHex) {
  return {
    // ── Shared accent tints (tags, badges, section highlights) ──
    "--rc-tint":               tint(accentHex, 0.11),
    "--rc-tint-07":            tint(accentHex, 0.07),
    "--rc-tint-16":            tint(accentHex, 0.16),

    // ── Section divider lines ──
    "--rc-divider":            mix(accentHex, "#d2d2d2", 0.26),
    "--rc-divider-exec":       mix(accentHex, "#d4dce6", 0.18),
    "--rc-divider-studio":     mix(accentHex, "#e4d8d0", 0.20),
    "--rc-divider-prestige":   mix(accentHex, "#e4ddd6", 0.22),

    // ── Header / border accents ──
    "--rc-scholar-border":     mix(accentHex, "#d8d8d8", 0.20),
    "--rc-studio-hdr-border":  mix(accentHex, "#e8dfd6", 0.22),
    "--rc-diplomat-border":    mix(accentHex, "#d8d8d8", 0.22),
    "--rc-clinician-border":   mix(accentHex, "#e0e8e8", 0.18),

    // ── Dark header / sidebar backgrounds ──
    "--rc-exec-header":        mix(accentHex, "#081420", 0.75),
    "--rc-metro-sidebar":      mix(accentHex, "#120f1e", 0.80),

    // ── Studio section cards ──
    "--rc-studio-sec-bg":      mix(paperHex, "#ffffff", 0.82),
    "--rc-studio-sec-border":  tint(accentHex, 0.16),

    // ── Apex kicker ──
    "--rc-apex-kicker":        mix(accentHex, "#a0c8e8", 0.72),

    // ── Federal template ──
    "--rc-fed-line":           mix(inkHex, "#d0d0d0", 0.40),
    "--rc-fed-badge-bg":       mix(inkHex, "#ffffff", 0.08),
    "--rc-fed-badge-border":   mix(inkHex, "#ffffff", 0.18),

    // ── Counsel section rules ──
    "--rc-counsel-line":       mix(accentHex, "#c8c8c8", 0.25),
  };
}

// ─── Root Export ──────────────────────────────────────────────────────────────

// Need React in scope for React.Fragment usage
import React from "react";

export default function ResumePreview({ resume, templates }) {
  const template = templates.find((t) => t.id === resume.selectedTemplate) ?? templates[0];
  const Layout = LAYOUTS[template.id] ?? ScholarLayout;

  let accentHex = resume.personal.accentColor || template.palette.accent;
  let inkHex    = template.palette.ink;
  let paperHex  = template.palette.paper;
  let mutedValue = template.palette.muted;
  let fontOverride = resume.personal.fontFamily || null;

  if (template.id === "custom") {
    const customTheme = parseCustomTheme(resume.customThemeJson);
    accentHex = customTheme.palette?.accent || "#0d6f64";
    inkHex = customTheme.palette?.ink || "#1a2626";
    paperHex = customTheme.palette?.paper || "#ffffff";
    mutedValue = customTheme.palette?.muted || "#637171";
    fontOverride = customTheme.font || fontOverride;
  }

  const style = {
    "--resume-accent": accentHex,
    "--resume-ink":    inkHex,
    "--resume-paper":  paperHex,
    "--resume-muted":  mutedValue,
    ...(fontOverride ? { "--resume-font": fontOverride } : {}),
    ...buildColorVars(accentHex, inkHex, paperHex),
  };

  return (
    <article className={`resume-sheet template-${template.id}${fontOverride ? " has-font-override" : ""}`} style={style}>
      <Layout resume={resume} />
    </article>
  );
}
