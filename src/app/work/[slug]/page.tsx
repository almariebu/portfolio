import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { caseStudies, site } from "@/lib/content";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) return { title: "Case study not found" };

  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/?panel=work&study=${study.slug}` },
    openGraph: {
      title: `${study.title} · ${site.name}`,
      description: study.summary,
      url: `${site.url}/?panel=work&study=${study.slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (!caseStudies.some((study) => study.slug === slug)) notFound();
  redirect(`/?panel=work&study=${slug}`);
}
