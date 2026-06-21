import Ticker from "@/components/Ticker";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Nations from "@/components/Nations";
import Predict from "@/components/Predict";
import Picks from "@/components/Picks";
import Progression from "@/components/Progression";
import Leaderboard from "@/components/Leaderboard";
import Features from "@/components/Features";
import Squad from "@/components/Squad";
import Games from "@/components/Games";
import Shop from "@/components/Shop";
import WhoFor from "@/components/WhoFor";
import Download from "@/components/Download";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Effects from "@/components/Effects";
import ScrollRail from "@/components/ScrollRail";

export default function Home() {
  return (
    <>
      <div className="fx-grain" aria-hidden />
      <div className="fx-scan" aria-hidden />
      <div className="cursor-glow" aria-hidden />

      <Ticker />
      <Header />
      <ScrollRail />

      <main>
        <Hero />
        <Nations />
        <Predict />
        <Picks />
        <Progression />
        <Leaderboard />
        <Features />
        <Squad />
        <Games />
        <Shop />
        <WhoFor />
        <Download />
        <Faq />
      </main>

      <Footer />
      <Effects />
    </>
  );
}
