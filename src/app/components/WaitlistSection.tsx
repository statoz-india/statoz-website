import { Rocket } from 'lucide-react';
import { useState } from 'react';

export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section 
      id="waitlist"
      className="bg-gradient-to-br from-[rgba(89,22,139,0.5)] to-[rgba(28,57,142,0.5)] border-t-4 border-b-4 border-[rgba(173,70,255,0.5)] py-12 lg:py-16"
    >
      <div className="container mx-auto px-4 lg:px-32">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9810fa] to-[#e60076] flex items-center justify-center animate-pulse">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 60 60">
              <path d="M25.1738 39.2661C24.9476 38.3894 24.4906 37.5893 23.8504 36.9491C23.2102 36.3088 22.4101 35.8519 21.5334 35.6257L5.99134 31.618C5.72618 31.5427 5.4928 31.383 5.32662 31.1631C5.16045 30.9432 5.07054 30.6751 5.07054 30.3994C5.07054 30.1238 5.16045 29.8557 5.32662 29.6358C5.4928 29.4158 5.72618 29.2561 5.99134 29.1809L21.5334 25.1706C22.4098 24.9447 23.2096 24.4881 23.8498 23.8483C24.49 23.2086 24.9472 22.409 25.1738 21.5327L29.1815 5.99073C29.256 5.72453 29.4155 5.49 29.6358 5.32293C29.856 5.15587 30.1249 5.06543 30.4013 5.06543C30.6777 5.06543 30.9466 5.15587 31.1668 5.32293C31.3871 5.49 31.5466 5.72453 31.6211 5.99073L35.6263 21.5327C35.8525 22.4095 36.3094 23.2096 36.9497 23.8498C37.5899 24.49 38.39 24.947 39.2667 25.1731L54.8087 29.1784C55.076 29.2521 55.3117 29.4114 55.4796 29.632C55.6476 29.8526 55.7386 30.1222 55.7386 30.3994C55.7386 30.6767 55.6476 30.9463 55.4796 31.1668C55.3117 31.3874 55.076 31.5468 54.8087 31.6205L39.2667 35.6257C38.39 35.8519 37.5899 36.3088 36.9497 36.9491C36.3094 37.5893 35.8525 38.3894 35.6263 39.2661L31.6186 54.8081C31.5441 55.0743 31.3845 55.3088 31.1643 55.4759C30.944 55.643 30.6752 55.7334 30.3988 55.7334C30.1223 55.7334 29.8535 55.643 29.6332 55.4759C29.413 55.3088 29.2535 55.0743 29.179 54.8081L25.1738 39.2661Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            </svg>
          </div>

          <div>
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-4xl lg:text-5xl text-white uppercase mb-4">GET EARLY ACCESS</h2>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#c27aff] text-lg lg:text-xl mb-2">
              Join the waitlist and be among the first to experience epic prediction gaming.
            </p>
          </div>

          {/* Email Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-[#0f172b] border-2 border-[#314158] px-6 py-4 text-white placeholder-[#62748e] focus:border-[#ad46ff] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#9810fa] to-[#e60076] border-2 border-[#ad46ff] px-8 py-4 flex items-center justify-center gap-2 hover:scale-105 transition-transform whitespace-nowrap"
              >
                <Rocket className="w-5 h-5 text-white" />
                <span className="font-['Onest',sans-serif] font-black text-base text-white tracking-wider uppercase">Join Now</span>
              </button>
            </form>
          ) : (
            <div className="bg-gradient-to-r from-[#00a63e] to-[#096] border-2 border-[#00ff66] px-8 py-4 w-full max-w-lg">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-white text-center">
                🎉 You're on the list! Check your email for confirmation.
              </p>
            </div>
          )}

          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#90a1b9] text-sm">
            🎁 First 1,000 members get exclusive launch rewards
          </p>

          <div className="mt-4 bg-[rgba(194,122,255,0.1)] border border-[#c27aff] px-6 py-3">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#c27aff] text-base">
              Early members get 1000 bonus gold coins!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
