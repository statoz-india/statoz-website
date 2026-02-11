import { Target, Swords, Trophy, Users, TrendingUp, Gift } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const iconMap = {
  Target,
  Swords,
  Trophy,
  Users,
  TrendingUp,
  Gift,
};

const featureImages = [
  "/PREDICT & WIN.png",
  "https://images.unsplash.com/photo-1614738499301-d2eed34f7b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwYmF0dGxlJTIwMXYxfGVufDF8fHx8MTc3MDYzNzM5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1632679090212-612ac1f4d76f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBsZWFkZXJib2FyZCUyMGNvbXBldGl0aW9ufGVufDF8fHx8MTc3MDYzNzM4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758525862828-556189f5285a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwZ3JvdXAlMjBnYW1pbmclMjB0b2dldGhlcnxlbnwxfHx8fDE3NzA2MzczODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1627744842997-81622949c9f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkeW5hbWljJTIwb2RkcyUyMGJldHRpbmclMjBzdGF0aXN0aWNzfGVufDF8fHx8MTc3MDYzNzM4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1618255342875-a1d288c04939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlseSUyMHJld2FyZHMlMjBwcml6ZXMlMjBnYW1pbmd8ZW58MXx8fHwxNzcwNjM3Mzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  imageUrl: string;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  imageUrl,
}: FeatureCardProps) {
  return (
    <div className="group bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] overflow-hidden hover:border-[#5cdfff] transition-all duration-300 hover:scale-[1.02] flex flex-col">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent opacity-80"></div> */}

        {/* Icon Badge */}
        <div className="absolute bottom-4 left-4 bg-[#1d293d] border-2 border-[rgba(92,223,255,0.3)] w-12 h-12 flex items-center justify-center group-hover:border-[#5cdfff] transition-colors">
          <Icon className="w-6 h-6 text-[#5cdfff]" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-orbitron font-extrabold text-lg text-white uppercase mb-3 tracking-wide group-hover:text-[#5cdfff] transition-colors">
          {title}
        </h3>

        <p className="font-jakarta text-[#cad5e2] text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const FEATURES_DATA = [
    {
      icon: "Target",
      title: "PREDICT & WIN",
      description:
        "Make accurate predictions on live football matches. Top predictors earn XP and climb the leaderboard.",
    },
    {
      icon: "Swords",
      title: "1v1 BATTLES",
      description:
        "Challenge players in head-to-head prediction duels. Compete in skill-based arcade games.",
    },
    {
      icon: "Trophy",
      title: "LEADERBOARDS",
      description:
        "Compete globally and prove your prediction skills. Top players win weekly prizes.",
    },
    {
      icon: "Users",
      title: "PRIVATE LEAGUES",
      description:
        "Create leagues with friends. Compete, share predictions, and track scores together.",
    },
    {
      icon: "TrendingUp",
      title: "DYNAMIC ODDS",
      description:
        "Real-time odds that adjust live. No deposits required—pure skill and strategy.",
    },
    {
      icon: "Gift",
      title: "DAILY REWARDS",
      description:
        "Earn points for real prizes. Daily achievements and exclusive giveaways await.",
    },
  ];

  return (
    <section
      id="features"
      className="container mx-auto px-4 lg:px-32 py-12 lg:py-24"
    >
      <div className="text-center mb-12 lg:mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C86FF] to-[#5cdfff] px-4 py-2 mb-6">
          <span className="font-orbitron text-white text-sm font-bold tracking-wider">
            FEATURES
          </span>
        </div>
        <h2 className="font-orbitron font-extrabold text-4xl lg:text-5xl text-white uppercase mb-4">
          Why Choose Statoz
        </h2>
        <p className="font-jakarta text-[#B8C5D6] text-lg lg:text-xl max-w-2xl mx-auto">
          Everything you need to dominate the sports prediction arena
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {FEATURES_DATA.map((feature, index) => {
          const Icon = iconMap[feature.icon as keyof typeof iconMap];
          return (
            <FeatureCard
              key={index}
              icon={Icon}
              title={feature.title}
              description={feature.description}
              imageUrl={featureImages[index]}
            />
          );
        })}
      </div>
    </section>
  );
}
