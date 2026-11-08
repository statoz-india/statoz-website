import Download from "@/components/Download";
import Effects from "@/components/Effects";
import Header from "@/components/Header";
import { ROUTES } from "@/lib/routes";
import { KEYWORDS, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Download StatOz – Free Sports Prediction Game",
  absoluteTitle: true,
  description:
    "Get StatOz free on Android and iOS. Predict football fixtures, win Oz Coins, build streaks and climb the global leaderboard. No cash, not gambling.",
  path: ROUTES.download,
  keywords: [
    "download StatOz",
    "StatOz app download",
    "prediction game app Android",
    "prediction game app iPhone",
    ...KEYWORDS.core.slice(0, 4),
    KEYWORDS.worldCup[3],
  ],
});

export default function DownloadPage() {
  return (
    <>
      <div className="fx-grain" aria-hidden />
      <div className="fx-scan" aria-hidden />
      <div className="cursor-glow" aria-hidden />

      <Header />

      <main>
        <Download asPageTitle />
      </main>

      <Effects />
    </>
  );
}
