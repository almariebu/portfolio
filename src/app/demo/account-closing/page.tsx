import type { Metadata } from "next";
import ClosingDemo from "@/components/demo/ClosingDemo";

export const metadata: Metadata = {
  title: "Live demo: Account closing and cashiering",
  description:
    "Browser simulation of a account closing and cashiering app built in Frappe.",
  alternates: { canonical: "/demo/account-closing" },
};

export default function Page() {
  return <ClosingDemo />;
}
