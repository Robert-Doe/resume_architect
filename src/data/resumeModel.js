let idCounter = 0;

const makeId = (prefix = "item") => `${prefix}-${++idCounter}`;

const basePersonal = {
  fullName: "",
  title: "",
  phone: "",
  email: "",
  location: "",
  website: "",
  linkedIn: "",
  github: "",
  extraLink: "",
  accentColor: "#0d6f64",
  fontFamily: "'Times New Roman', Times, serif",
};

// ─── Font Catalog ─────────────────────────────────────────────────────────────

export const FONT_OPTIONS = [
  {
    label: "Template default",
    value: "",
    preview: "Abc",
    description: "Uses the font built into the selected template",
  },

  // ── Serif / Traditional ──
  {
    label: "Times New Roman",
    value: "'Times New Roman', Times, serif",
    preview: "Abc",
    description: "Classic academic serif — universally recognised",
  },
  {
    label: "Georgia",
    value: "Georgia, 'Times New Roman', serif",
    preview: "Abc",
    description: "Elegant screen-optimised serif — warm and readable",
  },
  {
    label: "Book Antiqua / Palatino",
    value: "'Book Antiqua', 'Palatino Linotype', Palatino, serif",
    preview: "Abc",
    description: "Old-style humanist serif — scholarly and archaic feel",
  },
  {
    label: "Garamond",
    value: "'Garamond', 'EB Garamond', 'Cormorant Garamond', Georgia, serif",
    preview: "Abc",
    description: "Renaissance-era typeface — refined and literary",
  },

  // ── Sans-serif / Modern ──
  {
    label: "Calibri",
    value: "Calibri, 'Segoe UI', sans-serif",
    preview: "Abc",
    description: "Humanist sans — Microsoft Word default, ATS-safe",
  },
  {
    label: "Arial / Helvetica",
    value: "Arial, Helvetica, sans-serif",
    preview: "Abc",
    description: "Neutral grotesque — maximum compatibility",
  },
  {
    label: "Segoe UI",
    value: "'Segoe UI', system-ui, sans-serif",
    preview: "Abc",
    description: "Clean Windows system font — modern and professional",
  },
  {
    label: "Trebuchet MS",
    value: "'Trebuchet MS', 'Segoe UI', sans-serif",
    preview: "Abc",
    description: "Humanist sans — friendly, readable at small sizes",
  },
  {
    label: "Verdana",
    value: "Verdana, Geneva, sans-serif",
    preview: "Abc",
    description: "Wide-spaced grotesque — excellent on screen",
  },

  // ── Monospace ──
  {
    label: "Courier New",
    value: "'Courier New', Courier, monospace",
    preview: "Abc",
    description: "Classic typewriter monospace — retro, technical",
  },
  {
    label: "Lucida Console",
    value: "'Lucida Console', 'Courier New', monospace",
    preview: "Abc",
    description: "Condensed monospace — compact, developer-style",
  },
];

const baseStatement = {
  enabled: false,
  label: "Personal Statement",
  content: "",
};

const baseVisibility = {
  education: true,
  researchInterests: false,
  technicalSkills: true,
  experience: true,
  publications: false,
  projects: true,
  leadership: true,
  certifications: true,
  awards: true,
  languages: true,
  memberships: false,
  teachingExperience: false,
  researchExperience: true,
  conferencePresentation: true,
  invitedTalks: false,
  grantsAndFunding: false,
};

// ─── Factory Functions ────────────────────────────────────────────────────────

export const createEducationEntry = (overrides = {}) => ({
  id: makeId("education"),
  degree: "",
  institution: "",
  location: "",
  date: "",
  grade: "",
  details: "",
  ...overrides,
});

export const createSkillGroup = (overrides = {}) => ({
  id: makeId("skill"),
  name: "",
  items: "",
  ...overrides,
});

export const createExperienceEntry = (overrides = {}) => ({
  id: makeId("experience"),
  role: "",
  organization: "",
  location: "",
  date: "",
  bullets: "",
  ...overrides,
});

export const createPublicationEntry = (overrides = {}) => ({
  id: makeId("publication"),
  citation: "",
  link: "",
  ...overrides,
});

export const createProjectEntry = (overrides = {}) => ({
  id: makeId("project"),
  name: "",
  organization: "",
  location: "",
  date: "",
  summary: "",
  bullets: "",
  link: "",
  ...overrides,
});

export const createLeadershipEntry = (overrides = {}) => ({
  id: makeId("leadership"),
  title: "",
  organization: "",
  location: "",
  date: "",
  bullets: "",
  link: "",
  ...overrides,
});

export const createCertificationEntry = (overrides = {}) => ({
  id: makeId("cert"),
  name: "",
  issuer: "",
  date: "",
  expiry: "",
  credential: "",
  ...overrides,
});

export const createAwardEntry = (overrides = {}) => ({
  id: makeId("award"),
  title: "",
  issuer: "",
  date: "",
  description: "",
  ...overrides,
});

export const createLanguageEntry = (overrides = {}) => ({
  id: makeId("lang"),
  language: "",
  proficiency: "",
  ...overrides,
});

export const createMembershipEntry = (overrides = {}) => ({
  id: makeId("membership"),
  organization: "",
  role: "",
  date: "",
  ...overrides,
});

export const createTeachingEntry = (overrides = {}) => ({
  id: makeId("teach"),
  role: "",
  course: "",
  institution: "",
  location: "",
  date: "",
  bullets: "",
  ...overrides,
});

export const createResearchExpEntry = (overrides = {}) => ({
  id: makeId("resexp"),
  role: "",
  lab: "",
  supervisor: "",
  institution: "",
  location: "",
  date: "",
  bullets: "",
  ...overrides,
});

export const createConferencePresentationEntry = (overrides = {}) => ({
  id: makeId("confpres"),
  title: "",
  conference: "",
  location: "",
  date: "",
  type: "oral",
  coauthors: "",
  link: "",
  ...overrides,
});

export const createInvitedTalkEntry = (overrides = {}) => ({
  id: makeId("talk"),
  title: "",
  event: "",
  institution: "",
  location: "",
  date: "",
  link: "",
  ...overrides,
});

export const createGrantEntry = (overrides = {}) => ({
  id: makeId("grant"),
  title: "",
  agency: "",
  role: "",
  amount: "",
  period: "",
  status: "",
  ...overrides,
});

// ─── Section Order & Custom Theme Defaults ────────────────────────────────────

export const DEFAULT_SECTION_ORDER = [
  "statement",
  "education",
  "researchInterests",
  "researchExperience",
  "teachingExperience",
  "experience",
  "publications",
  "conferencePresentation",
  "invitedTalks",
  "projects",
  "grantsAndFunding",
  "technicalSkills",
  "certifications",
  "awards",
  "leadership",
  "languages",
  "memberships",
];

export const DEFAULT_CUSTOM_THEME_JSON = JSON.stringify({
  name: "My Custom Theme",
  palette: {
    accent: "#0d6f64",
    ink: "#1a2626",
    paper: "#ffffff",
    muted: "#637171"
  },
  font: "'Times New Roman', Times, serif",
  layout: "single",
  headerStyle: "split",
  sectionStyle: "line",
  spacing: "normal"
}, null, 2);

// ─── Template Catalog ─────────────────────────────────────────────────────────

export const templateCatalog = [
  {
    id: "grad-student",
    name: "Grad Student",
    tagline: "Refined academic CV layout — optimal section order for PhDs, post-docs, and early faculty.",
    preview: "Academic",
    palette: {
      accent: "#1e3a5f",
      ink: "#111827",
      paper: "#fdfcfb",
      muted: "#4b5563",
    },
  },
  {
    id: "scholar",
    name: "Scholar Classic",
    tagline: "Single-column academic layout with serif typography and clean flow.",
    preview: "Academic",
    palette: {
      accent: "#0d6f64",
      ink: "#163133",
      paper: "#ffffff",
      muted: "#637171",
    },
  },
  {
    id: "scholar-plain",
    name: "Scholar Plain",
    tagline: "Scholar Classic without pill badges — research interests render as a clean plain list.",
    preview: "Plain",
    palette: {
      accent: "#0d6f64",
      ink: "#163133",
      paper: "#ffffff",
      muted: "#637171",
    },
  },
  {
    id: "executive",
    name: "Executive Slate",
    tagline: "Two-column boardroom layout with a strong dark header.",
    preview: "Executive",
    palette: {
      accent: "#1f4f7d",
      ink: "#0f1f2e",
      paper: "#ffffff",
      muted: "#5d6a74",
    },
  },
  {
    id: "metro",
    name: "Metro Sidebar",
    tagline: "Dark sidebar with a modern two-column flow for tech profiles.",
    preview: "Modern",
    palette: {
      accent: "#8a4fff",
      ink: "#211937",
      paper: "#ffffff",
      muted: "#6f6891",
    },
  },
  {
    id: "studio",
    name: "Studio Canvas",
    tagline: "Editorial two-column style for creative and design applications.",
    preview: "Creative",
    palette: {
      accent: "#c45e1d",
      ink: "#2f2118",
      paper: "#fffaf6",
      muted: "#78655a",
    },
  },
  {
    id: "apex",
    name: "Apex Pro",
    tagline: "Flat single-column layout built for ATS systems and corporate roles.",
    preview: "Corporate",
    palette: {
      accent: "#1d4ed8",
      ink: "#0f172a",
      paper: "#ffffff",
      muted: "#64748b",
    },
  },
  {
    id: "counsel",
    name: "Counsel",
    tagline: "Formal serif layout for law, finance, consulting, and executive roles.",
    preview: "Formal",
    palette: {
      accent: "#1e3a5f",
      ink: "#1a1a2e",
      paper: "#fafaf9",
      muted: "#4b5563",
    },
  },
  {
    id: "clinician",
    name: "Clinician",
    tagline: "Structured two-column format for healthcare and scientific professionals.",
    preview: "Medical",
    palette: {
      accent: "#0d9488",
      ink: "#0f172a",
      paper: "#f8fffe",
      muted: "#5d7978",
    },
  },
  {
    id: "prestige",
    name: "Prestige",
    tagline: "Dark-header premium layout for senior executives and board-level roles.",
    preview: "Premium",
    palette: {
      accent: "#b45309",
      ink: "#1c1917",
      paper: "#fffbf7",
      muted: "#78716c",
    },
  },
  {
    id: "diplomat",
    name: "Diplomat",
    tagline: "Centered European-style two-column layout for international applications.",
    preview: "European",
    palette: {
      accent: "#1d4ed8",
      ink: "#1e293b",
      paper: "#ffffff",
      muted: "#64748b",
    },
  },
  {
    id: "federal",
    name: "Federal",
    tagline: "Hierarchical formal layout meeting government and civil service standards.",
    preview: "Government",
    palette: {
      accent: "#374151",
      ink: "#111827",
      paper: "#ffffff",
      muted: "#6b7280",
    },
  },
  {
    id: "custom",
    name: "Custom Theme",
    tagline: "Define your own layout, colors, and typography using the JSON editor below.",
    preview: "Custom",
    palette: {
      accent: "#0d6f64",
      ink: "#1a2626",
      paper: "#ffffff",
      muted: "#637171",
    },
  },
];

// ─── Blank Resume ─────────────────────────────────────────────────────────────

export const createBlankResume = () => ({
  selectedTemplate: "apex",
  personal: {
    ...basePersonal,
    fullName: "Your Name",
    title: "Researcher · Engineer · Consultant · Leader",
  },
  statement: { ...baseStatement },
  visibility: { ...baseVisibility },
  researchInterests: "Add one interest per line:\nWeb security\nMachine learning\nHuman-computer interaction",
  education: [
    createEducationEntry({
      degree: "Degree or Program",
      institution: "University or Institution",
      location: "City, Country",
      date: "2022 – 2026",
      grade: "GPA / Honors",
      details: "Awards, scholarships, thesis focus, or notable coursework.",
    }),
  ],
  skillGroups: [
    createSkillGroup({
      name: "Core Skills",
      items: "React, TypeScript, Python, APIs, UX Research",
    }),
  ],
  experience: [
    createExperienceEntry({
      role: "Role Title",
      organization: "Organization",
      location: "Location or Remote",
      date: "2024 – Present",
      bullets: "Describe the scope of your work\nHighlight measurable outcomes\nMention a key tool, product, or method",
    }),
  ],
  publications: [
    createPublicationEntry({
      citation: "Author, A., & You. (Year). Article title. Journal / Conference.",
      link: "",
    }),
  ],
  projects: [
    createProjectEntry({
      name: "Project Name",
      organization: "Client, lab, or personal project",
      location: "Location",
      date: "2024",
      summary: "A one-line description for context.",
      bullets: "Explain what you built or discovered\nCall out tools, users, or impact",
      link: "",
    }),
  ],
  leadership: [
    createLeadershipEntry({
      title: "Leadership Role",
      organization: "Community or Initiative",
      location: "Location",
      date: "2023 – Present",
      bullets: "Describe the leadership contribution\nMention mentoring, organizing, or growth",
      link: "",
    }),
  ],
  certifications: [
    createCertificationEntry({
      name: "Certification Name",
      issuer: "Issuing Body",
      date: "2024",
      expiry: "",
      credential: "",
    }),
  ],
  awards: [
    createAwardEntry({
      title: "Award or Scholarship Name",
      issuer: "Awarding Institution",
      date: "2024",
      description: "A brief description of the recognition and its significance.",
    }),
  ],
  languages: [
    createLanguageEntry({ language: "English", proficiency: "Native" }),
    createLanguageEntry({ language: "Second Language", proficiency: "Fluent" }),
  ],
  memberships: [
    createMembershipEntry({
      organization: "Professional Association",
      role: "Member",
      date: "2023 – Present",
    }),
  ],
  teachingExperience: [],
  researchExperience: [],
  conferencePresentation: [],
  invitedTalks: [],
  grantsAndFunding: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  customThemeJson: DEFAULT_CUSTOM_THEME_JSON,
});

// ─── Sample Resume ────────────────────────────────────────────────────────────

export const createSampleResume = () => ({
  selectedTemplate: "scholar",
  personal: {
    ...basePersonal,
    fullName: "Alex Example",
    title: "Example Researcher & Full-Stack Developer",
    phone: "+1 555 010 1234",
    email: "alex@example.com",
    location: "Example City, USA",
    website: "https://example.com",
    linkedIn: "https://linkedin.com/in/alex-example/",
    github: "https://github.com/alex-example/",
    extraLink: "https://example.com/portfolio",
    accentColor: "#0d6f64",
  },
  statement: {
    enabled: true,
    label: "Personal Statement",
    content:
      "Example researcher and developer focused on web security, privacy-preserving systems, and human-centered software. I turn ideas into practical prototypes, test them carefully, and communicate results clearly.",
  },
  visibility: {
    education: true,
    researchInterests: true,
    technicalSkills: true,
    experience: true,
    publications: true,
    projects: true,
    leadership: true,
    certifications: true,
    awards: true,
    languages: true,
    memberships: true,
    teachingExperience: true,
    researchExperience: true,
    conferencePresentation: true,
    invitedTalks: false,
    grantsAndFunding: true,
  },
  researchInterests:
    "Web security and privacy\nHuman-computer interaction\nApplied machine learning\nPrototype-driven systems research",
  education: [
    createEducationEntry({
      degree: "PhD Computer Science",
      institution: "Example University",
      location: "Example City, USA",
      date: "Expected 2028",
      grade: "GPA / Honors",
      details: "Thesis topic, scholarship, or relevant coursework.",
    }),
    createEducationEntry({
      degree: "BSc Computer Science",
      institution: "Example College of Technology",
      location: "Example City, Country",
      date: "2021",
      grade: "First Class / Honors",
      details: "Capstone project, academic awards, or focus area.",
    }),
  ],
  skillGroups: [
    createSkillGroup({
      name: "Languages & Runtimes",
      items: "Python, TypeScript, JavaScript, Java, SQL, C/C++",
    }),
    createSkillGroup({
      name: "Frontend & Mobile",
      items: "React, Next.js, HTML5/CSS3, Flutter, Figma",
    }),
    createSkillGroup({
      name: "Backend & APIs",
      items: "Node.js, Express, FastAPI, RESTful APIs, GraphQL",
    }),
    createSkillGroup({
      name: "Databases & Storage",
      items: "PostgreSQL, MySQL, MongoDB, Redis",
    }),
    createSkillGroup({
      name: "Data & Machine Learning",
      items: "Pandas, NumPy, scikit-learn, TensorFlow",
    }),
  ],
  experience: [
    createExperienceEntry({
      role: "Research Assistant",
      organization: "Example University",
      location: "Example City, USA",
      date: "2024 - Present",
      bullets:
        "Investigated a sample research problem in privacy-preserving systems.\nBuilt a prototype to test ideas and measure performance.\nCollaborated with advisors and peers on literature review and evaluation.",
    }),
    createExperienceEntry({
      role: "Teaching Assistant",
      organization: "Example University",
      location: "Example City, USA",
      date: "2023 - 2024",
      bullets:
        "Led weekly lab sessions for an introductory computing course.\nSupported grading, office hours, and student questions.\nHelped improve course materials and assignment instructions.",
    }),
    createExperienceEntry({
      role: "Full-Stack Developer Intern",
      organization: "Example Tech Company",
      location: "Remote",
      date: "2022 - 2023",
      bullets:
        "Built a small dashboard in React and integrated a REST API.\nWorked with stakeholders to gather requirements and ship updates.\nDocumented the system and fixed bugs based on user feedback.",
    }),
    createExperienceEntry({
      role: "Project Assistant",
      organization: "Example Nonprofit",
      location: "Example City, Country",
      date: "2021 - 2022",
      bullets:
        "Automated repetitive reporting tasks and cleaned data sets.\nCreated simple internal tools to reduce manual work.\nPresented progress updates to the team.",
    }),
    createExperienceEntry({
      role: "Developer",
      organization: "Example Lab Project",
      location: "Remote",
      date: "2020 - 2021",
      bullets:
        "Implemented front-end and back-end features for a small web tool.\nTested functionality and improved the user flow.\nPrepared notes for future contributors.",
    }),
  ],
  publications: [
    createPublicationEntry({
      citation:
        "Example, A., Sample, B., & Doe, J. (2025). Example paper title for a resume template. Journal of Example Studies, 1(1), 1-10.",
      link: "https://doi.org/10.0000/example",
    }),
  ],
  projects: [
    createProjectEntry({
      name: "Example Privacy Tool",
      organization: "Example University",
      location: "Example City, USA",
      date: "2025",
      summary: "A sample project for privacy-oriented web research.",
      bullets:
        "Prototyped a browser feature to illustrate the workflow.\nMeasured basic performance and usability.\nDocumented tradeoffs for future iteration.",
    }),
    createProjectEntry({
      name: "Example Collaboration Platform",
      organization: "Independent Project",
      location: "Remote",
      date: "2024",
      summary: "A small platform for coordinating research tasks.",
      bullets:
        "Built account, task, and messaging flows.\nAdded simple admin controls and reporting.\nRefined the interface based on feedback.",
    }),
    createProjectEntry({
      name: "Example Learning App",
      organization: "Example Startup",
      location: "Remote",
      date: "2023",
      summary: "An educational app for demonstrating product development.",
      bullets:
        "Created lesson and progress-tracking screens.\nConnected the app to a lightweight API.\nImproved onboarding and accessibility.",
    }),
    createProjectEntry({
      name: "Example Web App",
      organization: "Personal Project",
      location: "Remote",
      date: "2022",
      summary: "A portfolio-style app for practicing full-stack development.",
      bullets:
        "Built reusable components and forms.\nAdded deployment-ready configuration.\nWrote brief usage notes for the README.",
    }),
    createProjectEntry({
      name: "Example Scheduling Tool",
      organization: "Example College",
      location: "Example City, Country",
      date: "2021",
      summary: "A timetable tool used as a classroom example.",
      bullets:
        "Modeled scheduling constraints with simple rules.\nGenerated conflict-aware schedules.\nTested edge cases with sample data.",
    }),
  ],
  leadership: [
    createLeadershipEntry({
      title: "Founder",
      organization: "Example Coding Club",
      location: "Remote",
      date: "2024 - Present",
      bullets:
        "Started a small community for peer learning.\nOrganized short workshops and project demos.",
      link: "https://example.com",
    }),
    createLeadershipEntry({
      title: "Workshop Mentor",
      organization: "Example Student Organization",
      location: "Example City, Country",
      date: "2023 - 2024",
      bullets:
        "Mentored beginners on programming basics.\nReviewed project ideas and gave feedback.",
    }),
    createLeadershipEntry({
      title: "Lead Technician",
      organization: "Example Campus Support",
      location: "Example City, Country",
      date: "2020 - 2023",
      bullets:
        "Handled computer setup and troubleshooting.\nCreated step-by-step support notes for common issues.",
    }),
  ],
  certifications: [
    createCertificationEntry({
      name: "Example Cloud Certification",
      issuer: "Example Vendor",
      date: "Mar 2024",
      expiry: "Mar 2027",
      credential: "EX-12345",
    }),
    createCertificationEntry({
      name: "Example Security Certificate",
      issuer: "Example Academy",
      date: "Jan 2024",
      expiry: "",
      credential: "",
    }),
  ],
  awards: [
    createAwardEntry({
      title: "Example Graduate Scholarship",
      issuer: "Example Foundation",
      date: "2024",
      description: "Awarded for strong academic performance and community involvement.",
    }),
    createAwardEntry({
      title: "Example Project Award",
      issuer: "Example Department",
      date: "2023",
      description: "Recognized for a clear, well-documented student project.",
    }),
  ],
  languages: [
    createLanguageEntry({ language: "English", proficiency: "Native" }),
    createLanguageEntry({ language: "Spanish", proficiency: "Conversational" }),
    createLanguageEntry({ language: "French", proficiency: "Basic" }),
  ],
  memberships: [
    createMembershipEntry({
      organization: "Example Computer Society",
      role: "Student Member",
      date: "2023 - Present",
    }),
    createMembershipEntry({
      organization: "Example Technical Association",
      role: "Member",
      date: "2024 - Present",
    }),
  ],
  teachingExperience: [
    createTeachingEntry({
      role: "Teaching Assistant",
      course: "CS 101 - Intro to Computing",
      institution: "Example University",
      location: "Example City, USA",
      date: "2023 - 2024",
      bullets: "Led weekly lab sections for introductory programming.\nAnswered questions and supported grading.\nHelped students debug assignments.",
    }),
  ],
  researchExperience: [
    createResearchExpEntry({
      role: "Graduate Research Assistant",
      lab: "Example Research Lab",
      supervisor: "Prof. Example Name",
      institution: "Example University",
      location: "Example City, USA",
      date: "2024 - Present",
      bullets: "Investigating a sample privacy-preserving system.\nBuilt a prototype to test the idea in a browser.\nWrote notes summarizing findings and next steps.",
    }),
  ],
  conferencePresentation: [
    createConferencePresentationEntry({
      title: "Example Talk on Browser Privacy",
      conference: "Example Research Symposium",
      location: "Example City, USA",
      date: "Nov 2024",
      type: "oral",
      coauthors: "A. Example, B. Sample",
      link: "https://example.com/talk",
    }),
    createConferencePresentationEntry({
      title: "Example Poster on Secure Web Design",
      conference: "Example Systems Poster Session",
      location: "Example City, USA",
      date: "Aug 2024",
      type: "poster",
      coauthors: "A. Example",
      link: "https://example.com/poster",
    }),
  ],
  invitedTalks: [],
  grantsAndFunding: [
    createGrantEntry({
      title: "Example Graduate Fellowship",
      agency: "Example Funding Agency",
      role: "Graduate Fellow",
      amount: "$10,000 / year",
      period: "2024 - 2027",
      status: "Active",
    }),
  ],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  customThemeJson: DEFAULT_CUSTOM_THEME_JSON,
});

// ─── Factories Registry ───────────────────────────────────────────────────────

export const factories = {
  education: createEducationEntry,
  skillGroups: createSkillGroup,
  experience: createExperienceEntry,
  publications: createPublicationEntry,
  projects: createProjectEntry,
  leadership: createLeadershipEntry,
  certifications: createCertificationEntry,
  awards: createAwardEntry,
  languages: createLanguageEntry,
  memberships: createMembershipEntry,
  teachingExperience: createTeachingEntry,
  researchExperience: createResearchExpEntry,
  conferencePresentation: createConferencePresentationEntry,
  invitedTalks: createInvitedTalkEntry,
  grantsAndFunding: createGrantEntry,
};
