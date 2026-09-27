/**
 * Site copy. Written from the earlier portfolio (photo, contact, and the
 * school-ERP work) plus the current plan: one employer, no side clients,
 * freelance or contract only.
 */
export type Pending<T> = T | null;

export const site = {
  name: "Almarie Bu",
  initials: "AB",
  photo: "/almarie.jpg",
  roles: ["Web Developer", "ERPNext Developer"],
  headlineLead: "Web developer.",
  headlineAccent: "ERPNext developer.",
  company: "Livro Systems, Inc.",
  formerCompany: "Wela School Systems",
  intro:
    "Full-time web developer at Livro Systems, Inc. since March 2020. It was Wela School Systems before the rename. I am in Product Development, on the school system and ERP Livro. New work is contract and freelance only. I can take more than one of those, on flexi time or a night shift in Philippine time. I’m starting to build my own project.",
  availability: "Full-time at Livro · open to contract and freelance",
  email: "almariebullo@gmail.com",
  linkedin: "https://www.linkedin.com/in/almarie-alim-bullo/",
  github: "https://github.com/almarieeebu",
  resume: null as Pending<string>,
  url: "https://almariebu.vercel.app",
};

export const snapshot = [
  { value: "Since 2020", label: "Experience" },
  { value: "Full-time", label: "Livro Systems" },
  { value: "Contract / freelance", label: "New work" },
];

export const screenshotNote =
  "This screenshot is not the actual system. It is for visualization only.";

export type DisciplineId = "web" | "erp";

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
    title: "Screens, APIs, and fixes",
    description:
      "I build the pages and APIs people use, then I fix them when something breaks in real use.",
    capabilities: [
      "JavaScript",
      "HTML / CSS",
      "Next.js",
      "REST APIs",
      "Bug fixes",
    ],
  },
  {
    id: "erp",
    label: "ERPNext development",
    title: "Frappe and ERPNext",
    description:
      "I customize ERPNext for the school system and for ERP Livro: forms, scripts, workflows, reports, and permissions.",
    capabilities: [
      "DocTypes",
      "Python",
      "Client and Server Scripts",
      "Reports",
      "Workflows",
      "Permissions",
    ],
  },
];

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  did: string[];
  outcome: string;
  stack: string[];
  image?: string;
  imageAlt?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "college-enrollment",
    title: "College admission and enrollment",
    category: "Enrollment",
    summary:
      "Part of the school management system at Livro Systems. College enrollment was split across applicant, subjects, fees, and approvals. I built the forms and the path so a student can move from application to a locked enrollment.",
    did: [
      "Applicant, matriculation, and enrollee forms.",
      "Sectioning, including a fix so the class time can change after submit.",
      "Student applicant errors that were landing on the enrollee.",
      "Workflow from Draft through Dean, Registrar, and Finance.",
      "A payment check before finance can lock the record.",
      "Unit limits and term fee rules on the matriculation form.",
      "A fix so an existing enrollee is not reset when enrollment runs again.",
    ],
    outcome:
      "Enrollment stays in the system. Payment and approvals are checked on the form, not in email.",
    stack: ["Frappe", "Python", "JavaScript", "MariaDB"],
    image: "/work/college.png",
    imageAlt: "College matriculation form with an approval workflow",
  },
  {
    slug: "account-closing",
    title: "Account closing and cashiering",
    category: "Billing",
    summary:
      "Billing on the school system. Term closing and cashier payments were failing in production. I worked on account closing, tellering, and overpayments so cashiers could finish the work.",
    did: [
      "Account closing that creates student ledgers in the background.",
      "A clearer error when a closing cannot start.",
      "Tellering updates for downpayment and reconciliation.",
      "Student overpayment, so extra payment stays on the ledger.",
      "Penalty due dates that include the same day.",
    ],
    outcome:
      "Cashiers can close accounts and post payments without the error that was blocking them.",
    stack: ["Frappe", "Python", "JavaScript", "SQL"],
    image: "/work/closing.png",
    imageAlt: "Account closing form with a tellering table",
  },
  {
    slug: "student-discounts",
    title: "Student discounts",
    category: "Billing",
    summary:
      "Billing on the school system. Discounts were entered in a few places, and finance had no single view. I added batch discounts and a summary report.",
    did: [
      "Discount calculated from the total assessment or from what is left to pay.",
      "A batch discount so finance does not rebuild the numbers in a spreadsheet.",
      "Student Discount Summary, with filters for school year, semester, and discount type.",
    ],
    outcome:
      "Finance can see who received a discount and apply a batch from one place.",
    stack: ["Frappe", "Python", "SQL", "Script Report"],
    image: "/work/discounts.png",
    imageAlt: "Student discount summary report",
  },
  {
    slug: "basic-ed-enrollment",
    title: "Basic education enrollment",
    category: "Enrollment",
    summary:
      "Enrollment on the school system. Basic-education records drifted after go-live: wrong incoming level, duplicate enrollees, withdrawals that left leftovers, and class lists with old names.",
    did: [
      "Incoming level stays for new students and moves up for continuing students.",
      "A withdraw flow that cleans related records.",
      "A check that blocks a duplicate enrollee on save.",
      "Class list uses the student’s current name.",
      "Teachers only receive the classes they should see.",
      "Leftover grades are removed when a senior-high student withdraws.",
    ],
    outcome:
      "Registrars can enroll, continue, and withdraw a student without duplicate rows.",
    stack: ["Frappe", "Python", "JavaScript", "Permissions"],
    image: "/work/bed.png",
    imageAlt: "Enrollees form used for basic education",
  },
  {
    slug: "roles-and-migration",
    title: "Roles and data migration",
    category: "School system",
    summary:
      "School system upkeep. After a version move, users had the wrong roles, school fees did not map, and some file records had no file on disk.",
    did: [
      "Default users created with the right role profiles.",
      "School-fee mapping in the migration script.",
      "A step that copies missing files after the file list is imported, without overwriting files already there.",
    ],
    outcome:
      "A migrated site comes up with usable roles, mapped fees, and a way to recover attachments.",
    stack: ["Frappe", "Python", "SQL", "Linux"],
    image: "/work/migration.png",
    imageAlt: "Data migration screen for roles and files",
  },
  {
    slug: "online-payments",
    title: "Online payments",
    category: "Billing",
    summary:
      "Schools collect fees online. I worked on the payment links, pulling those payments into the school, and allocating them on the student ledger.",
    did: [
      "Pre-enrollment payment methods the school can maintain.",
      "Payment links taken from environment settings.",
      "A pull of online payments into school billing.",
      "Auto-allocation of an online payment onto the student’s fees.",
    ],
    outcome:
      "A fee paid online can land on the student account without someone retyping it.",
    stack: ["Frappe", "Python", "ERPNext"],
  },
  {
    slug: "grading",
    title: "Grading",
    category: "Grading",
    summary:
      "Grading sits in the same school system. I fixed the parts that broke in use: senior-high master grades, a grading report, and class lists that showed the wrong name.",
    did: [
      "Senior-high master grade fixes.",
      "A grading report field and print format.",
      "Class list uses the student’s current full name.",
    ],
    outcome:
      "The grade record and the class list can be opened without the old name or a broken report.",
    stack: ["Frappe", "Python"],
  },
  {
    slug: "sms-and-email",
    title: "SMS and email",
    category: "School system",
    summary:
      "Billing notices and school messages. I worked on SMS blast billing, the change from SMART to GLOBE, and email digests.",
    did: [
      "SMS blast billing so the message matches the account.",
      "SMS API calls switched from SMART to GLOBE.",
      "Email digest recipients sent through the default email account.",
    ],
    outcome:
      "Schools can send the billing SMS and the email digest without the old sender or a stuck queue.",
    stack: ["Frappe", "Python"],
  },
  {
    slug: "erp-livro",
    title: "ERP Livro",
    category: "Internal",
    summary:
      "The internal ERP at Livro Systems. I was assigned to the employee onboarding and offboarding process, and to user access requests.",
    did: [
      "Employee onboarding and offboarding.",
      "User access requests.",
    ],
    outcome:
      "Staff onboarding, offboarding, and access requests are handled in ERP Livro.",
    stack: ["Frappe", "ERPNext"],
  },
];

export const experience: {
  org: string;
  roles: { title: string; dates: string; note?: string }[];
}[] = [
  {
    org: "Livro Systems, Inc.",
    roles: [
      {
        title: "Web Developer",
        dates: "September 2026 – Present",
        note: "Restructure. The Product Owner role was removed for redundancy.",
      },
      {
        title: "Product Owner",
        dates: "January 2026 – October 2026",
      },
    ],
  },
  {
    org: "Wela School Systems",
    roles: [
      {
        title: "Senior Web Developer",
        dates: "February 2024 – December 2025",
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
    "I’m Almarie. I’m a full-time web developer in Product Development at Livro Systems, Inc. The company was Wela School Systems. Same place since March 2020.",
    "I was assigned to the school management system — admission, enrollment, billing, and grading — and to ERP Livro, the internal process for employee onboarding, offboarding, and user access requests.",
    "I’m starting to build my own project. New work I take is contract and freelance only. I can take more than one project, on flexi time or a night shift in Philippine time.",
  ],
  facts: [
    { label: "Experience", value: "Since March 2020" },
    { label: "Company", value: "Livro Systems, Inc. (formerly Wela)" },
    { label: "Department", value: "Product Development" },
    { label: "Now", value: "Web Developer, full-time" },
    { label: "Tools", value: "Frappe, ERPNext, Python, JavaScript" },
    { label: "New work", value: "Contract and freelance only" },
    { label: "Hours for new work", value: "Flexi time or night shift, PH time" },
  ],
};

export const contact = {
  eyebrow: "Contact",
  title: "If you have a project",
  lead: "Send a contract or freelance project: a web app, an ERPNext customization, or a fix on something already live. I can take more than one. I’m full-time at Livro, so those hours are flexi time or a night shift, Philippine time.",
  responseTime: "I usually reply within a few days.",
  projectTypes: [
    "Web app",
    "ERPNext customization",
    "Bug fix",
    "Report or workflow",
    "Something else",
  ],
};
