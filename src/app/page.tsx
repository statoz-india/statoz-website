import type { Metadata } from "next";
import App from "./App";

export const metadata: Metadata = {
  title: "F2P Sports Prediction Market & Play-to-Win Games",
  description:
    "Discover Statoz, the free-to-play sports prediction market for cricket and football fans. Play skill-based sports games, predict outcomes, track live odds, and win rewards.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <App />;
}
