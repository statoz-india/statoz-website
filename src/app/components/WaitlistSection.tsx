"use client";

import { Rocket } from "lucide-react";
import { useState } from "react";
import { StarIcon } from "../components/shared/StarIcon";

export function WaitlistSection() {
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
          type: "waitlist",
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
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to join waitlist. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="waitlist"
      className="bg-linear-to-br from-[rgba(89,22,139,0.5)] to-[rgba(28,57,142,0.5)] border-t-4 border-b-4 border-[rgba(173,70,255,0.5)] py-12 lg:py-16"
    >
      <div className="container mx-auto px-4 lg:px-32">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Icon */}
          {/* <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#9810fa] to-[#e60076] flex items-center justify-center animate-pulse">
            <StarIcon />
          </div> */}

          <div>
            <h2 className="font-orbitron font-extrabold text-4xl lg:text-5xl text-white uppercase mb-4">
              GET EARLY ACCESS
            </h2>
            <p className="font-jakarta text-[#c27aff] text-lg lg:text-xl mb-2">
              Join the waitlist and be among the first to experience epic
              prediction gaming.
            </p>
          </div>

          {/* Email Form */}
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-lg"
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
                disabled={isLoading}
                className="flex-1 bg-[#0f172b] border-2 border-[#1A1F2E] px-6 py-4 text-white placeholder-[#6B7A8F] focus:border-[#5cdfff] focus:outline-none transition-colors font-jakarta disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-linear-to-r from-[#9810fa] to-[#e60076] border-2 border-[#ad46ff] px-8 py-4 flex items-center justify-center gap-2 hover:scale-105 transition-transform whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Rocket className="w-5 h-5 text-white" />
                <span className="font-onest font-black text-base text-white tracking-wider uppercase">
                  {isLoading ? "Joining…" : "Join Now"}
                </span>
              </button>
            </form>
          ) : (
            <div className="bg-linear-to-r from-[#00a63e] to-[#096] border-2 border-[#00ff66] px-8 py-4 w-full max-w-lg">
              <p className="font-jakarta font-bold text-white text-center">
                🎉 {successMessage}
              </p>
            </div>
          )}

          {error && (
            <p className="font-jakarta text-red-400 text-sm max-w-lg">
              {error}
            </p>
          )}

          <p className="font-jakarta text-[#90a1b9] text-sm">
            🎁 First 1,000 members get exclusive launch rewards
          </p>

          <div className="mt-4 bg-[rgba(194,122,255,0.1)] border border-[#c27aff] px-6 py-3">
            <p className="font-jakarta font-bold text-[#c27aff] text-base">
              Early members get 1000 bonus gold coins!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
