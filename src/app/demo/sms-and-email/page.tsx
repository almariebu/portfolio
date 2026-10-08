import type { Metadata } from "next";
import MessagingDemo from "@/components/demo/MessagingDemo";

export const metadata: Metadata = {
  title: "Live demo: SMS and email notifications",
  description:
    "Browser simulation of a billing SMS and email digest app built in Frappe.",
  alternates: { canonical: "/demo/sms-and-email" },
};

export default function Page() {
  return <MessagingDemo />;
}
