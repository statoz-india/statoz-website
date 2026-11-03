import type { Metadata } from "next";
import Download from "@/components/Download";
import Effects from "@/components/Effects";
import Header from "@/components/Header";
import { ROUTES } from "@/lib/routes";
import { SHARED_OPEN_GRAPH } from "@/lib/site";

const TITLE = "Download StatOz – Free Sports Prediction Game";
const DESCRIPTION =
  "Get StatOz free on Android and iOS. Predict football fixtures, win Oz Coins, build streaks and climb the global leaderboard. No cash, not gambling.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.download },
  openGraph: { ...SHARED_OPEN_GRAPH, title: TITLE, description: DESCRIPTION, url: ROUTES.download },
};

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
