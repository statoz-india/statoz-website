"use client";

import { Calendar, MapPin, Trophy, Zap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { TOURNAMENTS_DATA } from "../utils/constants";
import { useEffect, useRef, useState } from "react";
import { APP_DOWNLOAD_URL } from "../utils/constants";

// Tournament images - Different trophy for each tournament
const TOURNAMENT_IMAGES = [
  "/it20.png", // T20 Cricket Trophy
  "/iplt20.png", // IPL Trophy
  "/fifa2026.png", // FIFA World Cup Trophy
] as const;

function TournamentCard({
  tournament,
  imageUrl,
}: {
  tournament: (typeof TOURNAMENTS_DATA)[number];
  imageUrl: string;
}) {
  const linearFromTo = tournament.gradient;
  const isWaitlistOnly = tournament.id === "fifa-2026";
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          type: `get-notified-${tournament.title}`,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          (data as { message?: string }).message ?? "Something went wrong",
        );
      }

      setSuccessMessage(
        (data as { message?: string }).message ?? "You're on the list!",
      );
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => {
        setIsSubmitted(false);
        setShowInput(false);
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join. Try again.");
    } finally {
      setIsLoading(false);
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
            {isWaitlistOnly ? (
              <>
                {!showInput && !isSubmitted && (
                  <button
                    onClick={() => setShowInput(true)}
                    className={`group/btn inline-flex items-center gap-2 bg-linear-to-r ${linearFromTo} px-6 py-3 font-orbitron text-white text-sm font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(124,134,255,0.5)] transition-all duration-300`}
                  >
                    <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
                    Join Waitlist
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      placeholder="Enter your email"
                      required
                      autoFocus
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 bg-[rgba(29,41,61,0.8)] border-2 border-[rgba(124,134,255,0.3)] text-white font-orbitron text-sm placeholder:text-[#8b95a5] focus:border-[rgba(124,134,255,0.8)] focus:outline-none transition-colors disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex items-center justify-center gap-2 bg-linear-to-r ${linearFromTo} px-6 py-3 font-orbitron text-white text-sm font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(124,134,255,0.5)] transition-all duration-300 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      <Zap className="w-4 h-4" />
                      {isLoading ? "Joining..." : "Submit"}
                    </button>
                  </form>
                )}

                {error && (
                  <p className="font-jakarta text-red-400 text-sm mt-2">{error}</p>
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
                      {successMessage ?? "You're on the list!"}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <a
                href={APP_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/btn inline-flex items-center gap-2 bg-linear-to-r ${linearFromTo} px-6 py-3 font-orbitron text-white text-sm font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(124,134,255,0.5)] transition-all duration-300`}
              >
                <Trophy className="w-4 h-4" />
                Download Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TournamentsSection() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    TOURNAMENTS_DATA.map(() => false),
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const indexAttr = (entry.target as HTMLElement).dataset.index;
          const index = Number(indexAttr);
          if (Number.isNaN(index)) return;

          setVisibleCards((prev) => {
            if (prev[index]) return prev;
            return prev.map((item, i) => (i === index ? true : item));
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="tournaments"
      className="container mx-auto px-4 pb-0 pt-12 lg:px-32 lg:pb-0 lg:pt-24 relative overflow-hidden"
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
          <div
            key={tournament.id}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            data-index={index}
            className={`transition-all duration-500 ${
              visibleCards[index]
                ? [
                    "animate-fade-in-0",
                    "animate-fade-in-250",
                    "animate-fade-in-500",
                  ][index % 3]
                : "translate-y-4 opacity-0"
            }`}
          >
            <TournamentCard
              tournament={tournament}
              imageUrl={TOURNAMENT_IMAGES[index % TOURNAMENT_IMAGES.length]}
            />
          </div>
        ))}
      </div>

    </section>
  );
}
