import { Trophy, Award, Shield, Radio } from 'lucide-react';

export function HeroSection() {
  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto px-4 lg:px-32 py-12 lg:py-24">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12">
        {/* Left Content */}
        <div className="flex-1 flex flex-col gap-9">
          {/* Main Headline */}
          <div className="flex flex-col gap-2">
            <h1 className="font-['Orbitron',sans-serif] font-black text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight uppercase">
              <div className="text-[#c27aff]">Predict.</div>
              <div className="text-[#00d3f2]">Play.</div>
              <div className="text-white">Dominate.</div>
            </h1>
          </div>

          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-lg lg:text-xl leading-relaxed max-w-xl">
            Where skill meets strategy. Make predictions, earn XP, climb leaderboards, and win real prizes.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-[rgba(15,23,43,0.5)] border border-[#1d293d] px-4 py-4 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-[#c27aff]" />
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-white uppercase">Real Prizes</span>
            </div>
            <div className="bg-[rgba(15,23,43,0.5)] border border-[#1d293d] px-4 py-4 flex items-center gap-3">
              <Award className="w-5 h-5 text-[#c27aff]" />
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-white uppercase">Epic Rewards</span>
            </div>
            <div className="bg-[rgba(15,23,43,0.5)] border border-[#1d293d] px-4 py-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#c27aff]" />
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-white uppercase">Free to Play</span>
            </div>
            <div className="bg-[rgba(15,23,43,0.5)] border border-[#1d293d] px-4 py-4 flex items-center gap-3">
              <Radio className="w-5 h-5 text-[#c27aff]" />
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-white uppercase">Live Matches</span>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={scrollToWaitlist}
            className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] w-full sm:w-auto px-12 py-5 flex items-center justify-center gap-3 hover:scale-105 transition-transform group"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
              <path d="M4.49813 16.4931C2.99875 17.7526 2.49896 21.4911 2.49896 21.4911C2.49896 21.4911 6.2374 20.9913 7.49688 19.4919C8.20658 18.6522 8.19659 17.3628 7.40691 16.5831C7.01838 16.2123 6.50658 15.998 5.96974 15.9814C5.4329 15.9648 4.90883 16.147 4.49813 16.4931Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M11.995 14.9938L8.99625 11.995C9.52818 10.615 10.198 9.2922 10.9954 8.04665C12.1601 6.18441 13.7819 4.65112 15.7065 3.5926C17.631 2.53408 19.7944 1.98555 21.9908 1.99917C21.9908 4.71804 21.2112 9.49605 15.9933 12.9946C14.7308 13.793 13.3913 14.4627 11.995 14.9938Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M11.995 14.9938H3.99833C3.99833 14.9938 4.54811 8.96628 5.9975 7.99669C7.61683 6.91714 10.9954 7.99669 10.9954 7.99669" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M9.5 11.875V15.8333C9.5 15.8333 11.8987 15.3979 12.6667 14.25C13.5217 12.9675 12.6667 10.2917 12.6667 10.2917" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="font-['Onest',sans-serif] font-black text-lg text-white tracking-wider uppercase">Get Early Access</span>
          </button>
        </div>

        {/* Right Content - Epic Card */}
        <div className="flex-1 w-full max-w-[616px]">
          <div className="relative p-1 bg-gradient-to-br from-[rgba(15,23,43,0.95)] to-[rgba(29,41,61,0.95)] border-4 border-[rgba(173,70,255,0.5)]">
            <div className="flex flex-col items-center justify-center p-8 lg:p-12">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-5xl lg:text-6xl text-white uppercase text-center mb-6">EPIC</h2>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-2xl text-[#c27aff] uppercase tracking-wider text-center mb-8">Gaming Awaits</p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-gradient-to-r from-[#0092b8] to-[#155dfc] border border-[rgba(255,255,255,0.1)] p-4 flex flex-col items-center">
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-white text-center">250+</p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs text-[rgba(255,255,255,0.8)] uppercase text-center">XP/Game</p>
                </div>
                <div className="bg-gradient-to-r from-[#9810fa] to-[#e60076] border border-[rgba(255,255,255,0.1)] p-4 flex flex-col items-center">
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-white text-center">50+</p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs text-[rgba(255,255,255,0.8)] uppercase text-center">Daily Matches</p>
                </div>
                <div className="bg-gradient-to-r from-[#d08700] to-[#f54900] border border-[rgba(255,255,255,0.1)] p-4 flex flex-col items-center">
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-white text-center">11</p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs text-[rgba(255,255,255,0.8)] uppercase text-center">Arcade Games</p>
                </div>
                <div className="bg-gradient-to-r from-[#00a63e] to-[#096] border border-[rgba(255,255,255,0.1)] p-4 flex flex-col items-center">
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-white text-center">68%</p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs text-[rgba(255,255,255,0.8)] uppercase text-center">Win Rate</p>
                </div>
              </div>
            </div>

            {/* Corner Icons */}
            <div className="absolute top-1 right-1 bg-gradient-to-r from-[#d08700] to-[#e17100] border-l-2 border-b-2 border-[#f0b100] w-17 h-17 p-4 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
                <path d="M14.0793 1.67846C14.1369 1.57393 14.2214 1.48677 14.3241 1.42606C14.4269 1.36536 14.544 1.33333 14.6633 1.33333C14.7826 1.33333 14.8998 1.36536 15.0025 1.42606C15.1052 1.48677 15.1898 1.57393 15.2473 1.67846L19.1833 9.15046C19.2772 9.32348 19.4082 9.47357 19.5669 9.58995C19.7257 9.70634 19.9082 9.78613 20.1015 9.8236C20.2947 9.86108 20.4938 9.8553 20.6846 9.8067C20.8753 9.75809 21.0529 9.66785 21.2047 9.54246L26.9073 4.65713C27.0168 4.56809 27.1517 4.51608 27.2926 4.50859C27.4335 4.50111 27.5732 4.53852 27.6915 4.61545C27.8097 4.69239 27.9006 4.80487 27.9509 4.93671C28.0012 5.06856 28.0083 5.21295 27.9713 5.34913L24.1927 19.0105C24.1155 19.29 23.9494 19.5368 23.7193 19.7134C23.4893 19.89 23.208 19.9868 22.918 19.9891H6.40999C6.11977 19.9871 5.83814 19.8904 5.60785 19.7138C5.37756 19.5372 5.21119 19.2902 5.13399 19.0105L1.35666 5.35046C1.31966 5.21429 1.32682 5.06989 1.37711 4.93805C1.42741 4.8062 1.51824 4.69372 1.63653 4.61679C1.75482 4.53985 1.89447 4.50244 2.03538 4.50993C2.17629 4.51742 2.31119 4.56942 2.42066 4.65846L8.12199 9.54379C8.27372 9.66918 8.45134 9.75942 8.64208 9.80803C8.83282 9.85664 9.03196 9.86241 9.22519 9.82494C9.41843 9.78746 9.60097 9.70767 9.75972 9.59128C9.91846 9.4749 10.0495 9.32481 10.1433 9.15179L14.0793 1.67846Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                <path d="M16 10.6667V28" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}