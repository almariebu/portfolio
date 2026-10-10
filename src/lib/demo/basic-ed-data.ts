export const YEAR_NOW = "2026-2027";
export const YEAR_PREV = "2025-2026";

export type Student = { id: string; name: string; lrn: string };
export type Enrollment = {
  id: string;
  studentId: string;
  year: string;
  type: "New" | "Continuing";
  grade: string;
  status: "Active" | "Withdrawn";
};
export type ClassList = {
  id: string;
  name: string;
  grade: string;
  year: string;
  adviser: string;
  studentIds: string[];
};
export type GradeRow = {
  studentId: string;
  classId: string;
  area: string;
  quarter: string;
  grade: number;
};
export type BasicEdState = {
  students: Student[];
  enrollments: Enrollment[];
  classLists: ClassList[];
  grades: GradeRow[];
  seq: number;
};

export const USERS: Record<
  string,
  { label: string; user: string; roles: string[] }
> = {
  registrar: { label: "Registrar", user: "registrar@demo.local", roles: ["Registrar"] },
  teacherA: { label: "Teacher A", user: "teacher@demo.local", roles: ["Teacher"] },
  teacherB: { label: "Teacher B", user: "teacher2@demo.local", roles: ["Teacher"] },
};

export const SHS_AREAS = [
  "Oral Communication",
  "General Mathematics",
  "Earth and Life Science",
];

// name, LRN, last-year grade (null = new), this-year type, incoming grade for new
const STUDENTS: [string, string, string | null, "New" | "Continuing" | null, string | null][] = [
  ["Mateo Santiago Cruz", "104455660001", "Grade 6", "Continuing", null],
  ["Rafael Antonio Lim", "104455660003", "Grade 10", "Continuing", null],
  ["Sofia Beatriz Ocampo", "104455660004", "Grade 11", "Continuing", null],
  ["Liam Joseph Padilla", "104455660005", "Kinder", "Continuing", null],
  ["Chloe Anne Mercado", "104455660006", null, "New", "Grade 1"],
  ["Nathan Gabriel Soriano", "104455660007", null, "New", "Grade 7"],
  ["Elijah Matthew Cabrera", "104455660009", null, "New", "Grade 11"],
  ["Trisha Mae Valdez", "104455660012", null, "New", "Grade 12"],
  // Enrolled last year only: try enrolling these as Continuing.
  ["Dominic Paul Aguilar", "104455660011", "Grade 2", null, null],
  ["Isabella Marie Dizon", "104455660002", "Grade 7", null, null],
];

const CLASSES: [string, string, string, string[]][] = [
  ["Grade 7 - Rizal", "Grade 7", "teacherA", ["104455660001", "104455660007"]],
  ["Grade 11 - STEM A", "Grade 11", "teacherA", ["104455660003", "104455660009"]],
  ["Grade 12 - STEM A", "Grade 12", "teacherB", ["104455660004", "104455660012"]],
  ["Grade 1 - Mabini", "Grade 1", "teacherB", ["104455660005", "104455660006"]],
];

export function basicEdSeed(): BasicEdState {
  const students: Student[] = [];
  const enrollments: Enrollment[] = [];
  let e = 1;
  const grades = ["Kinder", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)];
  for (const [name, lrn, prev, kind, incoming] of STUDENTS) {
    const id = `STU-${lrn.slice(-4)}`;
    students.push({ id, name, lrn });
    if (prev)
      enrollments.push({
        id: `ENR-${String(e++).padStart(3, "0")}`,
        studentId: id,
        year: YEAR_PREV,
        type: "New",
        grade: prev,
        status: "Active",
      });
    if (kind)
      enrollments.push({
        id: `ENR-${String(e++).padStart(3, "0")}`,
        studentId: id,
        year: YEAR_NOW,
        type: kind,
        grade: kind === "New" ? (incoming as string) : grades[grades.indexOf(prev as string) + 1],
        status: "Active",
      });
  }
  const classLists: ClassList[] = CLASSES.map(([name, grade, adviser, lrns], i) => ({
    id: `CL-${i + 1}`,
    name,
    grade,
    year: YEAR_NOW,
    adviser,
    studentIds: lrns.map((l) => `STU-${l.slice(-4)}`),
  }));
  const rows: GradeRow[] = [];
  for (const cl of classLists)
    if (cl.grade === "Grade 11" || cl.grade === "Grade 12")
      for (const studentId of cl.studentIds)
        for (const area of SHS_AREAS)
          rows.push({
            studentId,
            classId: cl.id,
            area,
            quarter: "Q1",
            grade: 84 + ((studentId.length + area.length) % 12),
          });
  return { students, enrollments, classLists, grades: rows, seq: e };
}
