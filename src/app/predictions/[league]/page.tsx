import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { getLeague, LEAGUE_PAGES } from "@/lib/leagues";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type LeaguePageProps = { params: Promise<{ league: string }> };

// Only the leagues in LEAGUE_PAGES exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LEAGUE_PAGES.map((league) => ({ league: league.slug }));
}

export async function generateMetadata({
  params,
}: LeaguePageProps): Promise<Metadata> {
  const league = getLeague((await params).league);
  if (!league) return {};

  return pageMetadata({
    title: league.title,
    description: league.description,
    shareDescription: league.lead,
    path: league.href,
    keywords: league.keywords,
  });
}

export default async function LeaguePredictionsPage({ params }: LeaguePageProps) {
  const league = getLeague((await params).league);
  if (!league) notFound();

  return (
    <ArticleView
      id={`league_${league.slug}`}
      variant={league.variant}
      breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: league.title }]}
      eyebrow={league.eyebrow}
      titleLead={league.titleLead}
      titleGrad={league.titleGrad}
      lead={league.lead}
      body={league.body}
      faq={league.faq}
      related={league.related}
      cta={league.cta}
      stats={league.stats}
      statsPanel={league.statsPanel}
    />
  );
}
