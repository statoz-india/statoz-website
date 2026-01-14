import { Twitter, Instagram, Youtube, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer id="games" className="bg-[#060a1c] border-t border-[#1d293d] py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-[#9810fa] to-[#155dfc] size-12 flex items-center justify-center">
                <div className="h-6 w-6 relative">
                  <div className="absolute inset-[12.5%_27.08%_27.08%_12.5%]">
                    <div className="absolute inset-[-6.9%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                        <path d="M12.5 15.5L1 4V1H4L15.5 12.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-white uppercase tracking-wide">
                  Prediction Arena
                </p>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs text-[#c27aff] uppercase">
                  Epic Gaming Awaits
                </p>
              </div>
            </div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm leading-relaxed">
              The ultimate P2P football prediction platform. Make predictions, compete in skill-based gaming challenges, and win real prizes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-white text-sm uppercase mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm hover:text-white transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm hover:text-white transition-colors"
                >
                  Join Waitlist
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-white text-sm uppercase mb-4 tracking-wide">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="font-['Plus_Jakarta_Sans',sans-serif] text-[#cad5e2] text-sm hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-white text-sm uppercase mb-4 tracking-wide">Follow Us</h3>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="bg-[#1d293d] w-10 h-10 flex items-center justify-center hover:bg-[#ad46ff] transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="bg-[#1d293d] w-10 h-10 flex items-center justify-center hover:bg-[#ad46ff] transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="bg-[#1d293d] w-10 h-10 flex items-center justify-center hover:bg-[#ad46ff] transition-colors"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="bg-[#1d293d] w-10 h-10 flex items-center justify-center hover:bg-[#ad46ff] transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1d293d] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#62748e] text-sm text-center md:text-left">
            © 2026 Prediction Arena. All rights reserved. Built with ❤️ for football fans.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-['Plus_Jakarta_Sans',sans-serif] text-[#62748e] text-sm hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="font-['Plus_Jakarta_Sans',sans-serif] text-[#62748e] text-sm hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="font-['Plus_Jakarta_Sans',sans-serif] text-[#62748e] text-sm hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
