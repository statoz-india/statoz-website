"use client";

import {
  Flame,
  Instagram,
  Linkedin,
  Play,
  Sparkles,
  Star,
  Users,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { createElement } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { APP_DOWNLOAD_URL } from "../utils/constants";

export default function DownlaodPage() {
  const socialProofStats = [
    { icon: Star, value: "4.8", label: "Average Rating" },
    { icon: Flame, value: "5,000+", label: "Predictions Made" },
    { icon: Users, value: "Global", label: "Fans Competing" },
  ] as const;

  const socialLinks = [
    {
      label: "Play Store",
      href: "https://play.google.com/store/apps/details?id=com.statoz.app",
      icon: Play,
      style: "hover:border-[#5cdfff]",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@StatozIndia",
      icon: Youtube,
      style: "hover:border-[#ad46ff]",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/statozindia/",
      icon: Instagram,
      style: "hover:border-[#e60076]",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/statoz/",
      icon: Linkedin,
      style: "hover:border-[#00d3f2]",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0D111A] flex flex-col">
      <Header blogHref="/allblogs" homeHref="/" />

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute top-10 left-[-60px] w-56 h-56 rounded-full bg-[#7C86FF] opacity-20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-24 right-[-60px] w-56 h-56 rounded-full bg-[#00d3f2] opacity-20 blur-[100px] pointer-events-none" />

        <section className="container mx-auto px-4 lg:px-32 pt-10 pb-12 lg:pt-16 lg:pb-20">
          <Script
            src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
            strategy="afterInteractive"
          />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#7C86FF] to-[#ad46ff] px-4 py-2 mb-5">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="font-orbitron text-white text-xs font-bold tracking-wider">
                  FREE TO PLAY
                </span>
              </div>

              <h1 className="font-orbitron font-black text-3xl sm:text-4xl lg:text-6xl leading-tight uppercase text-white">
                Sports Prediction Game. 100% Free.
              </h1>

              <p className="font-jakarta text-[#B8C5D6] text-base sm:text-lg mt-4">
                Predict matches, climb leaderboards, earn rewards.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start items-stretch sm:items-center">
                <a
                  href={APP_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-[#5cdfff] border-2 border-[#5cdfff] hover:bg-[#4dcfef] hover:border-[#4dcfef] transition-all duration-300 px-6 py-4 flex items-center justify-center gap-4 w-full sm:w-auto sm:min-w-[300px] hover:scale-[1.02]"
                >
                  <div className="bg-[#0d1b4b] p-2.5 group-hover:bg-[#102465] transition-colors">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-7 h-7 text-[#5cdfff]"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-orbitron text-[#0d1b4b] text-[11px] uppercase tracking-wider opacity-80">
                      Get it on
                    </p>
                    <p className="font-orbitron text-[#0d1b4b] text-lg sm:text-xl font-bold">
                      Google Play
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="w-full max-w-[460px] mx-auto lg:mx-0 lg:justify-self-end">
              <div className="aspect-square w-full">
                {createElement("lottie-player", {
                  src: "/download home.json",
                  background: "transparent",
                  speed: "1",
                  loop: true,
                  autoplay: true,
                  style: { width: "100%", height: "100%" },
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-linear-to-r from-[rgba(89,22,139,0.2)] to-[rgba(28,57,142,0.2)] py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-32">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 lg:gap-12">
              {socialProofStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col items-center gap-3">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#c27aff]" />
                    <p className="font-orbitron font-extrabold text-2xl sm:text-4xl text-white text-center">
                      {item.value}
                    </p>
                    <p className="font-orbitron font-semibold text-[10px] sm:text-sm text-[rgba(255,255,255,0.55)] uppercase text-center">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-32 py-10 lg:py-14">
          <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="font-orbitron font-bold text-white text-xl sm:text-2xl uppercase">
                Follow Statoz
              </h2>
              <p className="font-jakarta text-[#8b95a5] text-sm sm:text-base mt-1">
                Stay updated on matches, rewards, and new prediction drops.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-[#111827] border border-[#2a3552] ${item.style} px-3 py-3 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#1A2335] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#B8C5D6]" />
                    </div>
                    <span className="font-orbitron text-[11px] sm:text-xs text-[#d9e4f0] uppercase tracking-wide">
                      {item.label}
                    </span>
                  </a>
                );
              })}
              <a
                href="https://x.com/StatOzindia"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111827] border border-[#2a3552] hover:border-[#5cdfff] px-3 py-3 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-[#1A2335] flex items-center justify-center">
                  <Image src="/x.svg" alt="X" width={16} height={16} />
                </div>
                <span className="font-orbitron text-[11px] sm:text-xs text-[#d9e4f0] uppercase tracking-wide">
                  X
                </span>
              </a>
              <a
                href="https://www.reddit.com/r/f2p__predictionmarket/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111827] border border-[#2a3552] hover:border-[#ff8c00] px-3 py-3 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-[#1A2335] flex items-center justify-center">
                  <span className="font-orbitron text-[10px] text-[#B8C5D6]">R</span>
                </div>
                <span className="font-orbitron text-[11px] sm:text-xs text-[#d9e4f0] uppercase tracking-wide">
                  Reddit
                </span>
              </a>
              <a
                href="https://chat.whatsapp.com/JxKL3sVI7S88qNe0pYXo77"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111827] border border-[#2a3552] hover:border-[#00a63e] px-3 py-3 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-[#1A2335] flex items-center justify-center">
                  <Image src="/whatsapp.svg" alt="WhatsApp" width={16} height={16} />
                </div>
                <span className="font-orbitron text-[11px] sm:text-xs text-[#d9e4f0] uppercase tracking-wide">
                  WhatsApp
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-32 pb-12 lg:pb-16">
          <div className="p-4 sm:p-6 border-t border-[#2a3552]">
            <h2 className="font-orbitron font-bold text-white text-2xl sm:text-3xl uppercase tracking-wide">
              Learn more about us
            </h2>
            <p className="font-jakarta text-[#9aa7bb] text-sm sm:text-base mt-2 max-w-2xl">
              Explore who we are, what we build, and the latest from Statoz.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/"
                className="bg-[#5cdfff] text-[#0d1b4b] font-orbitron text-xs sm:text-sm font-bold uppercase tracking-wide px-5 py-2.5 hover:bg-[#4dcfef] hover:scale-[1.02] transition-all duration-300"
              >
                Visit Home
              </a>
              <a
                href="/allblogs"
                className="bg-transparent border border-[#2f4f77] text-[#d9e4f0] font-orbitron text-xs sm:text-sm font-bold uppercase tracking-wide px-5 py-2.5 hover:border-[#5cdfff] hover:text-[#5cdfff] hover:scale-[1.02] transition-all duration-300"
              >
                Read Blogs
              </a>
            </div>
          </div>
        </section>

        {/* Feedback form temporarily disabled */}
      </main>

      <Footer />
    </div>
  );
}
