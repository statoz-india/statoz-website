import type { Metadata } from "next";
import Download from "@/components/Download";
import Effects from "@/components/Effects";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Download StatOz -Free sports prediction game",
  description:
    "Get StatOz free on Android and iOS. Predict football fixtures, win Oz Coins, build streaks and climb the global leaderboard. No cash, not gambling.",
  alternates: { canonical: "/download" },
};

export default function DownloadPage() {
  return (
    <>
      <div className="fx-grain" aria-hidden />
      <div className="fx-scan" aria-hidden />
      <div className="cursor-glow" aria-hidden />

      <Header />

      <main>
        <Download />
      </main>

      <Effects />
    </>
  );
}
