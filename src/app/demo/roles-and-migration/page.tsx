import type { Metadata } from "next";
import MigrationDemo from "@/components/demo/MigrationDemo";

export const metadata: Metadata = {
  title: "Live demo: Roles and data migration",
  description:
    "Browser simulation of a roles and data migration app built in Frappe.",
  alternates: { canonical: "/demo/roles-and-migration" },
};

export default function Page() {
  return <MigrationDemo />;
}
