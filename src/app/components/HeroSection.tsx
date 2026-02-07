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

const epicImage = "/StatOz%20Cover%20Image.webp";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 lg:px-32 py-12 lg:py-24">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12">
        {/* Left Content */}
        <div className="flex-1 flex flex-col gap-9">
          {/* Main Headline */}
          <div className="flex flex-col gap-2 animate-fade-in-0">
            <h1 className="font-orbitron font-black text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight uppercase">
              <div className="text-[#c27aff]">Predict.</div>
              <div className="text-[#00d3f2]">Play.</div>
              <div className="text-white">Dominate.</div>
            </h1>
          </div>

          <p className="font-jakarta text-[#B8C5D6] text-lg lg:text-xl leading-relaxed max-w-xl animate-fade-in-250">
            Where skill meets strategy. Make predictions, earn XP, climb
            leaderboards, and win real prizes.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 animate-fade-in-500">
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
            className="bg-[#4dcfef] hover:bg-[#4dcfef] w-full sm:w-auto max-w-[400px] px-12 py-5 flex items-center justify-center gap-3 hover:scale-105 transition-transform group animate-fade-in-750"
          >
            <span className="font-onest font-black text-lg text-[#0d1b4b] tracking-wider uppercase">
              Get Early Access
            </span>
          </button>
        </div>

        {/* Right Content - Cover Image */}
        <div className="flex-1 w-full max-w-[616px] -mr-4 -mb-12 lg:-mr-32 lg:-mb-24 animate-fade-in-0">
          <div className="relative flex items-center justify-center h-full">
            <img
              src={epicImage}
              alt="Statoz cover"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
