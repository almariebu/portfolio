/**
 * Site copy. Positioned as an IT professional with a web development
 * foundation, open to Web Developer, Product Owner, and Quality Assurance
 * roles. Frappe/ERPNext is part of the background, not the whole identity.
 * Tools still being learned (TypeScript, React, Tailwind, Vitest, Playwright)
 * are labelled "Currently learning", never as proven experience.
 */
export type Pending<T> = T | null;

export const site = {
  name: "Almarie Bullo",
  initials: "AB",
  photo: "/almarie.jpg",
  roles: ["Web Developer", "Product Owner", "Quality Assurance"],
  headlineLead: "Building better digital solutions.",
  headlineAccent: "Web development · Product ownership · Quality assurance",
  company: "Livro Systems, Inc.",
  formerCompany: "Wela School Systems",
  intro:
    "I'm an IT professional with 6+ years of web development experience, passionate about solving problems, improving workflows, and building useful digital solutions. I bring a strong technical foundation, a curious mindset, and a willingness to learn new technologies and explore new opportunities.",
  availability:
    "Open to Web Developer, Product Owner, and Quality Assurance roles · Remote or hybrid · UTC+8",
  email: "almariebullo@gmail.com",
  linkedin: "https://www.linkedin.com/in/almarie-alim-bullo/",
  github: "https://github.com/almariebu",
  resume: "/cv-developer.html",
  url: "https://portfolio-almariebu.vercel.app",
};

export const screenshotNote =
  "This screenshot is not the actual system. It is for visualization only.";

export type DisciplineId = "web" | "product" | "quality" | "learning";

export const disciplines: {
  id: DisciplineId;
  label: string;
  title: string;
  description: string;
  capabilities: string[];
}[] = [
  {
    id: "web",
    label: "Web development",
    title: "My core foundation",
    description:
      "6+ years building and maintaining business web applications: forms, approval workflows, billing and payment logic, reports, integrations, and data migration. Most of it on Frappe and ERPNext.",
    capabilities: [
      "Python",
      "JavaScript",
      "HTML",
      "CSS",
      "SQL",
      "MariaDB",
      "REST APIs",
      "Frappe",
      "ERPNext",
      "Git",
    ],
  },
  {
    id: "product",
    label: "Product & process",
    title: "From business need to delivered feature",
    description:
      "As Product Owner since January 2026, I turn school enrollment, billing, and payment processes into clear, deliverable tickets and work with the development team to ship them. Years of building those workflows taught me how the business runs.",
    capabilities: [
      "Requirements analysis",
      "Workflow analysis",
      "Ticket writing",
      "Stakeholder coordination",
      "Feature delivery",
    ],
  },
  {
    id: "quality",
    label: "Quality assurance",
    title: "Finding and fixing what breaks",
    description:
      "Debugging and fixing issues on live production systems, validation rules that stop bad data, and unit tests for business logic. Test plans and automated testing are what I am building on now.",
    capabilities: [
      "Debugging",
      "Production fixes",
      "Validation rules",
      "Unit tests",
      "Test plans",
    ],
  },
  {
    id: "learning",
    label: "Currently learning",
    title: "Growing beyond one stack",
    description:
      "I like learning new tools. Right now I am working through TypeScript, React, Tailwind CSS, and test automation with Vitest and Playwright, using them on the projects in this portfolio.",
    capabilities: ["TypeScript", "React", "Tailwind CSS", "Vitest", "Playwright"],
  },
];

/** The role areas a project shows evidence for. */
export type Area = "Web Development" | "Product & Process" | "Quality Assurance";

export type Project = {
  title: string;
  areas: Area[];
  problem: string;
  built: string[];
  result: string;
  stack: string[];
  liveUrl?: string;
  repoUrl: string;
  image?: string;
  imageAlt?: string;
};

export const projects: Project[] = [
  {
    title: "Frappe contract tracker",
    areas: ["Web Development", "Product & Process", "Quality Assurance"],
    problem:
      "A freelancer needs to know which quotes are approved, what has been paid, and who still owes money.",
    built: [
      "A Frappe 15 app with Client, Contract, Contract Item, and Payment doctypes. Totals, paid amount, and balance are calculated on save.",
      "Draft, Approved, and Done workflow. Only the Freelance Owner can approve, and only when the total is above zero.",
      "Payment checks: a payment needs an approved contract and cannot be more than the balance. Submitting it updates the contract balance.",
      "Owner and assistant roles, an Unpaid Contracts report, a sample data loader, and 11 unit tests for the business logic.",
    ],
    result:
      "The Unpaid Contracts report lists only approved or done contracts that still have a balance. Draft quotes and paid contracts stay off it.",
    stack: ["Python", "Frappe", "JavaScript", "MariaDB"],
    repoUrl: "https://github.com/almariebu/frappe-contract-tracker",
  },
  {
    title: "UI component kit",
    areas: ["Web Development", "Quality Assurance"],
    problem:
      "Teams that build business forms and tables need components that are consistent, keyboard accessible, and tested.",
    built: [
      "Button, Input, Modal, Table, and Toast components in React and TypeScript.",
      "Accessible by default: labelled inputs, announced errors, native dialog, sortable table headers with aria-sort, polite toast region.",
      "Responsive layout styled with Tailwind CSS, checked at phone width.",
      "19 unit tests (Vitest) and 10 end-to-end tests (Playwright).",
    ],
    result:
      "A live demo page where every component works, with tests that run on desktop and phone viewports.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Vitest", "Playwright"],
    liveUrl: "https://ui-kit-almariebu.vercel.app/",
    repoUrl: "https://github.com/almariebu/portfolio/tree/main/ui-kit",
    image: "/work/ui-kit.png",
    imageAlt: "UI kit demo with buttons, an email input, a students table, and a toast",
  },
];

export type CaseStudy = {
  slug: string;
  areas: Area[];
  title: string;
  category: string;
  summary: string;
  featured: boolean;
  problem: string;
  responsibility: string[];
  improvement: string;
  stack: string[];
  image?: string;
  imageAlt?: string;
  /** Path of an interactive browser demo for this case study. */
  demo?: string;
  /** Where this case study is built as real Frappe code (a section of the school_demo README). */
  sourceUrl?: string;
};

const schoolDemo = (anchor: string) => `https://github.com/almariebu/school_demo#${anchor}`;

export const caseStudies: CaseStudy[] = [
  {
    slug: "college-enrollment",
    areas: ["Web Development", "Product & Process"],
    title: "College admission and enrollment",
    category: "Enrollment",
    summary:
      "One path from application to a finished enrollment for registrars, deans, and finance.",
    featured: true,
    problem:
      "Enrollment was split across the application, the subject list, fees, and approvals. Registrars, deans, and finance staff had no single path from a new applicant to a finished enrollment.",
    responsibility: [
      "Three connected forms: applicant, subject-and-fee, and enrolled student.",
      "A multi-step approval workflow: Draft, dean, registrar, finance.",
      "Validation rules: unit limits, term fees, and a payment check before enrollment can be locked.",
      "Safe re-runs: running enrollment again never wipes an already-enrolled student.",
    ],
    improvement:
      "A student moves from application to a locked enrollment in one system. Payments and approvals are checked on the form, not over email.",
    stack: ["Frappe", "Python", "JavaScript", "MariaDB"],
    image: "/work/college.png",
    imageAlt: "College matriculation form with an approval workflow",
    demo: "/demo/college-enrollment",
    sourceUrl: schoolDemo("case-study-1-college-admission-and-enrollment"),
  },
  {
    slug: "account-closing",
    areas: ["Web Development", "Quality Assurance"],
    title: "Account closing and cashiering",
    category: "Billing",
    summary:
      "Cashiers can close a term and post payments when the live process was failing.",
    featured: true,
    problem:
      "At the end of each term, cashiers could not close student accounts or post payments, which stopped the cashier desk.",
    responsibility: [
      "Account closing runs in the background and builds student ledgers.",
      "Clear on-screen messages when a closing cannot start.",
      "Down payment and reconciliation updates for cashiers.",
      "Overpayments stay on the student ledger instead of being dropped.",
      "Penalty dates fixed so a penalty is due on the date itself.",
    ],
    improvement: "Cashiers can close accounts and post payments, including overpayments.",
    stack: ["Frappe", "Python", "JavaScript", "SQL"],
    image: "/work/closing.png",
    imageAlt: "Account closing form with a tellering table",
    demo: "/demo/account-closing",
    sourceUrl: schoolDemo("case-study-5-account-closing-and-cashiering"),
  },
  {
    slug: "student-discounts",
    areas: ["Web Development", "Product & Process"],
    title: "Student discounts",
    category: "Billing",
    summary:
      "Finance can see every discount and apply a batch without a spreadsheet.",
    featured: true,
    problem:
      "Finance entered discounts in several places and had no single view of who received one.",
    responsibility: [
      "Discounts calculated from the full assessment or from the remaining balance.",
      "Batch discounts that apply one rule to many students.",
      "A discount summary report filtered by school year, semester, and discount type.",
    ],
    improvement:
      "Finance can see who received a discount and apply a batch from one screen, without rebuilding numbers in a spreadsheet.",
    stack: ["Frappe", "Python", "SQL", "Reporting"],
    image: "/work/discounts.png",
    imageAlt: "Student discount summary report",
    demo: "/demo/student-discounts",
    sourceUrl: schoolDemo("case-study-6-student-discounts"),
  },
  {
    slug: "erp-livro",
    areas: ["Product & Process", "Web Development"],
    title: "ERP Livro: employee lifecycle and access",
    category: "Internal ERP",
    summary:
      "Employee onboarding, offboarding, and access requests in the internal ERP.",
    featured: true,
    problem:
      "Employee onboarding, offboarding, and user access requests needed to run in the internal ERP.",
    responsibility: [
      "Develop and maintain features for employee onboarding, offboarding, and user access requests.",
    ],
    improvement:
      "Onboarding, offboarding, and access requests are handled in ERP Livro.",
    stack: ["Frappe", "ERPNext", "Python"],
  },
  {
    slug: "basic-ed-enrollment",
    areas: ["Web Development", "Quality Assurance"],
    title: "Basic education enrollment",
    category: "Enrollment",
    summary:
      "Registrars can enroll, continue, and withdraw students without duplicate rows.",
    featured: false,
    problem:
      "Basic-education records drifted after go-live: the wrong incoming grade, duplicate enrollments, and leftover records after withdrawal.",
    responsibility: [
      "Fixed grade-level logic.",
      "Blocked duplicate enrollments.",
      "Cleaned up related records on withdrawal.",
      "Limited teachers to their own classes.",
    ],
    improvement:
      "Registrars can enroll, continue, and withdraw students without duplicate rows.",
    stack: ["Frappe", "Python", "JavaScript", "Permissions"],
    image: "/work/bed.png",
    imageAlt: "Enrollees form used for basic education",
    demo: "/demo/basic-ed-enrollment",
    sourceUrl: schoolDemo("case-study-2-basic-education-enrollment"),
  },
  {
    slug: "roles-and-migration",
    areas: ["Web Development"],
    title: "Roles and data migration",
    category: "Data",
    summary:
      "A migrated site comes up with the right roles, mapped fees, and recovered files.",
    featured: false,
    problem:
      "After a platform version upgrade, staff had the wrong roles, school fees did not map, and some file records had no file on disk.",
    responsibility: [
      "Set up default roles.",
      "Mapped school fees.",
      "Recovered missing file attachments without overwriting existing files.",
    ],
    improvement:
      "A migrated site opens with usable roles, mapped fees, and a way to recover attachments.",
    stack: ["Frappe", "Python", "SQL", "Linux"],
    image: "/work/migration.png",
    imageAlt: "Data migration screen for roles and files",
    demo: "/demo/roles-and-migration",
    sourceUrl: schoolDemo("case-study-8-roles-and-data-migration"),
  },
  {
    slug: "online-payments",
    areas: ["Web Development"],
    title: "Online payments",
    category: "Billing",
    summary:
      "A fee paid online lands on the student account without retyping.",
    featured: false,
    problem:
      "Schools collect fees online, but staff still had to retype a paid fee onto the student account.",
    responsibility: [
      "Online fee payments are pulled into billing.",
      "Paid amounts are allocated to the student's fees automatically.",
      "Payment links come from school settings, not hardcoded addresses.",
    ],
    improvement:
      "A fee paid online lands on the student account without someone retyping it.",
    stack: ["Frappe", "Python", "Payment integration"],
    demo: "/demo/online-payments",
    sourceUrl: schoolDemo("case-study-3-online-payments"),
  },
  {
    slug: "grading",
    areas: ["Web Development", "Quality Assurance"],
    title: "Grading",
    category: "Grading",
    summary:
      "Grade records and class lists show current student data, and the report prints.",
    featured: false,
    problem:
      "Registrars and teachers opened grade records that showed an old student name, or a grade report that would not print correctly.",
    responsibility: [
      "Fixed grade records and class lists.",
      "Fixed a report print format.",
    ],
    improvement:
      "Grade records, class lists, and the report show current student data.",
    stack: ["Frappe", "Python"],
    demo: "/demo/grading",
    sourceUrl: schoolDemo("case-study-7-grading"),
  },
  {
    slug: "sms-and-email",
    areas: ["Web Development"],
    title: "SMS and email notifications",
    category: "Messaging",
    summary:
      "Billing texts and email digests go out on the current sender.",
    featured: false,
    problem:
      "Billing text messages still used the old SMS provider, and some email digests sat unsent.",
    responsibility: [
      "Moved billing text messages to a new SMS provider.",
      "Fixed stuck email digests by routing them through the default email account.",
    ],
    improvement:
      "Schools can send the billing text and the email digest without the old provider or a stuck queue.",
    stack: ["Frappe", "Python", "Messaging integration"],
    demo: "/demo/sms-and-email",
    sourceUrl: schoolDemo("case-study-4-sms-and-email-notifications"),
  },
];

export const experience: {
  org: string;
  note?: string;
  roles: { title: string; dates: string; note?: string }[];
}[] = [
  {
    org: "Livro Systems, Inc.",
    roles: [
      {
        title: "Product Owner",
        dates: "January 2026 – Present",
      },
      {
        title: "Senior Web Developer",
        dates: "April 2025 – December 2025",
      },
    ],
  },
  {
    org: "Wela School Systems",
    roles: [
      {
        title: "Senior Web Developer",
        dates: "February 2024 – March 2025",
      },
      {
        title: "Mid-Senior Web Developer",
        dates: "September 2023 – February 2024",
      },
      {
        title: "Junior Web Developer",
        dates: "March 2020 – September 2023",
      },
    ],
  },
];

export const about = {
  eyebrow: "About",
  title: "IT professional, web developer since 2020",
  paragraphs: [
    "I'm an IT professional with over six years of web development experience, building and maintaining business applications that support real school operations: enrollment, billing, payments, approvals, grading, and data migration. Most of that work was on the Frappe framework and ERPNext, with Python, JavaScript, and SQL.",
    "I started as a Junior Web Developer at Wela School Systems in March 2020, grew to Senior Web Developer, and have been the Product Owner in Product Development at Livro Systems, Inc. (formerly Wela) since January 2026. That path gave me experience in development, troubleshooting live systems, and turning business needs into delivered features.",
    "My foundation is web development, but I'm not limiting myself to one framework. I'm learning new tools and growing into product ownership and software quality assurance.",
    "I'm open to Web Developer, Product Owner, or Quality Assurance roles. I value collaboration, continuous learning, clear communication, and building software that makes work easier for people.",
  ],
  facts: [
    { label: "Experience", value: "Since March 2020" },
    { label: "Company", value: "Livro Systems, Inc. (formerly Wela)" },
    { label: "Now", value: "Product Owner, full-time" },
    { label: "Development", value: "Python, JavaScript, HTML, CSS, SQL" },
    { label: "Data and APIs", value: "MariaDB, REST APIs, payment and SMS integrations" },
    { label: "Frameworks and tools", value: "Frappe, ERPNext, Git, GitHub, Linux" },
    { label: "Product and process", value: "Requirements and workflow analysis, ticket writing, delivery with developers" },
    { label: "Quality", value: "Debugging, production fixes, unit tests, test plans" },
    { label: "Currently learning", value: "TypeScript, React, Tailwind CSS, Vitest, Playwright" },
    { label: "Open to", value: "Web Developer, Product Owner, and QA roles · Remote or hybrid, UTC+8" },
  ],
};

export const contact = {
  eyebrow: "Contact",
  title: "Let's work together",
  lead: "I'm open to Web Developer, Product Owner, and Quality Assurance roles, remote or hybrid. Send me a message. The button opens an email draft. The address below works if you prefer to write directly.",
  responseTime: "I usually reply within a few days.",
  projectTypes: [
    "Job opportunity",
    "Web app",
    "Bug fix",
    "Report or workflow",
    "Something else",
  ],
};
