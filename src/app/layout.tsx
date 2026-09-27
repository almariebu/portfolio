import type { Metadata, Viewport } from "next";
import { Sora, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/content";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const description = site.intro;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.roles.join(" · ")}`,
    template: `%s · ${site.name}`,
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  keywords: [
    "Web Developer",
    "ERPNext Developer",
    "Frappe Framework",
    "ERPNext",
    "Python",
    "JavaScript",
    "Next.js",
  ],
  openGraph: {
    title: `${site.name} — ${site.roles.join(" · ")}`,
    description,
    type: "website",
    locale: "en_US",
    siteName: site.name,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.roles.join(" · ")}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  // Matches the paper header at the top of the page, not the dark body below.
  themeColor: "#f8f7f4",
  width: "device-width",
  initialScale: 1,
};

/**
 * A bare domain means the URL in content.ts is still the placeholder. Claiming
 * it via `sameAs` would assert a profile that doesn't exist.
 */
const profileUrls = [site.linkedin, site.github].filter(
  (url) => new URL(url).pathname !== "/",
);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: site.roles,
  worksFor: {
    "@type": "Organization",
    name: site.company,
    alternateName: site.formerCompany,
  },
  description,
  knowsAbout: [
    "Web Development",
    "JavaScript",
    "Frappe Framework",
    "ERPNext",
    "Python",
  ],
  ...(profileUrls.length > 0 ? { sameAs: profileUrls } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sora.variable} antialiased`}
    >
      <body
        className="h-full overflow-hidden bg-night text-foreground"
        // Grammarly (and similar extensions) add data-* attributes to body
        // before hydration. Those are not part of the server HTML.
        suppressHydrationWarning
      >
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          // Escaping `<` keeps a stray "</script>" in content from closing the
          // tag early and injecting markup.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
