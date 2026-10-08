import type { Metadata } from "next";
import OnlinePaymentsDemo from "@/components/demo/OnlinePaymentsDemo";

export const metadata: Metadata = {
  title: "Live demo: Online payments",
  description:
    "Browser simulation of a online payments billing app built in Frappe.",
  alternates: { canonical: "/demo/online-payments" },
};

export default function Page() {
  return <OnlinePaymentsDemo />;
}
