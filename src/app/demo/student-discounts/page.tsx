import type { Metadata } from "next";
import DiscountDemo from "@/components/demo/DiscountDemo";

export const metadata: Metadata = {
  title: "Live demo: Student discounts",
  description:
    "Browser simulation of a student discount and discount summary app built in Frappe.",
  alternates: { canonical: "/demo/student-discounts" },
};

export default function Page() {
  return <DiscountDemo />;
}
