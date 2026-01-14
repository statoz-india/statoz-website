import { Menu, X } from 'lucide-react';
import { useState } from 'react';

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] size-12 flex items-center justify-center">
        <div className="h-6 w-6 relative">
          <div className="absolute inset-[12.5%_27.08%_27.08%_12.5%]">
            <div className="absolute inset-[-6.9%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                <path d="M12.5 15.5L1 4V1H4L15.5 12.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[54.17%_20.83%_20.83%_54.17%]">
            <div className="absolute inset-[-16.67%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                <path d="M1 7L7 1" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[66.67%_16.67%_16.67%_66.67%]">
            <div className="absolute inset-[-25%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
                <path d="M1 1L5 5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[79.17%_12.5%_12.5%_79.17%]">
            <div className="absolute inset-[-50%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
                <path d="M1 3L3 1" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[12.5%_12.5%_60.42%_60.42%]">
            <div className="absolute inset-[-15.38%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.5 8.5">
                <path d="M1 4.5L4.5 1H7.5V4L4 7.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-1/4 left-[20.83%] right-[62.5%] top-[58.33%]">
            <div className="absolute inset-[-25%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
                <path d="M1 1L5 5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[70.83%_70.83%_16.67%_16.67%]">
            <div className="absolute inset-[-33.33%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
                <path d="M4 1L1 4" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[79.17%_79.17%_12.5%_12.5%]">
            <div className="absolute inset-[-50%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
                <path d="M1 1L3 3" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="bg-clip-text font-['Plus_Jakarta_Sans',sans-serif] font-extrabold leading-7 text-xl tracking-wide uppercase" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgb(194, 122, 255) 0%, rgb(0, 211, 242) 100%)" }}>
          Prediction Arena
        </p>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold leading-tight text-[#c27aff] text-[10px] tracking-wider uppercase">Epic Gaming Awaits</p>
      </div>
    </div>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-[#060a1c] sticky top-0 z-50 w-full border-b border-[#1d293d]">
      <div className="container mx-auto px-4 lg:px-32 py-6">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#cad5e2] uppercase hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#cad5e2] uppercase hover:text-white transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('games')} className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#cad5e2] uppercase hover:text-white transition-colors">
              Games
            </button>
            <button 
              onClick={() => scrollToSection('waitlist')}
              className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] border-2 border-[#ad46ff] px-8 py-3 hover:scale-105 transition-transform"
            >
              <span className="font-['Onest',sans-serif] font-black text-sm text-white tracking-wider uppercase">Join Waitlist</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-6 flex flex-col gap-4 pb-4">
            <button onClick={() => scrollToSection('features')} className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#cad5e2] uppercase hover:text-white transition-colors text-left">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#cad5e2] uppercase hover:text-white transition-colors text-left">
              How It Works
            </button>
            <button onClick={() => scrollToSection('games')} className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#cad5e2] uppercase hover:text-white transition-colors text-left">
              Games
            </button>
            <button 
              onClick={() => scrollToSection('waitlist')}
              className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] border-2 border-[#ad46ff] px-6 py-3 hover:scale-105 transition-transform w-full"
            >
              <span className="font-['Onest',sans-serif] font-black text-sm text-white tracking-wider uppercase">Join Waitlist</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
