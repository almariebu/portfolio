import type { Metadata } from "next";
import GradingDemo from "@/components/demo/GradingDemo";

export const metadata: Metadata = {
  title: "Live demo: Grading",
  description:
    "Browser simulation of a grade entry and grade report app built in Frappe.",
  alternates: { canonical: "/demo/grading" },
};

export default function Page() {
  return <GradingDemo />;
}
