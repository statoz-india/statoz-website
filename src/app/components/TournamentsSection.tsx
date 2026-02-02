"use client";

import { Calendar, MapPin, Trophy, Zap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { TOURNAMENTS_DATA } from "../utils/constants";
import { useState } from "react";

// Tournament images - Different trophy for each tournament
const TOURNAMENT_IMAGES = [
  "https://images.unsplash.com/photo-1700700736009-d81a41e850a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUMjAlMjBjcmlja2V0JTIwd29ybGQlMjBjdXAlMjB0cm9waHklMjAyMDI0fGVufDF8fHx8MTc2OTg2NTEwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", // T20 Cricket Trophy
  "https://images.unsplash.com/photo-1580831800257-f83135932664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJUEwlMjBjcmlja2V0JTIwdHJvcGh5JTIwZ29sZGVufGVufDF8fHx8MTc2OTg2NTEwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", // IPL Trophy
  "https://images.unsplash.com/photo-1620756634852-2190ad694c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGSUZBJTIwd29ybGQlMjBjdXAlMjB0cm9waHklMjBnb2xkZW4lMjBmb290YmFsbHxlbnwxfHx8fDE3Njk4NjUxMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", // FIFA World Cup Trophy
] as const;

function TournamentCard({
  tournament,
  imageUrl,
}: {
  tournament: (typeof TOURNAMENTS_DATA)[number];
  imageUrl: string;
}) {
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const linearFromTo = tournament.gradient;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setShowInput(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div
      className={`group relative bg-[rgba(20,25,35,0.8)] border-2 border-[#1A1F2E] hover:border-[${tournament.accentColor}] transition-all duration-500 overflow-hidden`}
    >
      {/* Card content wrapper */}
      <div className="flex flex-col lg:flex-row">
        {/* Image section */}
        <div className="relative lg:w-1/3 aspect-square overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={tournament.title}
            className="w-full h-full object-cover"
          />

          {/* Sport badge */}
          <div className="absolute top-4 left-4 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm px-4 py-2 border border-[rgba(255,255,255,0.2)]">
            <span className="font-orbitron text-white text-xs font-bold tracking-widest">
              {tournament.sport.toUpperCase()}
            </span>
          </div>

          {/* Glowing corner effect */}
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${linearFromTo} opacity-0 group-hover:opacity-50 blur-3xl transition-opacity duration-500`}
          ></div>
        </div>

        {/* Content section */}
        <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between">
          {/* Header */}
          <div>
            <h3 className="font-orbitron font-bold text-2xl lg:text-3xl text-white uppercase mb-4 tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-[#7C86FF] group-hover:to-[#00d4ff] transition-all duration-300">
              {tournament.title}
            </h3>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar
                  className={`w-4 h-4 text-[${tournament.accentColor}]`}
                />
                <span className="font-orbitron text-[#B8C5D6] text-sm">
                  {tournament.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin
                  className={`w-4 h-4 text-[${tournament.accentColor}]`}
                />
                <span className="font-orbitron text-[#B8C5D6] text-sm">
                  {tournament.location}
                </span>
              </div>
            </div>

            <p className="font-jakarta text-[#B8C5D6] text-base leading-relaxed mb-6">
              {tournament.description}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 mt-auto">
            {tournament.stats.map((stat, statIndex) => (
              <div
                key={statIndex}
                className="bg-[rgba(29,41,61,0.6)] border border-[rgba(124,134,255,0.2)] p-4 hover:border-[rgba(124,134,255,0.6)] transition-colors"
              >
                <div
                  className={`font-orbitron font-bold text-xl lg:text-2xl text-transparent bg-clip-text bg-linear-to-r ${linearFromTo} mb-1`}
                >
                  {stat.value}
                </div>
                <div className="font-orbitron text-[#8b95a5] text-xs uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="mt-6">
            {!showInput && !isSubmitted && (
              <button
                onClick={() => setShowInput(true)}
                className={`group/btn inline-flex items-center gap-2 bg-linear-to-r ${linearFromTo} px-6 py-3 font-orbitron text-white text-sm font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(124,134,255,0.5)] transition-all duration-300`}
              >
                <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
                Get Notified
              </button>
            )}

            {showInput && !isSubmitted && (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 animate-[slideIn_0.3s_ease-out]"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoFocus
                  className="flex-1 px-4 py-3 bg-[rgba(29,41,61,0.8)] border-2 border-[rgba(124,134,255,0.3)] text-white font-orbitron text-sm placeholder:text-[#8b95a5] focus:border-[rgba(124,134,255,0.8)] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className={`inline-flex items-center justify-center gap-2 bg-linear-to-r ${linearFromTo} px-6 py-3 font-orbitron text-white text-sm font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(124,134,255,0.5)] transition-all duration-300 whitespace-nowrap`}
                >
                  <Zap className="w-4 h-4" />
                  Submit
                </button>
              </form>
            )}

            {isSubmitted && (
              <div className="flex items-center gap-3 text-[#5cdfff] animate-[bounce_0.5s_ease-in-out]">
                <div className="w-8 h-8 rounded-full border-4 border-[#5cdfff] flex items-center justify-center animate-[scaleIn_0.5s_ease-out]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-orbitron text-sm font-bold uppercase tracking-wider">
                  You&apos;re on the list!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TournamentsSection() {
  return (
    <section
      id="tournaments"
      className="container mx-auto px-4 lg:px-32 py-12 lg:py-24 relative overflow-hidden"
    >
      {/* Background gradient effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7C86FF] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFB800] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="text-center mb-12 lg:mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#7C86FF] to-[#ad46ff] px-4 py-2 mb-6">
          <Trophy className="w-5 h-5 text-white" />
          <span className="font-orbitron text-white text-sm font-bold tracking-wider">
            UPCOMING TOURNAMENTS
          </span>
        </div>

        <h2 className="font-orbitron font-extrabold text-4xl lg:text-5xl text-white uppercase mb-4">
          Major Events 2026
        </h2>
        <p className="font-jakarta text-[#B8C5D6] text-lg lg:text-xl max-w-3xl mx-auto">
          Get ready for the biggest sporting events of 2026. Join thousands of
          players in epic prediction battles.
        </p>
      </div>

      <div className="space-y-8 relative z-10">
        {TOURNAMENTS_DATA.map((tournament, index) => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            imageUrl={TOURNAMENT_IMAGES[index % TOURNAMENT_IMAGES.length]}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 lg:mt-16 text-center relative z-10">
        <div className="bg-[rgba(20,25,35,0.8)] border-2 border-[#1A1F2E] p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-[#7C86FF] to-[#00d4ff] opacity-5"></div>
          <div className="relative z-10">
            <h3 className="font-orbitron font-extrabold text-2xl lg:text-3xl text-white uppercase mb-4">
              Don&apos;t Miss Out
            </h3>
            <p className="font-jakarta text-[#B8C5D6] text-base lg:text-lg max-w-2xl mx-auto mb-6">
              Join the waitlist to get early access before these tournaments
              begin. Be among the first to predict, compete, and win.
            </p>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 bg-linear-to-r from-[#7C86FF] to-[#ad46ff] px-8 py-4 font-orbitron text-white text-base font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(124,134,255,0.6)] transition-all duration-300"
            >
              <Trophy className="w-5 h-5" />
              Join Waitlist
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
