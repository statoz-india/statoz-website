import { Target, Swords, Trophy, Users, TrendingUp, Gift } from "lucide-react";
import { FeatureCard } from "../components/shared/FeatureCard";
import { FEATURES_DATA } from "../utils/constants";

const iconMap = {
  Target,
  Swords,
  Trophy,
  Users,
  TrendingUp,
  Gift,
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full bg-[#0D111A] px-4 lg:px-32 py-12 lg:py-24"
    >
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="font-orbitron font-extrabold text-4xl lg:text-5xl text-white uppercase mb-4">
          Features
        </h2>
        <p className="font-jakarta text-[#B8C5D6] text-lg lg:text-xl max-w-2xl mx-auto">
          Everything you need to dominate the football prediction arena
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES_DATA.map((feature, index) => {
          const Icon = iconMap[feature.icon as keyof typeof iconMap];
          return (
            <FeatureCard
              key={index}
              icon={Icon}
              title={feature.title}
              description={feature.description}
            />
          );
        })}
      </div>
    </section>
  );
}
