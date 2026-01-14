import { Target, Swords, Trophy, Users, TrendingUp, Gift } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'PREDICT & WIN',
    description: 'Make accurate predictions on live football matches and earn XP. The more accurate your predictions, the more rewards you get.',
    gradient: 'from-[#7C86FF] to-[#7C86FF]'
  },
  {
    icon: Swords,
    title: '1 VS 1 ARCADE GAMES',
    description: 'Challenge other players in head-to-head matches. Compete in skill-based arcade games and climb the leaderboard.',
    gradient: 'from-[#7C86FF] to-[#7C86FF]'
  },
  {
    icon: Trophy,
    title: 'GLOBAL LEADERBOARDS',
    description: 'Rise to the top and prove your skills against players from around the world. Top players win exclusive prizes every week.',
    gradient: 'from-[#FFB800] to-[#FFB800]'
  },
  {
    icon: Users,
    title: 'BATTLE FRIENDS',
    description: 'Create private prediction leagues and compete against your friends. Share predictions, track scores, and boost rewards.',
    gradient: 'from-[#7C86FF] to-[#7C86FF]'
  },
  {
    icon: TrendingUp,
    title: 'POLYMARKET-STYLE BETTING',
    description: 'Place predictions on multiple outcomes with dynamic odds that adjust in real-time. No deposit required, just pure skill and strategy.',
    gradient: 'from-[#7C86FF] to-[#7C86FF]'
  },
  {
    icon: Gift,
    title: 'EPIC REWARDS',
    description: 'Earn points that translate into real prizes. Daily achievements, weekly tournaments, and exclusive giveaways for top performers.',
    gradient: 'from-[#7C86FF] to-[#7C86FF]'
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="container mx-auto px-4 lg:px-32 py-12 lg:py-24">
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-4xl lg:text-5xl text-white uppercase mb-4">Features</h2>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-lg lg:text-xl max-w-2xl mx-auto">
          Everything you need to predict, play, and dominate in the ultimate football gaming arena
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] p-8 hover:border-[#ad46ff] transition-all duration-300 hover:scale-105 group"
            >
              <div className="bg-[#1d293d] border-2 border-[rgba(97,95,255,0.3)] w-14 h-14 flex items-center justify-center mb-6 group-hover:border-[#7C86FF] transition-colors">
                <Icon className="w-7 h-7 text-[#7C86FF]" />
              </div>
              
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-white uppercase mb-4 tracking-wide">
                {feature.title}
              </h3>
              
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
