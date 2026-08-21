import type { Metadata, Viewport } from "next";
import { Sora, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://almariebu.vercel.app"),
  title: {
    default: "Almarie Bu — Product Studio",
    template: "%s · Almarie Bu",
  },
  description:
    "I turn business problems into working digital products. Product ownership, web development, and Frappe ERP consulting.",
  applicationName: "Almarie Bu",
  authors: [{ name: "Almarie Bu" }],
  keywords: [
    "Product Owner",
    "Web Developer",
    "Frappe",
    "ERPNext",
    "Product Studio",
  ],
  openGraph: {
    title: "Almarie Bu — Product Studio",
    description:
      "I turn business problems into working digital products. Product ownership, web development, and Frappe ERP consulting.",
    type: "website",
    locale: "en_US",
    siteName: "Almarie Bu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Almarie Bu — Product Studio",
    description:
      "I turn business problems into working digital products.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f5f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
