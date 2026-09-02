import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://almariedev.com"),
  title: {
    default: "Almarie Bu — Web Developer & ERP Developer",
    template: "%s · Almarie Bu",
  },
  description:
    "Web Developer and ERP Developer specializing in Frappe Framework and ERPNext. I build, customize, maintain, and troubleshoot business applications.",
  applicationName: "Almarie Bu",
  authors: [{ name: "Almarie Bu" }],
  keywords: [
    "Web Developer",
    "ERP Developer",
    "Frappe",
    "ERPNext",
    "Python Developer",
    "Full-Stack Developer",
  ],
  openGraph: {
    title: "Almarie Bu — Web Developer & ERP Developer",
    description:
      "Web Developer and ERP Developer specializing in Frappe Framework and ERPNext. I build, customize, maintain, and troubleshoot business applications.",
    type: "website",
    locale: "en_US",
    siteName: "Almarie Bu",
    images: [{ url: "/almarie.jpg", alt: "Portrait of Almarie Bu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Almarie Bu — Web Developer & ERP Developer",
    description:
      "Web Developer and ERP Developer specializing in Frappe Framework and ERPNext.",
    images: ["/almarie.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3efe8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
