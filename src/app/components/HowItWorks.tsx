import { UserPlus, Target, Trophy, Crown } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'CREATE YOUR LOGIN',
    description: 'Sign up for free and create your personalized player profile in seconds. Pick your username and get ready to compete.',
    color: '#7C86FF'
  },
  {
    step: '02',
    icon: Target,
    title: 'PICK YOUR MATCH',
    description: 'Browse live and upcoming football matches from leagues around the world. Choose matches and place your predictions.',
    color: '#E60076'
  },
  {
    step: '03',
    icon: Trophy,
    title: 'MAKE YOUR PREDICTIONS',
    description: 'Predict match outcomes, player performances, and in-game events. Each correct prediction earns you XP and climbs the leaderboard.',
    color: '#FFB800'
  },
  {
    step: '04',
    icon: Crown,
    title: 'DOMINATE THE LEADERBOARD',
    description: 'Build your streak and compete with others. Top performers win exclusive prizes, rewards, and bragging rights.',
    color: '#00D3F2'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container mx-auto px-4 lg:px-32 py-12 lg:py-24">
      <div className="text-center mb-12 lg:mb-16">
        <div className="inline-block bg-gradient-to-r from-[#9810fa] to-[#155dfc] px-6 py-2 mb-6">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-white uppercase tracking-wider">Simple & Powerful</p>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-4xl lg:text-5xl text-white uppercase mb-4">HOW IT WORKS</h2>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-lg lg:text-xl max-w-2xl mx-auto">
          Four simple steps to gamified glory
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative flex flex-col items-center text-center group">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 font-['Orbitron',sans-serif] font-black text-6xl text-[rgba(255,255,255,0.05)] group-hover:text-[rgba(255,255,255,0.1)] transition-colors">
                {step.step}
              </div>
              
              {/* Icon Container */}
              <div 
                className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 group-hover:scale-110 transition-transform"
                style={{ 
                  backgroundColor: `${step.color}20`,
                  borderColor: step.color
                }}
              >
                <Icon className="w-10 h-10" style={{ color: step.color }} />
              </div>

              {/* Content */}
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-lg text-white uppercase mb-3 tracking-wide">
                {step.title}
              </h3>
              
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20px)] h-0.5 bg-gradient-to-r from-[rgba(173,70,255,0.3)] to-transparent" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
