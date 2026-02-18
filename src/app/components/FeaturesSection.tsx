"use client";

import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FeatureItem {
  tag: string;
  title: string;
  description: string;
  highlights: string[];
  imageUrl: string;
}

const FEATURES_DATA: FeatureItem[] = [
  {
    tag: "01",
    title: "PREDICT & WIN",
    description:
      "Call match outcomes before kickoff and prove your football IQ. Each correct pick boosts your XP, rank, and reward potential.",
    highlights: ["Live Match Picks", "XP Multipliers", "Skill-Based Rewards"],
    imageUrl: "/PREDICT%20%26%20WIN.png",
  },
  {
    tag: "02",
    title: "DYNAMIC ODDS",
    description:
      "Live odds keep shifting with game momentum, injuries, and key moments. Adapt fast and outsmart the crowd with pure strategy.",
    highlights: ["Real-Time Updates", "Smart Risk Decisions", "No Deposit Play"],
    imageUrl: "/DYNAMIC%20ODDS.png",
  },
  {
    tag: "03",
    title: "LEADERBOARDS",
    description:
      "Compete weekly against top predictors and track your rise in real time. Consistency, streaks, and smart calls put you on top.",
    highlights: ["Weekly Rankings", "Performance Streaks", "Season Rewards"],
    imageUrl: "/leaderboard.png",
  },
  {
    tag: "04",
    title: "DAILY GAME DROP",
    description:
      "New prediction challenges land every day. Jump in for quick rounds, keep your streak alive, and collect daily rewards.",
    highlights: ["Fresh Challenges", "2-Minute Rounds", "Daily Streak Boosts"],
    imageUrl: "/Daily%20Game%20Drop.png",
  },
];

const CARD_ANIMATION_CLASSES = [
  "animate-fade-in-0",
  "animate-fade-in-250",
  "animate-fade-in-500",
  "animate-fade-in-750",
] as const;

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    FEATURES_DATA.map(() => false),
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const indexAttr = (entry.target as HTMLElement).dataset.index;
          const index = Number(indexAttr);
          if (Number.isNaN(index)) return;

          setVisibleCards((prev) => {
            if (prev[index]) return prev;
            return prev.map((item, i) => (i === index ? true : item));
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 },
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative pb-0 pt-14 lg:pb-0 lg:pt-24">
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#7C86FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-[#5cdfff]/15 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-32">
        <div className="mb-12 text-center lg:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 border border-[#5cdfff]/30 bg-[#101a32] px-4 py-2">
            <span className="font-orbitron text-sm font-bold tracking-[0.18em] text-white">
              FEATURES
            </span>
          </div>

          <h2 className="mb-4 font-orbitron text-4xl font-extrabold uppercase text-white lg:text-5xl">
            Why Choose Statoz
          </h2>
          <p className="mx-auto max-w-3xl font-jakarta text-base leading-relaxed text-[#B8C5D6] lg:text-lg">
            A fast, competitive feature set built for players who want smarter
            predictions, better rankings, and more ways to win.
          </p>
        </div>

        <div className="relative flex w-full flex-col gap-10 lg:gap-0">
          {FEATURES_DATA.map((feature, index) => (
            <div
              key={feature.title}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              data-index={index}
              className="w-full lg:min-h-screen"
            >
              <article
                className={`group flex w-full flex-col transition-all duration-500 lg:h-screen lg:flex-row lg:items-stretch ${
                  visibleCards[index]
                    ? CARD_ANIMATION_CLASSES[index]
                    : "translate-y-4 opacity-0"
                }`}
                style={{ zIndex: FEATURES_DATA.length - index }}
              >
                <div className="relative w-full overflow-hidden lg:w-[58%]">
                  <ImageWithFallback
                    src={feature.imageUrl}
                    alt={feature.title}
                    className="h-[360px] w-full border-2 border-[#1D293D] object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-[500px] lg:h-full lg:max-w-none"
                  />
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-linear-to-br from-[#7C86FF]/40 to-[#00d4ff]/30 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="inline-flex w-full min-h-[300px] self-stretch flex-col items-start justify-center gap-6 px-6 py-10 sm:min-h-[360px] lg:h-full lg:flex-1 lg:min-w-0 lg:px-10">
                  <div className="inline-flex items-center gap-3">
                    <span className="font-orbitron text-sm font-bold tracking-[0.2em] text-[#5cdfff]">
                      {feature.tag}
                    </span>
                    <div className="h-[2px] w-14 bg-linear-to-r from-[#5cdfff] to-transparent" />
                  </div>

                  <h3 className="font-orbitron text-[28px] font-extrabold uppercase leading-[32px] tracking-[0.45px] text-white transition-all duration-300 group-hover:bg-linear-to-r group-hover:from-[#7C86FF] group-hover:to-[#00d4ff] group-hover:bg-clip-text group-hover:text-transparent lg:text-[34px] lg:leading-[38px]">
                    {feature.title}
                  </h3>

                  <p className="w-full max-w-[500px] font-jakarta text-[16px] leading-[27px] text-[#CAD5E2] lg:text-[17px]">
                    {feature.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white/8 px-3 py-1.5 font-jakarta text-xs font-medium uppercase tracking-wide text-[#d4deea]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
