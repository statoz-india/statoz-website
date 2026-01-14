import { Trophy, Gamepad2, Gift, Clock } from 'lucide-react';

export function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-[rgba(89,22,139,0.2)] to-[rgba(28,57,142,0.2)] border-t-2 border-b-2 border-[rgba(173,70,255,0.15)] py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
          <div className="flex flex-col items-center gap-3">
            <Trophy className="w-8 h-8 text-[#c27aff]" />
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-3xl lg:text-4xl text-white text-center">50+</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-xs lg:text-sm text-[rgba(255,255,255,0.5)] uppercase text-center">Daily Matches</p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-[#c27aff]" />
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-3xl lg:text-4xl text-white text-center">11</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-xs lg:text-sm text-[rgba(255,255,255,0.5)] uppercase text-center">Arcade Games</p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <Gift className="w-8 h-8 text-[#c27aff]" />
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-3xl lg:text-4xl text-white text-center">100%</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-xs lg:text-sm text-[rgba(255,255,255,0.5)] uppercase text-center">Free to Play</p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <Clock className="w-8 h-8 text-[#c27aff]" />
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-3xl lg:text-4xl text-white text-center">₹5K+</p>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-xs lg:text-sm text-[rgba(255,255,255,0.5)] uppercase text-center">Prize Pool</p>
          </div>
        </div>
      </div>
    </section>
  );
}
