import { Trophy, Gamepad2, Gift, Clock } from "lucide-react";
import { StatCard } from "../components/shared/StatCard";

const statsData = [
  { icon: Trophy, value: "50+", label: "Daily Matches" },
  { icon: Gamepad2, value: "100+", label: "Live Bets" },
  { icon: Gift, value: "100%", label: "Free to Play" },
  { icon: Clock, value: "₹5K+", label: "Prize Pool" },
];

export function StatsSection() {
  return (
    <section className="bg-linear-to-r from-[rgba(89,22,139,0.2)] to-[rgba(28,57,142,0.2)] border-t-2 border-b-2 border-[rgba(173,70,255,0.15)] py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
