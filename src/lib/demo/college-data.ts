import { WORKFLOW_STATES, type WorkflowState } from "./logic.ts";

export const TERM = {
  name: "2026-2027 · 1st Semester",
  maxUnits: 24,
  tuitionPerUnit: 550,
  requiredDownpayment: 5000,
};

export const MISC_FEES: { name: string; amount: number }[] = [
  { name: "Registration", amount: 500 },
  { name: "Library", amount: 300 },
  { name: "Laboratory", amount: 1200 },
  { name: "Athletics", amount: 250 },
  { name: "Student Council", amount: 150 },
  { name: "ID and Handbook", amount: 200 },
];

export const PROGRAMS: Record<string, string> = {
  BSIT: "BS Information Technology",
  BSBA: "BS Business Administration",
  BEED: "Bachelor of Elementary Education",
};

export type Subject = {
  code: string;
  title: string;
  units: number;
  program: string | null;
};

export const SUBJECTS: Subject[] = [
  { code: "IT101", title: "Introduction to Computing", units: 3, program: "BSIT" },
  { code: "IT102", title: "Computer Programming 1", units: 3, program: "BSIT" },
  { code: "GE101", title: "Understanding the Self", units: 3, program: null },
  { code: "GE102", title: "Readings in Philippine History", units: 3, program: null },
  { code: "GE103", title: "Mathematics in the Modern World", units: 3, program: null },
  { code: "FIL101", title: "Kontekstwalisadong Komunikasyon sa Filipino", units: 3, program: null },
  { code: "PE101", title: "Physical Fitness and Wellness", units: 2, program: null },
  { code: "NSTP1", title: "National Service Training Program 1", units: 3, program: null },
  { code: "BA101", title: "Principles of Management", units: 3, program: "BSBA" },
  { code: "ED101", title: "The Child and Adolescent Learner", units: 3, program: "BEED" },
];

export const SUBJECTS_BY_PROGRAM: Record<string, string[]> = {
  BSIT: ["IT101", "IT102", "GE101", "GE102", "GE103", "FIL101", "PE101"],
  BSBA: ["BA101", "GE101", "GE102", "GE103", "FIL101", "PE101", "NSTP1"],
  BEED: ["ED101", "GE101", "GE102", "GE103", "FIL101", "PE101", "NSTP1"],
};

export type Applicant = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  program: string;
  email: string;
  mobile: string;
  gender: string;
};

export type Payment = { id: string; amount: number; mode: string };

export type Assessment = {
  id: string;
  applicantId: string;
  subjects: string[];
  state: WorkflowState;
  payments: Payment[];
};

export type EnrolledStudent = Record<string, string> & { applicantId: string };

export type CollegeState = {
  applicants: Applicant[];
  assessments: Assessment[];
  students: EnrolledStudent[];
  seq: number;
};

// Messy names and numbers on purpose: normalization shows on enrollment.
const A = (
  id: string,
  first_name: string,
  middle_name: string,
  last_name: string,
  gender: string,
  program: string,
  email: string,
  mobile: string,
): Applicant => ({ id, first_name, middle_name, last_name, gender, program, email, mobile });

export function collegeSeed(): CollegeState {
  const applicants = [
    A("APP-0001", "JUAN MIGUEL", "", "dela cruz", "Male", "BSIT", "Juan.DelaCruz@example.ph", "0917 123 4567"),
    A("APP-0002", "Angelica Mae", "", "Bautista", "Female", "BEED", "angelica.bautista@example.ph", "09201112233"),
    A("APP-0003", "Mark Joseph", "", "Villanueva", "Male", "BSIT", "mark.villanueva@example.ph", "09211112233"),
    A("APP-0004", "Kristine Joy", "", "Mendoza", "Female", "BSBA", "kristine.mendoza@example.ph", "09221112233"),
    A("APP-0005", "Patricia Anne", "", "Ramos", "Female", "BEED", "patricia.ramos@example.ph", "09241112233"),
    A("APP-0006", "jasmine rose", "", "NAVARRO", "Female", "BSBA", "jasmine.navarro@example.ph", "n/a"),
    A("APP-0007", "Carlo Emmanuel", "", "Pascual", "Male", "BSIT", "carlo.pascual@example.ph", "09261112233"),
    A("APP-0008", "Ronaldo", "", "Castillo", "Male", "BEED", "ronaldo.castillo@example.ph", "09281112233"),
  ];
  const mk = (
    n: number,
    applicantId: string,
    program: string,
    state: WorkflowState,
    amounts: number[],
  ): Assessment => ({
    id: `ASM-${String(n).padStart(4, "0")}`,
    applicantId,
    subjects: SUBJECTS_BY_PROGRAM[program],
    state,
    payments: amounts.map((amount, i) => ({
      id: `PAY-${String(n).padStart(4, "0")}-${i + 1}`,
      amount,
      mode: "GCash",
    })),
  });
  return {
    applicants,
    assessments: [
      mk(1, "APP-0002", "BEED", "Pending Finance", [5000]),
      mk(2, "APP-0003", "BSIT", "Pending Finance", [1500]),
      mk(3, "APP-0004", "BSBA", "Pending Registrar", []),
      mk(4, "APP-0005", "BEED", "Pending Dean", []),
      mk(5, "APP-0006", "BSBA", "Draft", []),
    ],
    students: [],
    seq: 6,
  };
}

export { WORKFLOW_STATES };
