import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // The Frappe / ERPNext CV was dropped. Send old links to the main CV.
  async redirects() {
    return [
      { source: "/cv.html", destination: "/cv-developer.html", permanent: false },
      {
        source: "/Almarie_Bullo_CV.pdf",
        destination: "/Almarie_Bullo_Developer_CV.pdf",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
