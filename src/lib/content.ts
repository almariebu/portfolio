/**
 * Site copy. Written from the earlier portfolio (photo, contact, and the
 * school-ERP work) plus the current plan: one employer, no side clients,
 * freelance or contract only.
 */
export type Pending<T> = T | null;

export const site = {
  name: "Almarie Bullo",
  initials: "AB",
  photo: "/almarie.jpg",
  roles: ["Web Developer", "ERPNext Developer"],
  headlineLead: "Web developer.",
  headlineAccent: "ERPNext developer.",
  company: "Livro Systems, Inc.",
  formerCompany: "Wela School Systems",
  intro:
    "I build and improve school management and ERP systems with Python, JavaScript, Frappe, and ERPNext. Since 2020, my work has covered enrollment, billing, payments, grading, and internal workflows.",
  availability:
    "Available for remote contract and freelance work · Flexible hours · UTC+8",
  email: "almariebullo@gmail.com",
  linkedin: "https://www.linkedin.com/in/almarie-alim-bullo/",
  github: "https://github.com/almarieeebu",
  resume: "/cv.html",
  resumeDeveloper: "/cv-developer.html",
  url: "https://almariebu.vercel.app",
};

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
    title: "Interfaces and APIs",
    description:
      "I develop interfaces and APIs, troubleshoot production issues, and improve existing workflows.",
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
      "I customize ERPNext for school operations and internal staff processes: forms, workflows, reports, and permissions.",
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
  featured: boolean;
  problem: string;
  responsibility: string[];
  improvement: string;
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
      "One path from application to a finished enrollment for registrars, deans, and finance.",
    featured: true,
    problem:
      "College enrollment was split across the application, the subject list, fees, and approvals. Registrars, deans, and finance staff had no single path from a new applicant to a finished enrollment.",
    responsibility: [
      "Built the applicant form, the subject-and-fee form, and the enrolled-student form.",
      "Staff can still change a class time after the schedule is submitted.",
      "An error on the applicant record no longer shows up on the enrolled student.",
      "Approvals move from Draft through the dean, the registrar, and finance.",
      "Finance cannot lock the enrollment until the payment check passes.",
      "The subject-and-fee form enforces unit limits and the fees for that term.",
      "Running enrollment again does not wipe a student who is already enrolled.",
    ],
    improvement:
      "A student can move from application to a locked enrollment in the system. Payment and approvals are checked on the form, not over email.",
    stack: ["Frappe", "Python", "JavaScript", "MariaDB"],
    image: "/work/college.png",
    imageAlt: "College matriculation form with an approval workflow",
  },
  {
    slug: "account-closing",
    title: "Account closing and cashiering",
    category: "Billing",
    summary:
      "Cashiers can close a term and post payments when the live process was failing.",
    featured: true,
    problem:
      "At the end of a term, cashiers could not close student accounts or post payments. The errors stopped the cashier desk.",
    responsibility: [
      "Account closing now builds the student ledgers in the background.",
      "If a closing cannot start, the screen says why.",
      "Cashier updates cover the down payment and reconciliation.",
      "An extra payment stays on the student ledger instead of being dropped.",
      "A penalty is still due on the date itself, not only the day after.",
    ],
    improvement:
      "Cashiers can close accounts and post payments, including overpayments that remain on the student ledger.",
    stack: ["Frappe", "Python", "JavaScript", "SQL"],
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
      "Finance entered student discounts in more than one place and had no single view of who received one.",
    responsibility: [
      "A discount can be calculated from the full assessment or from the balance still due.",
      "A batch discount applies the same rule to many students, so finance does not rebuild the numbers in a spreadsheet.",
      "A Student Discount Summary filters by school year, semester, and discount type.",
    ],
    improvement:
      "Finance can see who received a discount and apply a batch from one screen.",
    stack: ["Frappe", "Python", "SQL", "Script Report"],
    image: "/work/discounts.png",
    imageAlt: "Student discount summary report",
  },
  {
    slug: "basic-ed-enrollment",
    title: "Basic education enrollment",
    category: "Enrollment",
    summary:
      "Registrars can enroll, continue, and withdraw a student without duplicate rows.",
    featured: false,
    problem:
      "After go-live, basic-education records drifted: the wrong incoming grade, duplicate enrollments, withdrawals that left leftover records, and class lists with old names. Registrars and teachers were working from those records.",
    responsibility: [
      "A new student keeps the incoming grade. A continuing student moves up.",
      "Withdrawing a student also clears the related records.",
      "Saving a second enrollment for the same student is blocked.",
      "The class list uses the student’s current name.",
      "Teachers only see the classes assigned to them.",
      "Leftover grades are removed when a senior-high student withdraws.",
    ],
    improvement:
      "Registrars can enroll, continue, and withdraw a student without duplicate rows or leftover grades.",
    stack: ["Frappe", "Python", "JavaScript", "Permissions"],
    image: "/work/bed.png",
    imageAlt: "Enrollees form used for basic education",
  },
  {
    slug: "roles-and-migration",
    title: "Roles and data migration",
    category: "School system",
    summary:
      "A moved site comes up with the right roles, mapped fees, and recovered files.",
    featured: false,
    problem:
      "After a version move, staff had the wrong roles, school fees did not map, and some file records had no file on disk.",
    responsibility: [
      "Default users are created with the right role profiles.",
      "The migration script maps school fees.",
      "Missing files are copied after the file list is imported, without overwriting files already there.",
    ],
    improvement:
      "A migrated site opens with usable roles, mapped fees, and a way to recover attachments.",
    stack: ["Frappe", "Python", "SQL", "Linux"],
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
      "Schools can maintain the payment methods used before enrollment.",
      "Payment links come from the school’s settings, not a hardcoded address.",
      "Online payments are pulled into school billing.",
      "A paid amount is allocated onto the student’s fees.",
    ],
    improvement:
      "A fee paid online can land on the student account without someone retyping it.",
    stack: ["Frappe", "Python", "ERPNext"],
  },
  {
    slug: "grading",
    title: "Grading",
    category: "Grading",
    summary:
      "Grade records and class lists show the current student, and the report prints.",
    featured: false,
    problem:
      "Registrars and teachers opened grade records that showed an old student name, or a senior-high grade report that would not print correctly.",
    responsibility: [
      "Fixed senior-high master grade records.",
      "Corrected a grading report field and its print format.",
      "The class list uses the student’s current full name.",
    ],
    improvement:
      "The grade record and the class list show the current name, and the senior-high report can be printed.",
    stack: ["Frappe", "Python"],
  },
  {
    slug: "sms-and-email",
    title: "SMS and email",
    category: "School system",
    summary:
      "Billing texts and email digests go out on the current sender.",
    featured: false,
    problem:
      "Billing text messages still used the old SMART sender, and some email digests sat unsent.",
    responsibility: [
      "The billing text matches what the student account shows.",
      "Text messages now go through GLOBE instead of SMART.",
      "Email digest recipients are sent through the school’s default email account.",
    ],
    improvement:
      "Schools can send the billing text and the email digest without the old sender or a stuck queue.",
    stack: ["Frappe", "Python"],
  },
  {
    slug: "erp-livro",
    title: "ERP Livro",
    category: "Internal",
    summary:
      "Staff onboarding, offboarding, and access requests in the internal ERP.",
    featured: false,
    problem:
      "Livro Systems needed employee onboarding, offboarding, and user access requests handled in the internal ERP.",
    responsibility: [
      "Assigned to the employee onboarding and offboarding process.",
      "Assigned to user access requests.",
    ],
    improvement:
      "Staff onboarding, offboarding, and access requests are handled in ERP Livro.",
    stack: ["Frappe", "ERPNext"],
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
    "I’m Almarie. I’m the full-time Product Owner in Product Development at Livro Systems, Inc. The company was Wela School Systems, where I worked as a web developer from March 2020.",
    "I was assigned to the school management system — admission, enrollment, billing, and grading — and to ERP Livro, the internal process for employee onboarding, offboarding, and user access requests.",
    "I’m starting to build my own project. I also take remote contract and freelance work, on flexible hours (UTC+8).",
  ],
  facts: [
    { label: "Experience", value: "Since March 2020" },
    { label: "Company", value: "Livro Systems, Inc. (formerly Wela)" },
    { label: "Department", value: "Product Development" },
    { label: "Now", value: "Product Owner, full-time" },
    { label: "Tools", value: "Frappe, ERPNext, Python, JavaScript" },
    { label: "New work", value: "Remote contract and freelance" },
    { label: "Hours", value: "Flexible hours, UTC+8" },
  ],
};

export const contact = {
  eyebrow: "Contact",
  title: "If you have a project",
  lead: "A web app, an ERPNext customization, or a fix on something already live. The button opens an email draft. The address below works if you prefer to write directly.",
  responseTime: "I usually reply within a few days.",
  projectTypes: [
    "Web app",
    "ERPNext customization",
    "Bug fix",
    "Report or workflow",
    "Something else",
  ],
};
