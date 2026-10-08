import type { Metadata } from "next";
import BasicEdDemo from "@/components/demo/BasicEdDemo";

export const metadata: Metadata = {
  title: "Live demo: Basic education enrollment",
  description:
    "Browser simulation of a basic education enrollment and class-list app built in Frappe.",
  alternates: { canonical: "/demo/basic-ed-enrollment" },
};

export default function Page() {
  return <BasicEdDemo />;
}
