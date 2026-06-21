import { notFound, redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const SECTION_ROUTES: Record<string, string> = {
  home: ROUTES.home,
  nations: ROUTES.nations,
  predict: ROUTES.predict,
  picks: ROUTES.picks,
  progression: ROUTES.progression,
  streaks: ROUTES.progression,
  leaderboard: ROUTES.leaderboard,
  ranks: ROUTES.leaderboard,
  features: ROUTES.features,
  cards: ROUTES.cards,
  squad: ROUTES.cards,
  games: ROUTES.games,
  shop: ROUTES.shop,
  who: ROUTES.who,
  faq: ROUTES.faq,
};

export function generateStaticParams() {
  return Object.keys(SECTION_ROUTES).map((section) => ({ section }));
}

export default async function SectionRedirect({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const route = SECTION_ROUTES[section.toLowerCase()];

  if (!route) {
    notFound();
  }

  redirect(route);
}
