import type { Metadata } from "next";
import CollegeDemo from "@/components/demo/CollegeDemo";

export const metadata: Metadata = {
  title: "Live demo: College enrollment",
  description:
    "Browser simulation of a college admission and enrollment workflow built in Frappe.",
  alternates: { canonical: "/demo/college-enrollment" },
};

export default function Page() {
  return <CollegeDemo />;
}
