"use client";

import { trackPlaystoreClick } from "@/src/lib/analytics/playstoreClick";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function HeaderSection({ isBlack = false }: { isBlack?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const textColorClass = isBlack ? "text-black" : "text-white";
  const hamburgerLineClass = isBlack ? "bg-black" : "bg-white";

  const handlePlaystoreClick = (eventLabel: string) => {
    trackPlaystoreClick({ eventLabel: eventLabel });
  };

  return (
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
      <div className={`hidden md:flex items-center gap-8 ${textColorClass}`}>
        <Link href="/" className={`font-onest font-[16px] ${textColorClass}`}>
          Game
        </Link>
        {/* <button className="font-onest font-[16px] text-white">Blogs</button> */}
        <Link
          href="/faq"
          className={`font-onest font-[16px] ${textColorClass}`}
        >
          FAQ
        </Link>
        <Link
          href="/termsAndConditions"
          className={`font-onest font-[16px] ${textColorClass}`}
        >
          Terms and Conditions
        </Link>
        <Link
          href="/privacyPolicySection"
          className={`font-onest font-[16px] ${textColorClass}`}
        >
          Privacy Policy
        </Link>
      </div>
      {/* Right: CTA (desktop) + hamburger menu (mobile) */}
      <div className="relative">
        <a
          href="https://play.google.com/store/apps/details?id=com.statoz.app"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex w-[176px] h-[56px] border-[1.5px] border-[rgba(15,23,43,0.95)] bg-[rgba(15,23,43,0.95)] opacity-100 gap-2 py-4 px-8 text-white font-medium transition-colors hover:bg-[rgba(15,23,43,1)] items-center justify-center"
          onClick={() => handlePlaystoreClick(`header_desktop_download_button`)}
        >
          Download Now
        </a>

        <button
          type="button"
          className="md:hidden flex h-10 w-10 items-center justify-center "
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-[2px] w-5 ${hamburgerLineClass}`}
            />
            <span
              className={`absolute left-0 top-[6px] h-[2px] w-5 ${hamburgerLineClass}`}
            />
            <span
              className={`absolute left-0 top-[12px] h-[2px] w-5 ${hamburgerLineClass}`}
            />
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
          <Link
            href="/"
            className="block w-full rounded px-3 py-2 text-left font-onest text-[20px] font-bold text-white hover:bg-white/10"
            onClick={() => setMenuOpen(false)}
          >
            Game
          </Link>
          {/* <button
        className="block w-full rounded px-3 py-2 text-left font-onest text-[20px] font-bold text-white hover:bg-white/10"
        onClick={() => setMenuOpen(false)}
      >
        Blogs
      </button> */}
          <Link
            href="/faq"
            className="block w-full rounded px-3 py-2 text-left font-onest text-[20px] font-bold text-white hover:bg-white/10"
            onClick={() => setMenuOpen(false)}
          >
            FAQ
          </Link>

          <Link
            href="/termsAndConditions"
            className="block w-full rounded px-3 py-2 text-left font-onest text-[20px] font-bold text-white hover:bg-white/10"
            onClick={() => setMenuOpen(false)}
          >
            Terms and Conditions
          </Link>
          <Link
            href="/privacyPolicySection"
            className="block w-full rounded px-3 py-2 text-left font-onest text-[20px] font-bold text-white hover:bg-white/10"
            onClick={() => setMenuOpen(false)}
          >
            Privacy Policy
          </Link>
          <a
            href="https://play.google.com/store/apps/details?id=com.statoz.app"
            target="_blank"
            rel="noreferrer"
            className="w-full h-[56px] mt-5 mb-2 border-[1.5px] border-[rgba(15,23,43,0.95)] bg-[rgba(15,23,43,0.95)] opacity-100 gap-2 py-4 px-8 text-white font-medium transition-colors hover:bg-[rgba(15,23,43,1)] flex items-center justify-center"
            onClick={() => {
              handlePlaystoreClick(`hamburger_mobile_download_button`);
              setMenuOpen(false);
            }}
          >
            Download Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default HeaderSection;
