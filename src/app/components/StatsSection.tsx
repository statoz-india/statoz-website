"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, Gamepad2, Gift, Clock } from "lucide-react";
import { StatCard } from "../components/shared/StatCard";

const statsData = [
  { icon: Trophy, value: "50+", label: "Daily Matches" },
  { icon: Gamepad2, value: "100+", label: "Live Bets" },
  { icon: Gift, value: "100%", label: "Free to Play" },
  { icon: Clock, value: "₹5K+", label: "Prize Pool" },
];

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const animationClasses = [
    "animate-fade-in-0",
    "animate-fade-in-250",
    "animate-fade-in-500",
    "animate-fade-in-750",
  ] as const;

  return (
    <section
      ref={sectionRef}
      className="bg-linear-to-r from-[rgba(89,22,139,0.2)] to-[rgba(28,57,142,0.2)] py-12 lg:py-16"
    >
      <div className="container mx-auto px-4 lg:px-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={
                isVisible
                  ? animationClasses[index]
                  : "translate-y-4 opacity-0"
              }
            >
              <StatCard icon={stat.icon} value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
