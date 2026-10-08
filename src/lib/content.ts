/**
 * Site copy. Positioned as a general web / software developer. Do not list
 * React, TypeScript, or Tailwind until a live project uses them.
 */
export type Pending<T> = T | null;

export const site = {
  name: "Almarie Bullo",
  initials: "AB",
  photo: "/almarie.jpg",
  roles: ["Web Developer"],
  headlineLead: "Web developer.",
  headlineAccent: "I build reliable web applications for real business workflows.",
  company: "Livro Systems, Inc.",
  formerCompany: "Wela School Systems",
  intro:
    "Web developer with 5+ years of experience building business web applications: enrollment, billing, payments, and approval workflows. Python, JavaScript, and SQL.",
  availability:
    "Open to web developer and software developer roles · Remote or hybrid · UTC+8",
  email: "almariebullo@gmail.com",
  linkedin: "https://www.linkedin.com/in/almarie-alim-bullo/",
  github: "https://github.com/almarieeebu",
  resume: "/cv.html",
  resumeDeveloper: "/cv-developer.html",
  url: "https://portfolio-almariebu.vercel.app",
};

export const screenshotNote =
  "This screenshot is not the actual system. It is for visualization only.";

export type DisciplineId = "frontend" | "backend" | "workflows" | "practice";

export const disciplines: {
  id: DisciplineId;
  label: string;
  title: string;
  description: string;
  capabilities: string[];
}[] = [
  {
    id: "frontend",
    label: "Frontend",
    title: "Interfaces people can use",
    description:
      "Responsive, accessible interfaces with HTML5, CSS, and JavaScript. Reusable components, clean layouts, and attention to detail.",
    capabilities: ["HTML5", "CSS", "JavaScript", "Responsive layouts"],
  },
  {
    id: "backend",
    label: "Backend and data",
    title: "Services and databases",
    description:
      "Python services, SQL databases (MariaDB), permissions, background jobs, and integrations with payment and messaging providers.",
    capabilities: [
      "Python",
      "SQL",
      "MariaDB",
      "REST APIs",
      "Background jobs",
      "Permissions",
    ],
  },
  {
    id: "workflows",
    label: "Business workflows",
    title: "From messy problem to daily tool",
    description:
      "Multi-step approvals, validation rules, billing and payment logic, reports, and data migration. I work from a messy real-world problem to something staff can use daily.",
    capabilities: ["Approvals", "Validation", "Billing", "Reports", "Migration"],
  },
  {
    id: "practice",
    label: "How I work",
    title: "Careful and clear",
    description:
      "Git and GitHub, careful debugging, clear written communication, and testing what I build.",
    capabilities: ["Git", "GitHub", "Debugging", "Testing"],
  },
];

export type CaseStudy = {
  slug: string;
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
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "college-enrollment",
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
    stack: ["Python", "JavaScript", "MariaDB"],
    image: "/work/college.png",
    imageAlt: "College matriculation form with an approval workflow",
    demo: "/demo/college-enrollment",
  },
  {
    slug: "account-closing",
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
    stack: ["Python", "JavaScript", "SQL"],
    image: "/work/closing.png",
    imageAlt: "Account closing form with a tellering table",
  },
  {
    slug: "student-discounts",
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
    stack: ["Python", "SQL", "Reporting"],
    image: "/work/discounts.png",
    imageAlt: "Student discount summary report",
  },
  {
    slug: "basic-ed-enrollment",
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
    stack: ["Python", "JavaScript", "Permissions"],
    image: "/work/bed.png",
    imageAlt: "Enrollees form used for basic education",
    demo: "/demo/basic-ed-enrollment",
  },
  {
    slug: "roles-and-migration",
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
    stack: ["Python", "SQL", "Linux"],
    image: "/work/migration.png",
    imageAlt: "Data migration screen for roles and files",
  },
  {
    slug: "online-payments",
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
    stack: ["Python", "Payment integration"],
  },
  {
    slug: "grading",
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
    stack: ["Python"],
  },
  {
    slug: "sms-and-email",
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
    stack: ["Python", "Messaging integration"],
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
  title: "Web developer since 2020",
  paragraphs: [
    "I'm a web developer with 5+ years of experience building and maintaining business applications for schools: enrollment, billing, payments, grading, and internal workflows. Most of that work was on the Frappe framework with Python, JavaScript, and SQL.",
    "I'm now the Product Owner in Product Development at Livro Systems, Inc., formerly Wela School Systems, where I started as a web developer in March 2020.",
    "I enjoy turning unclear requirements into software that people can rely on, and I care about clean code, small details, and clear communication.",
  ],
  facts: [
    { label: "Experience", value: "Since March 2020" },
    { label: "Company", value: "Livro Systems, Inc. (formerly Wela)" },
    { label: "Now", value: "Product Owner, full-time" },
    { label: "Frontend", value: "HTML5, CSS, JavaScript" },
    { label: "Backend", value: "Python, SQL, MariaDB, REST APIs, background jobs" },
    { label: "Tools", value: "Git, GitHub, Linux" },
    { label: "Also", value: "Frappe framework" },
    { label: "Hours", value: "Remote or hybrid, UTC+8" },
  ],
};

export const contact = {
  eyebrow: "Contact",
  title: "Let's work together",
  lead: "I'm open to web developer and software developer roles, remote or hybrid. Send me a message. The button opens an email draft. The address below works if you prefer to write directly.",
  responseTime: "I usually reply within a few days.",
  projectTypes: [
    "Job opportunity",
    "Web app",
    "Bug fix",
    "Report or workflow",
    "Something else",
  ],
};
