/**
 * Export resume as an editable Microsoft Word (.docx) file.
 * Uses the `docx` npm package (v9).
 *
 * The document is structured with proper paragraph styles so users can open
 * it in Word, Google Docs, or LibreOffice and edit every field directly.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TabStopPosition,
  TabStopType,
  UnderlineType,
} from "docx";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

/** Trim hex '#' and return uppercase 6-char string for docx colour fields */
const hex6 = (color) => (color || "0d6f64").replace("#", "").toUpperCase().slice(0, 6);

// ── Component Builders ────────────────────────────────────────────────────────

/** A blank spacer paragraph */
const gap = (space = 80) =>
  new Paragraph({ spacing: { before: 0, after: space }, children: [new TextRun("")] });

/** Thin horizontal rule paragraph */
const rule = (color = "AAAAAA") =>
  new Paragraph({
    spacing: { before: 60, after: 60 },
    border: {
      bottom: { color, space: 1, style: BorderStyle.SINGLE, size: 4 },
    },
    children: [new TextRun("")],
  });

/** Bold uppercase section heading with coloured rule below */
const sectionHeading = (text, accentHex) =>
  new Paragraph({
    spacing: { before: 180, after: 60 },
    border: {
      bottom: { color: hex6(accentHex), space: 2, style: BorderStyle.SINGLE, size: 6 },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 18,         // 9pt
        color: hex6(accentHex),
        characterSpacing: 80,
      }),
    ],
  });

/**
 * Build paragraphs for a single resume entry (role, org, date, bullets, etc.)
 */
const entryParagraphs = (
  { title, subtitle, location, date, summary, bullets, link },
  accentHex
) => {
  const paras = [];
  const meta = [location, date].filter(Boolean).join("  ·  ");

  // Title + date right-aligned on same line using tab stop
  paras.push(
    new Paragraph({
      spacing: { before: 100, after: 20 },
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      children: [
        new TextRun({ text: title || "", bold: true, size: 22 }),
        meta
          ? new TextRun({ text: `\t${meta}`, size: 18, color: "777777" })
          : new TextRun(""),
      ],
    })
  );

  // Subtitle / organisation
  if (subtitle) {
    paras.push(
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [new TextRun({ text: subtitle, italics: true, size: 20, color: "555555" })],
      })
    );
  }

  // One-line summary
  if (summary) {
    paras.push(
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [new TextRun({ text: summary, size: 19, color: "666666" })],
      })
    );
  }

  // Link
  if (link) {
    paras.push(
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [
          new TextRun({
            text: compactUrl(link),
            size: 18,
            color: hex6(accentHex),
            underline: { type: UnderlineType.SINGLE, color: hex6(accentHex) },
          }),
        ],
      })
    );
  }

  // Bullet points
  for (const b of splitLines(bullets)) {
    paras.push(
      new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 0, after: 20 },
        children: [new TextRun({ text: b, size: 19 })],
      })
    );
  }

  return paras;
};

// ── Main Export ───────────────────────────────────────────────────────────────

export async function exportToDocx(resume, filename) {
  const accent = resume.personal.accentColor || "#0d6f64";
  const children = [];

  // ── HEADER ─────────────────────────────────────────────────────────────────

  // Name
  children.push(
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: resume.personal.fullName || "Your Name",
          bold: true,
          size: 56,       // 28pt
          color: "1A1A1A",
        }),
      ],
    })
  );

  // Professional title
  if (resume.personal.title) {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: resume.personal.title,
            size: 24,
            color: hex6(accent),
            characterSpacing: 40,
          }),
        ],
      })
    );
  }

  // Contact details — each on its own line for clarity
  const contactFields = [
    resume.personal.phone && `Phone: ${resume.personal.phone}`,
    resume.personal.email && `Email: ${resume.personal.email}`,
    resume.personal.location && `Location: ${resume.personal.location}`,
    resume.personal.website && `Website: ${compactUrl(resume.personal.website)}`,
    resume.personal.linkedIn && `LinkedIn: ${compactUrl(resume.personal.linkedIn)}`,
    resume.personal.github && `GitHub: ${compactUrl(resume.personal.github)}`,
    resume.personal.extraLink && compactUrl(resume.personal.extraLink),
  ].filter(Boolean);

  if (contactFields.length) {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: contactFields.flatMap((cf, i) => [
          new TextRun({ text: cf, size: 18, color: "555555" }),
          i < contactFields.length - 1 ? new TextRun({ text: "   |   ", size: 18, color: "AAAAAA" }) : null,
        ]).filter(Boolean),
      })
    );
  }

  children.push(rule(hex6(accent)));

  // ── PERSONAL STATEMENT ─────────────────────────────────────────────────────

  if (resume.statement?.enabled && resume.statement.content?.trim()) {
    children.push(sectionHeading(resume.statement.label || "Personal Statement", accent));
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 60 },
        children: [new TextRun({ text: resume.statement.content, size: 20, color: "444444" })],
      })
    );
  }

  // ── EDUCATION ─────────────────────────────────────────────────────────────

  if (resume.visibility.education && resume.education?.length) {
    children.push(sectionHeading("Education", accent));
    for (const e of resume.education) {
      const details = [e.grade ? `Grade / Honors: ${e.grade}` : "", e.details].filter(Boolean).join("  ·  ");
      children.push(...entryParagraphs({ title: e.degree, subtitle: e.institution, location: e.location, date: e.date, summary: details }, accent));
    }
  }

  // ── PROFESSIONAL EXPERIENCE ────────────────────────────────────────────────

  if (resume.visibility.experience && resume.experience?.length) {
    const items = resume.experience.filter((x) => x.role || x.organization);
    if (items.length) {
      children.push(sectionHeading("Professional Experience", accent));
      for (const e of items) {
        children.push(...entryParagraphs({ title: e.role, subtitle: e.organization, location: e.location, date: e.date, bullets: e.bullets }, accent));
      }
    }
  }

  // ── PROJECTS ──────────────────────────────────────────────────────────────

  if (resume.visibility.projects && resume.projects?.length) {
    const items = resume.projects.filter((x) => x.name || x.organization);
    if (items.length) {
      children.push(sectionHeading("Projects", accent));
      for (const e of items) {
        children.push(...entryParagraphs({ title: e.name, subtitle: e.organization, location: e.location, date: e.date, summary: e.summary, bullets: e.bullets, link: e.link }, accent));
      }
    }
  }

  // ── SKILLS ────────────────────────────────────────────────────────────────

  if (resume.visibility.technicalSkills && resume.skillGroups?.length) {
    const groups = resume.skillGroups.filter((g) => g.name || g.items);
    if (groups.length) {
      children.push(sectionHeading("Skills", accent));
      for (const g of groups) {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [
              new TextRun({ text: g.name ? `${g.name}: ` : "", bold: true, size: 19 }),
              new TextRun({ text: splitSkills(g.items).join("  ·  "), size: 19, color: "444444" }),
            ],
          })
        );
      }
    }
  }

  // ── CERTIFICATIONS ────────────────────────────────────────────────────────

  if (resume.visibility.certifications && resume.certifications?.length) {
    const certs = resume.certifications.filter((x) => x.name);
    if (certs.length) {
      children.push(sectionHeading("Certifications & Licenses", accent));
      for (const e of certs) {
        const meta = [e.date, e.expiry ? `Exp. ${e.expiry}` : ""].filter(Boolean).join(" · ");
        children.push(...entryParagraphs({ title: e.name, subtitle: e.issuer, date: meta, summary: e.credential ? `Credential: ${e.credential}` : "" }, accent));
      }
    }
  }

  // ── AWARDS & HONORS ───────────────────────────────────────────────────────

  if (resume.visibility.awards && resume.awards?.length) {
    const items = resume.awards.filter((x) => x.title);
    if (items.length) {
      children.push(sectionHeading("Awards & Honors", accent));
      for (const e of items) {
        children.push(...entryParagraphs({ title: e.title, subtitle: e.issuer, date: e.date, summary: e.description }, accent));
      }
    }
  }

  // ── PUBLICATIONS ──────────────────────────────────────────────────────────

  if (resume.visibility.publications && resume.publications?.length) {
    const pubs = resume.publications.filter((x) => x.citation);
    if (pubs.length) {
      children.push(sectionHeading("Publications", accent));
      pubs.forEach((e, i) => {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [
              new TextRun({ text: `${i + 1}.  `, bold: true, size: 19 }),
              new TextRun({ text: e.citation, size: 19 }),
            ],
          })
        );
        if (e.link) {
          children.push(
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [
                new TextRun({
                  text: compactUrl(e.link),
                  size: 17,
                  color: hex6(accent),
                  underline: { type: UnderlineType.SINGLE, color: hex6(accent) },
                }),
              ],
            })
          );
        }
      });
    }
  }

  // ── LEADERSHIP ────────────────────────────────────────────────────────────

  if (resume.visibility.leadership && resume.leadership?.length) {
    const items = resume.leadership.filter((x) => x.title || x.organization);
    if (items.length) {
      children.push(sectionHeading("Leadership & Community", accent));
      for (const e of items) {
        children.push(...entryParagraphs({ title: e.title, subtitle: e.organization, location: e.location, date: e.date, bullets: e.bullets, link: e.link }, accent));
      }
    }
  }

  // ── LANGUAGES ─────────────────────────────────────────────────────────────

  if (resume.visibility.languages && resume.languages?.length) {
    const langs = resume.languages.filter((x) => x.language);
    if (langs.length) {
      children.push(sectionHeading("Languages", accent));
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: langs.flatMap((l, i) => [
            new TextRun({ text: l.language, bold: true, size: 20 }),
            l.proficiency ? new TextRun({ text: ` (${l.proficiency})`, size: 19, color: "666666" }) : null,
            i < langs.length - 1 ? new TextRun({ text: "   ·   ", size: 19, color: "AAAAAA" }) : null,
          ]).filter(Boolean),
        })
      );
    }
  }

  // ── PROFESSIONAL AFFILIATIONS ─────────────────────────────────────────────

  if (resume.visibility.memberships && resume.memberships?.length) {
    const items = resume.memberships.filter((x) => x.organization);
    if (items.length) {
      children.push(sectionHeading("Professional Affiliations", accent));
      for (const e of items) {
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: e.organization, bold: true, size: 20 }),
              e.role ? new TextRun({ text: `  —  ${e.role}`, size: 19, color: "666666" }) : null,
              e.date ? new TextRun({ text: `\t${e.date}`, size: 18, color: "777777" }) : null,
            ].filter(Boolean),
          })
        );
      }
    }
  }

  // ── RESEARCH INTERESTS ─────────────────────────────────────────────────────

  if (resume.visibility.researchInterests && resume.researchInterests?.trim()) {
    const items = splitLines(resume.researchInterests);
    if (items.length) {
      children.push(sectionHeading("Research Interests", accent));
      for (const item of items) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: item, size: 19 })],
          })
        );
      }
    }
  }

  // ── Build & Download ───────────────────────────────────────────────────────

  const doc = new Document({
    description: `Resume — ${resume.personal.fullName}`,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 }, // ~1.27cm
          },
        },
        children,
      },
    ],
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20 },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.replace(/\.[^.]+$/, "") + ".docx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
