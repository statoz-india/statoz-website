"use client";

import { useState } from "react";
import Image from "next/image";

function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-[linear-gradient(180deg,#000000_0%,#131D31_25%,#1D293D_50%,#131D31_75%,#000000_100%)]">
      {/* Top Nav Bar */}
      <div className="w-full px-6 md:px-10 py-10 md:py-5 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center ">
          <Image
            src="/revamped/logo_text.png"
            alt="StatOz logo"
            width={78}
            height={24}
            className="h-auto w-auto"
            priority
          />
        </div>

        {/* Center: nav buttons */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <button className="font-onest font-[16px] text-white">Game</button>
          {/* <button className="font-onest font-[16px] text-white">Blogs</button> */}
          <button className="font-onest font-[16px] text-white">FAQ</button>
        </div>
        {/* Right: CTA (desktop) + hamburger menu (mobile) */}
        <div className="relative">
          <button className="hidden md:flex w-[176px] h-[56px] border-[1.5px] border-[rgba(15,23,43,0.95)] bg-[rgba(15,23,43,0.95)] opacity-100 gap-2 py-4 px-8 text-white font-medium transition-colors hover:bg-[rgba(15,23,43,1)]">
            Download Now
          </button>

          <button
            type="button"
            className="md:hidden flex h-10 w-10 items-center justify-center "
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="relative block h-4 w-5">
              <span className="absolute left-0 top-0 h-[2px] w-5 bg-white" />
              <span className="absolute left-0 top-[6px] h-[2px] w-5 bg-white" />
              <span className="absolute left-0 top-[12px] h-[2px] w-5 bg-white" />
            </span>
          </button>

          <div
            className={[
              "fixed z-50 left-5 right-5 bg-[#0D111A] p-2 shadow-lg ring-1 ring-white/15 overflow-hidden transition-all duration-300 ease-out",
              menuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none",
            ].join(" ")}
          >
            <button
              className="block w-full rounded px-3 py-2 text-left font-onest text-[20px] font-bold text-white hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              Game
            </button>
            {/* <button
              className="block w-full rounded px-3 py-2 text-left font-onest text-[20px] font-bold text-white hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              Blogs
            </button> */}
            <button
              className="block w-full rounded px-3 py-2 text-left font-onest text-[20px] font-bold text-white hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              FAQ
            </button>
            <button className="w-full h-[56px] mt-5 mb-2 border-[1.5px] border-[rgba(15,23,43,0.95)] bg-[rgba(15,23,43,0.95)] opacity-100 gap-2 py-4 px-8 text-white font-medium transition-colors hover:bg-[rgba(15,23,43,1)]">
              Download Now
            </button>
          </div>
        </div>
      </div>

      {/* Ipl Arena Image */}
      <div className="flex items-center justify-center">
        <div className="h-[64px] w-[16px] bg-[#005A70] [clip-path:polygon(25%_0%,75%_0%,100%_12%,100%_88%,75%_100%,25%_100%,0%_88%,0%_12%)]" />
        <div className="mx-8 ">
          <Image
            src="/revamped/ipl_arena.png"
            alt="IPL arena"
            width={430}
            height={40}
            className="object-contain"
            priority
          />
        </div>
        <div className="h-[64px] w-[16px] bg-[#005A70] [clip-path:polygon(25%_0%,75%_0%,100%_12%,100%_88%,75%_100%,25%_100%,0%_88%,0%_12%)]" />
      </div>

      {/* Features desktop view */}
      <div className="hidden md:flex items-center justify-center mt-5">
        <div className="px-4 py-3 mx-1 bg-[#0F172B80] border border-[#1D293D] flex items-center justify-center">
          <Image
            src="/revamped/prize_pool.png"
            alt="Prize pool"
            width={24}
            height={24}
            className="object-contain"
            priority
          />
          <div className="w-3"></div>
          <span className="font-onest text-white text-[14px] font-bold uppercase">
            10k Prize Pool
          </span>
        </div>
        <div className="px-4 py-3 mx-1 bg-[#0F172B80] border border-[#1D293D] flex items-center justify-center">
          <Image
            src="/revamped/free_play.png"
            alt="Free Play"
            width={24}
            height={24}
            className="object-contain"
            priority
          />
          <div className="w-3"></div>
          <span className="font-onest text-white text-[14px] font-bold uppercase">
            Free to Play
          </span>
        </div>
        <div className="px-4 py-3 mx-1 bg-[#0F172B80] border border-[#1D293D] flex items-center justify-center">
          <Image
            src="/revamped/live_matches.png"
            alt="Live Matches"
            width={24}
            height={24}
            className="object-contain"
            priority
          />
          <div className="w-3"></div>
          <span className="font-onest text-white text-[14px] font-bold uppercase">
            Live Matches
          </span>
        </div>
      </div>

      {/* Features mobile view */}
      <div className="flex flex-col md:hidden items-center justify-center mt-5">
        <div className="w-full">
          <div className="px-4 py-3 mx-4 bg-[#0F172B80] border border-[#1D293D] flex items-center justify-center">
            <Image
              src="/revamped/prize_pool.png"
              alt="Prize pool"
              width={24}
              height={24}
              className="object-contain"
              priority
            />
            <div className="w-3"></div>
            <span className="font-onest text-white text-[14px] font-bold uppercase">
              10k Prize Pool
            </span>
          </div>
        </div>

        <div className="flex flex-row mx-4 w-full">
          <div className="flex-1 px-4 py-3 ml-4 bg-[#0F172B80] border border-[#1D293D] flex items-center justify-center">
            <Image
              src="/revamped/free_play.png"
              alt="Free Play"
              width={24}
              height={24}
              className="object-contain"
              priority
            />
            <div className="w-3"></div>
            <span className="font-onest text-white text-[14px] font-bold uppercase">
              Free to Play
            </span>
          </div>
          <div className="flex-1 px-4 py-3 mr-4 bg-[#0F172B80] border border-[#1D293D] flex items-center justify-center">
            <Image
              src="/revamped/live_matches.png"
              alt="Live Matches"
              width={24}
              height={24}
              className="object-contain"
              priority
            />
            <div className="w-3"></div>
            <span className="font-onest text-white text-[14px] font-bold uppercase">
              Live Matches
            </span>
          </div>
        </div>
      </div>

      {/* Predict Match text */}
      <div className="flex items-center justify-center my-2">
        <span className="font-onest text-[#90A1B9] text-[14px]">
          Predict Match Events & Win Prizes
        </span>
      </div>

      {/* IPL Players */}
      <div className="relative w-screen md:w-[800px] h-[463px] md:h-[680px] md:mx-auto mt-10 overflow-x-hidden overflow-y-hidden md:overflow-x-visible md:overflow-y-visible">
        {/* 1. StatOz text — fades in from top first */}
        <div className="absolute top-0 md:left-1/2 md:-translate-x-1/2 w-screen md:w-full aspect-393/62 md:aspect-800/137">
          <Image
            src="/revamped/statoz_text.png"
            alt="Statoz Text"
            fill
            className="object-contain hero-text-enter"
            priority
          />
        </div>

        {/* 2. Background arch — fades in second */}
        <div className="absolute md:top-[120px] left-1/2 -translate-x-1/2 md:mt-4 w-screen md:w-[800px] aspect-370/527 md:aspect-800/544">
          <Image
            src="/revamped/excluded.png"
            alt="Exclude"
            fill
            className="object-contain hero-bg-enter"
            priority
          />
        </div>

        {/* 3–7. Players slide up one by one */}
        <div className="absolute -top-[10%] md:-top-[15px] -left-[8%] md:left-[48px] z-10 w-[309px] md:w-[461px] aspect-309/463 md:aspect-461/692">
          <Image
            src="/revamped/sg.png"
            alt="SG"
            fill
            className="object-contain player-enter player-enter-1"
            priority
          />
        </div>
        <div className="absolute left-[50%] md:left-[370px] top-[5px] z-20 w-[257px] md:w-[412px] aspect-257/386 md:aspect-412/616">
          <Image
            src="/revamped/ss.png"
            alt="SS"
            fill
            className="object-contain player-enter player-enter-2"
            priority
          />
        </div>
        <div className="absolute -left-[12%] md:-left-[15px] top-[8%] md:top-[52px] z-30 w-[279px] md:w-[416px] aspect-279/418 md:aspect-416/625">
          <Image
            src="/revamped/as.png"
            alt="AS"
            fill
            className="object-contain player-enter player-enter-3"
            priority
          />
        </div>
        <div className="absolute left-[68%] top-[20%] w-[240px] md:left-[480px] md:top-[138px] z-40  md:w-[360px] aspect-24/38 md:aspect-360/538">
          <Image
            src="/revamped/rs.png"
            alt="RS"
            fill
            className="object-contain player-enter player-enter-4"
            priority
          />
        </div>
        <div className="absolute z-50 w-[453px] -left-[10%] md:left-0 md:w-[677px] aspect-square">
          <Image
            src="/revamped/vk.png"
            alt="VK"
            fill
            className="object-contain player-enter player-enter-5"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
