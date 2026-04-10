/**
 * Generate a fully text-based, searchable/highlightable PDF using jsPDF.
 * Text is rendered programmatically so Adobe Reader, browsers, etc. can
 * select, search, copy, and screen-read every word.
 */

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

const compactUrl = (value) =>
  String(value || "")
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");

export async function exportPdfText(resume, filename) {
  const { jsPDF } = await import("jspdf");

  // ── Page metrics (A4 in pt) ──────────────────────────────────────────────────
  const W = 595.28;
  const H = 841.89;
  const ML = 52;   // left margin
  const MR = 52;   // right margin
  const MT = 52;   // top margin
  const MB = 52;   // bottom margin
  const CW = W - ML - MR; // content width

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  let y = MT;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec((hex || "#111111").trim());
    return m
      ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
      : [17, 17, 17];
  };

  // Parse accent colour from resume
  const [ar, ag, ab] = hexToRgb(resume.personal.accentColor || "#0d6f64");

  const setFont = (size, style = "normal", font = "helvetica") => {
    doc.setFont(font, style);
    doc.setFontSize(size);
  };

  const ink = () => doc.setTextColor(30, 30, 30);
  const muted = () => doc.setTextColor(100, 100, 100);
  const accent = () => doc.setTextColor(ar, ag, ab);

  const lineH = (size) => size * 1.4; // line height for a given font size

  const checkPageBreak = (needed = 60) => {
    if (y + needed > H - MB) {
      doc.addPage();
      y = MT;
    }
  };

  // Write wrapped text; returns height consumed
  const writeText = (text, x, maxW, size, style = "normal", colorFn = ink) => {
    setFont(size, style);
    colorFn();
    const lines = doc.splitTextToSize(String(text || ""), maxW);
    doc.text(lines, x, y);
    return lines.length * lineH(size);
  };

  // One-liner that writes and advances y
  const write = (text, x, maxW, size, style = "normal", colorFn = ink) => {
    checkPageBreak(lineH(size) * 2);
    y += writeText(text, x, maxW, size, style, colorFn);
  };

  const rule = (color = [180, 180, 180], width = 0.6) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(width);
    doc.line(ML, y, W - MR, y);
  };

  const sectionHead = (title) => {
    checkPageBreak(50);
    y += 12;
    setFont(8.5, "bold");
    accent();
    doc.text(title.toUpperCase(), ML, y);
    y += 5;
    rule([ar, ag, ab], 0.7);
    y += 10;
  };

  const entryBlock = ({ title, subtitle, location, date, summary, bullets, link }) => {
    checkPageBreak(40);

    // Title row with date/location right-aligned
    const meta = [location, date].filter(Boolean).join("  ·  ");
    setFont(10.5, "bold");
    ink();
    const titleLines = doc.splitTextToSize(String(title || ""), CW - (meta ? 160 : 0));
    doc.text(titleLines, ML, y);

    if (meta) {
      setFont(9, "normal");
      muted();
      doc.text(meta, W - MR, y, { align: "right" });
    }
    y += titleLines.length * lineH(10.5);

    // Subtitle
    if (subtitle) {
      setFont(9.5, "italic");
      muted();
      const subs = doc.splitTextToSize(subtitle, CW);
      doc.text(subs, ML, y);
      y += subs.length * lineH(9.5);
    }

    // Summary
    if (summary) {
      y += 2;
      setFont(9.5, "normal");
      muted();
      const sums = doc.splitTextToSize(summary, CW);
      doc.text(sums, ML, y);
      y += sums.length * lineH(9.5) + 2;
    }

    // Link
    if (link) {
      setFont(8.5, "normal");
      accent();
      doc.text(compactUrl(link), ML, y);
      y += lineH(8.5);
    }

    // Bullets
    const bLines = splitLines(bullets);
    if (bLines.length) {
      y += 2;
      for (const b of bLines) {
        checkPageBreak(20);
        setFont(9.5, "normal");
        ink();
        doc.text("•", ML, y);
        const wrapped = doc.splitTextToSize(b, CW - 12);
        doc.text(wrapped, ML + 12, y);
        y += wrapped.length * lineH(9.5);
      }
    }

    y += 8; // gap after entry
  };

  // ── HEADER ───────────────────────────────────────────────────────────────────

  // Name
  setFont(26, "bold");
  ink();
  doc.text(resume.personal.fullName || "Your Name", ML, y);
  y += lineH(26);

  // Title / role
  if (resume.personal.title) {
    setFont(11, "normal");
    accent();
    doc.text(resume.personal.title, ML, y);
    y += lineH(11) + 4;
  }

  // Contact row
  const contacts = [
    resume.personal.phone,
    resume.personal.email,
    resume.personal.location,
    resume.personal.website ? compactUrl(resume.personal.website) : "",
    resume.personal.linkedIn ? compactUrl(resume.personal.linkedIn) : "",
    resume.personal.github ? compactUrl(resume.personal.github) : "",
    resume.personal.extraLink ? compactUrl(resume.personal.extraLink) : "",
  ].filter(Boolean);

  if (contacts.length) {
    setFont(8.5, "normal");
    muted();
    const contactLine = contacts.join("   |   ");
    const wrapped = doc.splitTextToSize(contactLine, CW);
    doc.text(wrapped, ML, y);
    y += wrapped.length * lineH(8.5);
  }

  y += 4;
  rule([ar, ag, ab], 1);
  y += 14;

  // ── STATEMENT ────────────────────────────────────────────────────────────────

  if (resume.statement?.enabled && resume.statement.content?.trim()) {
    sectionHead(resume.statement.label || "Personal Statement");
    setFont(10, "normal");
    muted();
    const lines = doc.splitTextToSize(resume.statement.content, CW);
    doc.text(lines, ML, y);
    y += lines.length * lineH(10) + 6;
  }

  // ── EDUCATION ────────────────────────────────────────────────────────────────

  if (resume.visibility.education && resume.education?.length) {
    sectionHead("Education");
    for (const e of resume.education) {
      entryBlock({
        title: e.degree,
        subtitle: e.institution,
        location: e.location,
        date: e.date,
        summary: [e.grade ? `Grade / Honors: ${e.grade}` : "", e.details].filter(Boolean).join("  ·  ") || "",
      });
    }
  }

  // ── EXPERIENCE ───────────────────────────────────────────────────────────────

  if (resume.visibility.experience && resume.experience?.length) {
    sectionHead("Professional Experience");
    for (const e of resume.experience.filter((x) => x.role || x.organization)) {
      entryBlock({ title: e.role, subtitle: e.organization, location: e.location, date: e.date, bullets: e.bullets });
    }
  }

  // ── PROJECTS ─────────────────────────────────────────────────────────────────

  if (resume.visibility.projects && resume.projects?.length) {
    sectionHead("Projects");
    for (const e of resume.projects.filter((x) => x.name || x.organization)) {
      entryBlock({ title: e.name, subtitle: e.organization, location: e.location, date: e.date, summary: e.summary, bullets: e.bullets, link: e.link });
    }
  }

  // ── SKILLS ───────────────────────────────────────────────────────────────────

  if (resume.visibility.technicalSkills && resume.skillGroups?.length) {
    sectionHead("Skills");
    for (const g of resume.skillGroups.filter((x) => x.name || x.items)) {
      checkPageBreak(30);
      setFont(9.5, "bold");
      ink();
      doc.text(g.name ? `${g.name}:` : "", ML, y);
      const labelW = g.name ? doc.getTextWidth(`${g.name}:  `) : 0;
      setFont(9.5, "normal");
      muted();
      const skills = splitSkills(g.items).join("  ·  ");
      const wrapped = doc.splitTextToSize(skills, CW - labelW);
      doc.text(wrapped, ML + labelW, y);
      y += wrapped.length * lineH(9.5) + 3;
    }
    y += 4;
  }

  // ── CERTIFICATIONS ───────────────────────────────────────────────────────────

  if (resume.visibility.certifications && resume.certifications?.length) {
    const certs = resume.certifications.filter((x) => x.name);
    if (certs.length) {
      sectionHead("Certifications & Licenses");
      for (const e of certs) {
        const meta = [e.date, e.expiry ? `Exp. ${e.expiry}` : ""].filter(Boolean).join(" · ");
        entryBlock({ title: e.name, subtitle: e.issuer, date: meta, summary: e.credential ? `Credential: ${e.credential}` : "" });
      }
    }
  }

  // ── AWARDS ───────────────────────────────────────────────────────────────────

  if (resume.visibility.awards && resume.awards?.length) {
    const awards = resume.awards.filter((x) => x.title);
    if (awards.length) {
      sectionHead("Awards & Honors");
      for (const e of awards) {
        entryBlock({ title: e.title, subtitle: e.issuer, date: e.date, summary: e.description });
      }
    }
  }

  // ── PUBLICATIONS ─────────────────────────────────────────────────────────────

  if (resume.visibility.publications && resume.publications?.length) {
    const pubs = resume.publications.filter((x) => x.citation);
    if (pubs.length) {
      sectionHead("Publications");
      pubs.forEach((e, i) => {
        checkPageBreak(40);
        setFont(9.5, "normal");
        ink();
        const numW = doc.getTextWidth(`${i + 1}.  `);
        doc.text(`${i + 1}.`, ML, y);
        const wrapped = doc.splitTextToSize(e.citation, CW - numW);
        doc.text(wrapped, ML + numW, y);
        y += wrapped.length * lineH(9.5);
        if (e.link) {
          setFont(8.5, "normal");
          accent();
          doc.text(compactUrl(e.link), ML + numW, y);
          y += lineH(8.5);
        }
        y += 5;
      });
    }
  }

  // ── LEADERSHIP ───────────────────────────────────────────────────────────────

  if (resume.visibility.leadership && resume.leadership?.length) {
    const items = resume.leadership.filter((x) => x.title || x.organization);
    if (items.length) {
      sectionHead("Leadership & Community");
      for (const e of items) {
        entryBlock({ title: e.title, subtitle: e.organization, location: e.location, date: e.date, bullets: e.bullets, link: e.link });
      }
    }
  }

  // ── LANGUAGES ────────────────────────────────────────────────────────────────

  if (resume.visibility.languages && resume.languages?.length) {
    const langs = resume.languages.filter((x) => x.language);
    if (langs.length) {
      sectionHead("Languages");
      checkPageBreak(30);
      const langText = langs.map((l) => l.proficiency ? `${l.language} (${l.proficiency})` : l.language).join("   ·   ");
      setFont(10, "normal");
      ink();
      const wrapped = doc.splitTextToSize(langText, CW);
      doc.text(wrapped, ML, y);
      y += wrapped.length * lineH(10) + 6;
    }
  }

  // ── MEMBERSHIPS ──────────────────────────────────────────────────────────────

  if (resume.visibility.memberships && resume.memberships?.length) {
    const items = resume.memberships.filter((x) => x.organization);
    if (items.length) {
      sectionHead("Professional Affiliations");
      for (const e of items) {
        checkPageBreak(24);
        setFont(10, "bold");
        ink();
        doc.text(e.organization, ML, y);
        if (e.date) {
          setFont(9, "normal");
          muted();
          doc.text(e.date, W - MR, y, { align: "right" });
        }
        y += lineH(10);
        if (e.role) {
          setFont(9.5, "italic");
          muted();
          doc.text(e.role, ML, y);
          y += lineH(9.5);
        }
        y += 4;
      }
    }
  }

  // ── RESEARCH INTERESTS ───────────────────────────────────────────────────────

  if (resume.visibility.researchInterests && resume.researchInterests?.trim()) {
    const items = splitLines(resume.researchInterests);
    if (items.length) {
      sectionHead("Research Interests");
      checkPageBreak(20);
      setFont(10, "normal");
      ink();
      const text = items.join("   ·   ");
      const wrapped = doc.splitTextToSize(text, CW);
      doc.text(wrapped, ML, y);
      y += wrapped.length * lineH(10) + 6;
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────────

  const textFilename = filename.replace(/\.pdf$/i, "") + "-text.pdf";
  doc.save(textFilename);
}
