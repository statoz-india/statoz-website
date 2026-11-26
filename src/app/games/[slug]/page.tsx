import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GameDetailPage from "@/components/GameDetailPage";
import { GAMES, getGame } from "@/lib/games";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/storeLinks";

type GamePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return GAMES.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) {
    return {};
  }

  const socialTitle = `${game.seo.title} | ${SITE_NAME}`;

  return {
    title: game.seo.title,
    description: game.seo.description,
    keywords: [
      game.name,
      `${game.name} game`,
      "football game app",
      "free football game",
      "StatOz games",
    ],
    alternates: { canonical: game.href },
    openGraph: {
      type: "website",
      title: socialTitle,
      description: game.seo.description,
      url: game.href,
      siteName: SITE_NAME,
      images: [{ url: game.background, alt: `${game.name} on StatOz` }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: game.seo.description,
      images: [game.background],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) {
    notFound();
  }

  const pageUrl = `${SITE_URL}${game.href}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoGame",
        name: game.name,
        description: game.seo.description,
        url: pageUrl,
        image: `${SITE_URL}${game.background}`,
        gamePlatform: ["Android", "iOS"],
        playMode: "SinglePlayer",
        applicationCategory: "GameApplication",
        operatingSystem: "Android, iOS",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
        sameAs: [PLAY_STORE_URL, APP_STORE_URL],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Games",
            item: `${SITE_URL}/#games`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: game.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GameDetailPage game={game} />
    </>
  );
}
