export type RoleId = "web" | "frappe";

export const roles: RoleId[] = ["web", "frappe"];

export const site = {
  name: "Almarie Bu",
  tagline:
    "Web Developer and ERP Developer specializing in Frappe Framework and ERPNext.",
  intro:
    "I build, customize, maintain, and troubleshoot business applications based on real operational requirements.",
  body: "I work with business and operations teams, then turn those requirements into practical technical solutions.",
  email: "almariebullo@gmail.com",
  linkedin: "https://www.linkedin.com/in/almarie-alim-bullo/",
  github: "https://github.com/almariebu",
  photo: "/almarie.jpg",
};

export const roleMeta: Record<
  RoleId,
  {
    path: string;
    label: string;
    title: string;
    short: string;
    accent: string;
    summary: string;
  }
> = {
  web: {
    path: "WEB",
    label: "Web Developer",
    title: "Web Developer",
    short: "Web Development",
    accent: "Applications that ship",
    summary:
      "I build practical web applications around real business workflows.",
  },
  frappe: {
    path: "ERP",
    label: "ERP Developer",
    title: "Frappe / ERPNext Developer",
    short: "Frappe / ERPNext",
    accent: "Systems that fit",
    summary:
      "I customize, maintain, and troubleshoot ERPNext around how operations actually run.",
  },
};

export const disciplines: Record<
  RoleId,
  {
    title: string;
    description: string;
    focus: string[];
  }
> = {
  web: {
    title: "Web Development",
    description:
      "I build and maintain web applications, APIs, and the interfaces teams use every day.",
    focus: [
      "Web application development",
      "HTML / CSS / JavaScript",
      "REST APIs and integrations",
      "Backend and frontend work",
      "Bug fixing and maintenance",
    ],
  },
  frappe: {
    title: "Frappe / ERPNext",
    description:
      "I customize ERPNext and the Frappe Framework to match operational requirements — not the other way around.",
    focus: [
      "ERPNext customization",
      "Custom DocTypes and business logic",
      "Client Scripts and Server Scripts",
      "Custom reports and dashboards",
      "Workflow and permission configuration",
      "Business process automation",
      "Database queries and troubleshooting",
    ],
  },
};

export const processSteps = [
  {
    id: "01",
    title: "Understand",
    description:
      "Learn the operational problem, the people doing the work, and the current workflow.",
  },
  {
    id: "02",
    title: "Define",
    description:
      "Turn requirements into DocTypes, workflows, permissions, or application scope.",
  },
  {
    id: "03",
    title: "Build",
    description:
      "Customize ERPNext or develop the web application against the agreed requirements.",
  },
  {
    id: "04",
    title: "Launch",
    description:
      "Test, deploy, and check permissions so the system is ready for real use.",
  },
  {
    id: "05",
    title: "Maintain",
    description:
      "Fix bugs, write queries, and keep improving the system after it is live.",
  },
];

export type Project = {
  id: string;
  role: RoleId;
  category: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  liveUrl?: string;
  problem: string;
  roleDetail: string;
  solution: string[];
  result: string;
  technical: string[];
};

export const projects: Project[] = [
  {
    id: "college-enrollment",
    role: "frappe",
    category: "Confidential — education ERP",
    title: "College enrollment and matriculation",
    description:
      "Built the college enrollment path on Frappe: Applicant, Matriculation, and Enrollees. Workflows run Draft through Dean, Registrar, and Finance. I added initial-payment checks, unit limits, term fee strategies, Client Scripts, and a hotfix so an existing enrollee is not reverted.",
    tags: ["Frappe", "Python", "JavaScript", "Workflows", "MariaDB"],
    image: "/work/college.png",
    imageAlt: "College matriculation form with workflow and subject list",
    problem:
      "College enrollment was not one reliable path. Applicant, subjects, fees, approvals, and the enrollee record could fail independently — finance could approve without payment, unit limits were easy to miss, and an existing enrollee could have its status reverted.",
    roleDetail:
      "I owned the college registration DocTypes and Client Scripts: Applicant, Matriculation, and Enrollees. That included workflow states, payment and unit validation, term fee strategies, and production hotfixes.",
    solution: [
      "Workflow from Draft through Dean, Registrar, and Finance to Approved (Locked).",
      "Initial-payment checks before finance can lock the record.",
      "Unit limits and subject approval on the matriculation form.",
      "Term fee strategies: gross split, net split, upfront downpayment, percentage, front-loaded, and custom amounts.",
      "Hotfix so an existing college enrollee is not reverted when enrollment runs again.",
    ],
    result:
      "A student can move from application to a locked enrollment with payment and approvals enforced in the DocType, not in email or chat.",
    technical: [
      "DocTypes: College Applicant, College Matriculation, College Enrollees.",
      "Server logic in college_matriculation.py / service / repository; Client Script for registrar and finance actions.",
      "term_calculation_strategy.py for school-specific term fee rules.",
      "Frappe Workflow fixture for Dean → Registrar → Finance → Locked.",
      "Enrollment Count report for operations.",
    ],
  },
  {
    id: "account-closing",
    role: "frappe",
    category: "Confidential — education ERP",
    title: "Account closing and cashiering",
    description:
      "Made term closing and cashiering reliable in production. I worked on Account Closing, ledger generation, Tellering, Student Overpayment, and penalty due dates — including queued jobs, clearer errors, and the fix for closings that would not create.",
    tags: ["Frappe", "Python", "JavaScript", "SQL", "MariaDB"],
    image: "/work/closing.png",
    imageAlt: "Account closing and tellering interface",
    problem:
      "Finance could not reliably close a term. Ledger generation failed, leftover records blocked a new closing, tellering and overpayments drifted from the student ledger, and cashiers saw an error instead of a created closing.",
    roleDetail:
      "I worked on Account Closing and Generate Account Closing, Tellering, Student Overpayment, and penalty due-date logic — both the Python services and the Client Scripts cashiers use.",
    solution: [
      "Generate Account Closing creates ledgers, removes related leftovers, and queues work instead of blocking the desk.",
      "Clearer errors when a closing document is missing before enqueue.",
      "Tellering updates for downpayment ledger, reconciliation, and transaction order.",
      "Student Overpayment DocType and flow so excess payments stay on the ledger.",
      "Penalty due dates include today so same-day dues are not skipped.",
    ],
    result:
      "Cashiers can close accounts and post payments without the “unable to create account closing” failure that was hitting production.",
    technical: [
      "DocTypes: Account Closing, Generate Account Closing, Tellering, Student Overpayment.",
      "Service / repository / API split; frappe.enqueue for ledger creation.",
      "Student ledger JSON fields for transaction_order and is_reconciled.",
      "Penalty task updates in school_penalty.",
    ],
  },
  {
    id: "discount-reporting",
    role: "frappe",
    category: "Confidential — education ERP",
    title: "Student discounts and reporting",
    description:
      "Discounts were applied in matriculation, batch adjustments, and the ledger with no single view. I added discount calculation strategies, direct discount on batch ledger adjustment, and a Student Discount Summary report so finance can see what was allocated.",
    tags: ["Frappe", "Python", "SQL", "Script Reports"],
    image: "/work/discounts.png",
    imageAlt: "Student discount summary report table",
    problem:
      "Discounts were entered in matriculation, batch ledger adjustment, and the student ledger. Finance could not see who received what, or apply a batch discount without breaking remaining balances.",
    roleDetail:
      "I implemented the discount calculation strategies, direct discount on Batch Ledger Adjustment, and the Student Discount Summary Script Report (repository, service, filters).",
    solution: [
      "Discount strategies by total assessment and by remaining balance.",
      "Direct discount on Batch Ledger Adjustment so finance can apply a batch without a spreadsheet.",
      "Student Discount Summary report with school year, semester, student, and discount-type filters.",
      "College revenue report sort fix so null keys do not break the list.",
    ],
    result:
      "Finance can run one report for allocated discounts and apply batch discounts without rebuilding the numbers by hand.",
    technical: [
      "Script Report: Student Discount Summary (repository + service).",
      "utils/discount.py and discount_strategy.py.",
      "Batch Ledger Adjustment on_submit for discount-type entries.",
      "Reads College Matriculation discount_table, adjustments, and Student Ledger allocations.",
    ],
  },
  {
    id: "basic-ed-enrollment",
    role: "frappe",
    category: "Confidential — education ERP",
    title: "Basic education enrollment and withdrawals",
    description:
      "Kept basic-education enrollment accurate in production: incoming level for continuing students, withdraw-enrollment, duplicate enrollee fixes, class-list full names, and Teaching Staff permission checks so teachers only get the classes they should see.",
    tags: ["Frappe", "Python", "JavaScript", "Permissions", "MariaDB"],
    image: "/work/bed.png",
    imageAlt: "Enrollees form with class list and withdraw action",
    problem:
      "Basic-education records drifted in production: continuing students kept the wrong incoming level, withdrawals left leftover grades or duplicates, class lists showed stale names, and teachers could receive permissions they should not have.",
    roleDetail:
      "I fixed and extended Enrollees, withdrawal APIs, class-list names, subject user permissions, and Teaching Staff role checks on the basic-education Frappe app.",
    solution: [
      "Incoming level stays for New students and increments for Continuing.",
      "Withdraw-enrollment flow that cleans related records instead of leaving orphans.",
      "Duplicate enrollee guard on save.",
      "Class list uses the current full name from the student record.",
      "Teaching Staff role check before assigning class and section permissions.",
      "Async deletion of master grades for senior-high withdrawals.",
    ],
    result:
      "Registrars can enroll, continue, and withdraw students without duplicate rows or teachers seeing the wrong class list.",
    technical: [
      "Enrollees DocType and enrollees_api.py withdrawal methods.",
      "Client Script actions for withdraw and class-list refresh.",
      "User Permission updates gated on Teaching Staff.",
      "Queued job for senior-high master grade cleanup.",
    ],
  },
  {
    id: "roles-migration",
    role: "frappe",
    category: "Confidential — education ERP",
    title: "Roles, data migration, and file recovery",
    description:
      "On shared Frappe utilities I added role-profile sync for default users, school-fee mapping during data migration, and a file-pull step after SQL File-list copies so attachments are not left behind as empty metadata.",
    tags: ["Frappe", "Python", "SQL", "Roles", "Linux"],
    image: "/work/migration.png",
    imageAlt: "Data migration screen with role sync and file pull",
    problem:
      "After a version move, sites had users without the right role profiles, school fees that did not map, and File list rows with no file on disk — metadata copied, attachments missing.",
    roleDetail:
      "I added default-user and role-profile sync, school-fee mapping in the migration script, and an optional pull-files-from-source step after the File list SQL copy.",
    solution: [
      "Default users created from JSON config, with role profiles synced before the user is created.",
      "School-fee mapping and transform in the data migration script.",
      "After File list SQL, techs can copy missing disk files onto the current site without overwriting existing files.",
      "Encrypted student code when sending an account.",
    ],
    result:
      "A migrated site comes up with usable roles, mapped fees, and a way to recover attachments instead of empty File rows.",
    technical: [
      "ensure_role_profile and run_set_default_users in shared utilities.",
      "Migration mapping table for school fees.",
      "File-pull after tabFile SQL; logs errors instead of silent pass.",
      "Linux path copy; does not call file_upload_to_s3 or overwrite existing files.",
    ],
  },
  {
    id: "ahon",
    role: "web",
    category: "Web Application",
    title: "Ahon",
    description:
      "A web app for tracking cash, savings, and utang. I designed the data model, built the ledger and budget workflows, and deployed it with authentication and cloud sync.",
    tags: ["JavaScript", "Next.js", "HTML / CSS", "REST APIs"],
    image: "/work/ahon.png",
    imageAlt: "Ahon home dashboard with budget and ledger",
    liveUrl: "https://ahon.almariedev.com/",
    problem:
      "Household cash, savings (tigum), and utang lived in notes and mental math. There was no single ledger that could show budget versus actual, or whether the month could cover essentials and debt dues.",
    roleDetail:
      "I designed the data model, built the UI (Home, Ledger, Budget, Utang, Tigum), added auth and cloud sync, and deployed the app.",
    solution: [
      "Ledger for income, expense, transfer, and utang payment.",
      "Period budgets compared to actuals on Home.",
      "Utang schedules and tigum (savings) that also write ledger rows.",
      "Auth and Postgres sync so the books are not only in the browser.",
      "Monthly survival view: income versus essentials and debt dues.",
    ],
    result:
      "A working public app at ahon.almariedev.com — ledger, budget, and debt in one place, with cloud sync for the people who need it.",
    technical: [
      "Next.js, React, TypeScript, HTML/CSS.",
      "localStorage first, then Supabase Auth + Postgres with RLS.",
      "Accounts, categories, particulars, budget periods, transactions.",
      "Balance adjustments post a ledger row instead of silently changing opening balance.",
    ],
  },
];

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}

export const principles = [
  {
    title: "Business first.",
    description: "Technology should solve an operational problem.",
  },
  {
    title: "Build from the workflow.",
    description: "I start with how the work is actually done.",
  },
  {
    title: "Systems matter.",
    description: "Good tools need reliable data and permissions behind them.",
  },
  {
    title: "Keep it maintainable.",
    description: "Simple, clear implementations last longer in production.",
  },
];

export const tools = [
  {
    id: "frappe" as const,
    category: "ERP",
    items: ["Frappe Framework", "ERPNext", "Python", "SQL / MariaDB"],
  },
  {
    id: "web" as const,
    category: "Development",
    items: ["JavaScript", "HTML / CSS", "REST APIs", "Git / GitHub"],
  },
  {
    id: "systems" as const,
    category: "Systems",
    items: [
      "Linux",
      "Backend & frontend",
      "Database troubleshooting",
      "Production support",
    ],
  },
];

export const about = {
  lead: "I am a Web Developer and ERP Developer specializing in Frappe Framework and ERPNext.",
  body: "I build, customize, maintain, and troubleshoot business applications based on real operational requirements. Working with business and operations teams helps me translate those requirements into practical technical solutions.",
  close:
    "I am looking for opportunities as a Frappe/ERPNext Developer, ERP Developer, Python Developer, Web Developer, or Full-Stack Developer.",
};

export const roleHeroCopy: Record<
  RoleId | "default",
  { headline: string; support: string }
> = {
  default: {
    headline:
      "Web Developer and ERP Developer specializing in Frappe Framework and ERPNext.",
    support:
      "I build, customize, maintain, and troubleshoot business applications based on real operational requirements.",
  },
  web: {
    headline: "I build web applications around real workflows.",
    support:
      "From interfaces to APIs and maintenance, I develop practical systems teams can rely on.",
  },
  frappe: {
    headline: "I customize ERPNext around how operations actually run.",
    support:
      "DocTypes, scripts, workflows, reports, and permissions — built from the requirement, not the other way around.",
  },
};
