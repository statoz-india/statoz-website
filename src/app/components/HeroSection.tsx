import { Award, Shield, Radio } from "lucide-react";
import { FeaturePill } from "../components/shared/FeaturePill";
import { APP_DOWNLOAD_URL } from "../utils/constants";

const heroFeatures = [
  { icon: Award, label: "Epic Rewards" },
  { icon: Shield, label: "Free to Play" },
  { icon: Radio, label: "Live Matches" },
];

const epicImage = "/StatOz%20Cover%20Image.webp";

export function HeroSectionOld() {
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
            The free-to-play sports prediction market. Predict outcomes, play
            daily sports games & climb leaderboards.
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
          <a
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-[#5cdfff] border-2 border-[#5cdfff] hover:bg-[#4dcfef] hover:border-[#4dcfef] transition-all duration-300 px-8 py-4 flex items-center gap-4 w-full sm:w-auto max-w-[320px] hover:scale-105 animate-fade-in-750"
          >
            <div className="bg-[#0d1b4b] p-3 group-hover:bg-[#102465] transition-colors">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-[#5cdfff]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-orbitron text-[#0d1b4b] text-xs uppercase tracking-wider opacity-80">
                Get it on
              </p>
              <p className="font-orbitron text-[#0d1b4b] text-xl font-bold">
                Google Play
              </p>
            </div>
          </a>
        </div>

        {/* Right Content - Cover Image */}
        <div className="flex-1 w-full max-w-[616px] -mr-4 -mb-12 lg:-mr-32 lg:-mb-24 animate-fade-in-0">
          <div className="relative flex items-center justify-center h-full">
            <Image
              src={epicImage}
              alt="Statoz free-to-play sports prediction market app experience"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
