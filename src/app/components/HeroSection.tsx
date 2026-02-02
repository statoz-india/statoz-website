import { Trophy, Award, Shield, Radio } from "lucide-react";
import { FeaturePill } from "../components/shared/FeaturePill";
import { RocketIcon } from "../components/shared/RocketIcon";
import { scrollToSection } from "../utils/helpers";

const heroFeatures = [
  { icon: Trophy, label: "Real Prizes" },
  { icon: Award, label: "Epic Rewards" },
  { icon: Shield, label: "Free to Play" },
  { icon: Radio, label: "Live Matches" },
];

const epicStats = [
  { value: "250+", label: "XP/Game", gradient: "from-[#0092b8] to-[#155dfc]" },
  {
    value: "50+",
    label: "Daily Matches",
    gradient: "from-[#9810fa] to-[#e60076]",
  },
  {
    value: "100+",
    label: "Live Bets",
    gradient: "from-[#d08700] to-[#f54900]",
  },
  { value: "68%", label: "Win Rate", gradient: "from-[#00a63e] to-[#096]" },
];

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 lg:px-32 py-12 lg:py-24">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12">
        {/* Left Content */}
        <div className="flex-1 flex flex-col gap-9">
          {/* Main Headline */}
          <div className="flex flex-col gap-2">
            <h1 className="font-orbitron font-black text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight uppercase">
              <div className="text-[#c27aff]">Predict.</div>
              <div className="text-[#00d3f2]">Play.</div>
              <div className="text-white">Dominate.</div>
            </h1>
          </div>

          <p className="font-jakarta text-[#B8C5D6] text-lg lg:text-xl leading-relaxed max-w-xl">
            Where skill meets strategy. Make predictions, earn XP, climb
            leaderboards, and win real prizes.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2">
            {heroFeatures.map((feature, index) => (
              <FeaturePill
                key={index}
                icon={feature.icon}
                label={feature.label}
              />
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => scrollToSection("waitlist")}
            className="bg-linear-to-r from-[#9810fa] to-[#155dfc] w-full sm:w-auto px-12 py-5 flex items-center justify-center gap-3 hover:scale-105 transition-transform group"
          >
            <RocketIcon />
            <span className="font-onest font-black text-lg text-white tracking-wider uppercase">
              Get Early Access
            </span>
          </button>
        </div>

        {/* Right Content - Epic Card */}
        <div className="flex-1 w-full max-w-[616px]">
          <div className="relative p-1 bg-linear-to-br from-[rgba(15,23,43,0.95)] to-[rgba(29,41,61,0.95)] border-4 border-[rgba(173,70,255,0.5)]">
            <div className="relative">
              <div className="flex flex-col items-center justify-center p-8 lg:p-12 gap-6">
                {/* Header Badge */}
                {/* Removed platform stats badge */}

                {/* Stats Grid - Vertical Style */}
                <div className="flex flex-col gap-3 w-full">
                  {epicStats.map((stat, index) => (
                    <div
                      key={index}
                      className="relative bg-[#1a2544]/80 border-l-4 border-[#5cdfff] p-5 flex items-center justify-between group hover:bg-[#1a2544] transition-all duration-300 hover:translate-x-2"
                    >
                      {/* Animated Corner */}
                      <div className="absolute top-0 right-0 w-2 h-2 bg-[#5cdfff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#5cdfff] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {/* Stat Content */}
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-12 bg-linear-to-b from-[#5cdfff] to-transparent"></div>
                        <div>
                          <p className="font-orbitron font-extrabold text-3xl text-white leading-none mb-1">
                            {stat.value}
                          </p>
                          <p className="font-orbitron font-bold text-xs text-[#5cdfff] uppercase tracking-wider">
                            {stat.label}
                          </p>
                        </div>
                      </div>

                      {/* Arrow Indicator */}
                      <div className="text-[#5cdfff] opacity-50 group-hover:opacity-100 transition-opacity">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 0L8.59 1.41L16.17 9H0V11H16.17L8.59 18.59L10 20L20 10L10 0Z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner Icon */}
              {/* Removed corner trophy icon */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
