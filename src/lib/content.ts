export type RoleId = "product" | "web" | "frappe";

export const roles: RoleId[] = ["product", "web", "frappe"];

export const site = {
  name: "Almarie Bu",
  tagline: "I turn business problems into working digital products.",
  intro:
    "I work across product strategy, web development, and Frappe ERP to help teams turn ideas into practical systems.",
  body: "From defining what should be built to developing the solution and improving it after launch, I bring product thinking and technical execution into the same workflow.",
  email: "hello@almariebu.com",
  linkedin: "https://linkedin.com",
  github: "https://github.com",
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
  product: {
    path: "PRODUCT",
    label: "Product Owner",
    title: "Product Owner",
    short: "Product Ownership",
    accent: "Strategy into delivery",
    summary:
      "I translate business needs into clear product requirements, prioritized backlogs, and actionable delivery plans.",
  },
  web: {
    path: "WEB",
    label: "Web Developer",
    title: "Web Developer",
    short: "Web Development",
    accent: "Interfaces that ship",
    summary:
      "I build practical web experiences that solve real business problems.",
  },
  frappe: {
    path: "ERP",
    label: "Frappe Consultant",
    title: "Frappe ERP Consultant",
    short: "Frappe ERP Consulting",
    accent: "Systems that fit",
    summary:
      "I help businesses adapt Frappe and ERPNext to their operational workflows.",
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
  product: {
    title: "Product Ownership",
    description:
      "I translate business needs into clear product requirements, prioritized backlogs, and actionable delivery plans.",
    focus: [
      "Product discovery",
      "Requirements",
      "Backlog management",
      "Sprint planning",
      "Release management",
      "Stakeholder coordination",
    ],
  },
  web: {
    title: "Web Development",
    description:
      "I build practical web experiences that solve real business problems.",
    focus: [
      "Web applications",
      "Responsive interfaces",
      "APIs and integrations",
      "Business tools",
      "System maintenance",
      "Deployment",
    ],
  },
  frappe: {
    title: "Frappe ERP Consulting",
    description:
      "I help businesses adapt Frappe and ERPNext to their operational workflows.",
    focus: [
      "ERPNext implementation",
      "Frappe customization",
      "Workflow design",
      "Reports and dashboards",
      "Roles and permissions",
      "Business process automation",
    ],
  },
};

export const processSteps = [
  {
    id: "01",
    title: "Discover",
    description:
      "Understand the business problem, users, workflows, and desired outcome.",
  },
  {
    id: "02",
    title: "Define",
    description:
      "Turn requirements into product scope, workflows, priorities, and technical direction.",
  },
  {
    id: "03",
    title: "Build",
    description:
      "Develop the product, web application, or ERP solution around the agreed requirements.",
  },
  {
    id: "04",
    title: "Launch",
    description:
      "Coordinate releases, deployments, testing, and production readiness.",
  },
  {
    id: "05",
    title: "Improve",
    description:
      "Use feedback, issues, and operational data to continuously improve the solution.",
  },
];

export const projects: Record<
  RoleId,
  {
    title: string;
    description: string;
    tags: string[];
    href: string;
  }
> = {
  product: {
    title: "Product Development",
    description:
      "A product lifecycle case study covering requirements, prioritization, development, release coordination, and continuous improvement.",
    tags: ["Product Ownership", "Requirements", "Release Management"],
    href: "#contact",
  },
  web: {
    title: "Web Application",
    description:
      "A practical web solution designed around a real business workflow.",
    tags: ["Web Development", "UI", "APIs", "Deployment"],
    href: "#contact",
  },
  frappe: {
    title: "Frappe ERP Solution",
    description:
      "A Frappe or ERPNext implementation focused on improving business workflows and operational efficiency.",
    tags: ["Frappe", "ERPNext", "Customization", "Automation"],
    href: "#contact",
  },
};

export const principles = [
  {
    title: "Business first.",
    description: "Technology should solve a problem.",
  },
  {
    title: "Product always.",
    description: "Every feature should have a purpose.",
  },
  {
    title: "Systems matter.",
    description: "Good products need reliable systems behind them.",
  },
  {
    title: "Build with clarity.",
    description: "Simple workflows create better experiences.",
  },
];

export const tools = [
  {
    id: "product" as const,
    category: "Product",
    items: [
      "Product Discovery",
      "Requirements",
      "Backlog Management",
      "Agile",
      "Release Management",
    ],
  },
  {
    id: "web" as const,
    category: "Development",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "APIs",
      "Git",
    ],
  },
  {
    id: "frappe" as const,
    category: "ERP",
    items: [
      "Frappe Framework",
      "ERPNext",
      "Python",
      "MariaDB",
      "Redis",
    ],
  },
  {
    id: "infra" as const,
    category: "Infrastructure",
    items: [
      "Linux",
      "Docker",
      "CI/CD",
      "Cloud Infrastructure",
      "Production Support",
    ],
  },
];

export const about = {
  lead: "I work at the intersection of product, technology, and business operations.",
  body: "My work focuses on turning complex requirements into structured products and reliable systems.",
  close: "I enjoy solving problems that require both strategic thinking and technical execution.",
};

export const roleHeroCopy: Record<
  RoleId | "studio",
  { headline: string; support: string }
> = {
  studio: {
    headline: "I turn business problems into working digital products.",
    support:
      "I work across product strategy, web development, and Frappe ERP to help teams turn ideas into practical systems.",
  },
  product: {
    headline: "I turn business needs into products that ship.",
    support:
      "Discovery, requirements, backlog, and release — product ownership that keeps delivery aligned with outcomes.",
  },
  web: {
    headline: "I build web products that solve real workflows.",
    support:
      "From responsive interfaces to APIs and deployment, I develop practical systems teams can rely on.",
  },
  frappe: {
    headline: "I shape Frappe and ERPNext around how teams work.",
    support:
      "Implementation, customization, and automation that fit operational reality — not the other way around.",
  },
};
