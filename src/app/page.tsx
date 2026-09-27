import { caseStudies } from "@/lib/content";
import { isPanelId, isWorkPart, type PanelId, type WorkPart } from "@/lib/navigation";
import { PortfolioShell } from "@/components/PortfolioShell";

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const requested = first(params.panel);
  const panel: PanelId = isPanelId(requested) ? requested : "practice";
  const study = first(params.study) ?? null;
  const requestedPart = first(params.part);
  const part: WorkPart = isWorkPart(requestedPart) ? requestedPart : "overview";
  const knownStudy = caseStudies.some((item) => item.slug === study)
    ? study
    : null;

  return (
    <PortfolioShell
      initialPanel={panel}
      initialStudy={knownStudy}
      initialPart={part}
    />
  );
}
