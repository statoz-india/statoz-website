"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../components/shared/Logo";
import { scrollToSection } from "../utils/helpers";
import { APP_DOWNLOAD_URL } from "../utils/constants";

interface HeaderProps {
  onBlogClick?: () => void;
  onHomeClick?: () => void;
  blogHref?: string;
  homeHref?: string;
}

export function Header({
  onBlogClick,
  onHomeClick,
  blogHref,
  homeHref,
}: HeaderProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleScrollToSection = (id: string) => {
    if (pathname !== "/" && homeHref) {
      router.push(`${homeHref}#${id}`);
      setIsMenuOpen(false);
      return;
    }

    scrollToSection(id, () => setIsMenuOpen(false));
  };

  const handleBlogClick = () => {
    if (onBlogClick) {
      onBlogClick();
      setIsMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    if (onHomeClick) {
      onHomeClick();
      setIsMenuOpen(false);
    }
  };

  const showBlogLink = Boolean(onBlogClick || blogHref);

  return (
    <header className="bg-[#08090F] sticky top-0 z-50 w-full border-b border-[#1A1F2E]">
      <div className="container mx-auto px-4 lg:px-32 py-6">
        <div className="flex items-center justify-between">
          {homeHref ? (
            <Link
              href={homeHref}
              onClick={() => setIsMenuOpen(false)}
              className="cursor-pointer"
              aria-label="Go to home"
            >
              <Logo />
            </Link>
          ) : (
            <button
              onClick={handleLogoClick}
              className="cursor-pointer"
              aria-label="Go to home"
            >
              <Logo />
            </button>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleScrollToSection("features")}
              className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollToSection("how-it-works")}
              className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors"
            >
              How It Works
            </button>
            {/* <button
              onClick={() => handleScrollToSection("games")}
              className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors"
            >
              Games
            </button> */}
            {showBlogLink &&
              (blogHref ? (
                <Link
                  href={blogHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors"
                >
                  Blog
                </Link>
              ) : (
                <button
                  onClick={handleBlogClick}
                  className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors"
                >
                  Blog
                </button>
              ))}
            <a
              href={APP_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5cdfff] hover:bg-[#4dcfef] border-2 border-[#5cdfff] px-8 py-3 hover:scale-105 transition-transform"
            >
              <span className="font-onest font-black text-sm text-[#0d1b4b] tracking-wider uppercase">
                Download Now
              </span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-6 flex flex-col gap-4 pb-4">
            <button
              onClick={() => handleScrollToSection("features")}
              className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors text-left"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollToSection("how-it-works")}
              className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors text-left"
            >
              How It Works
            </button>
            <button
              onClick={() => handleScrollToSection("games")}
              className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors text-left"
            >
              Games
            </button>
            {showBlogLink &&
              (blogHref ? (
                <Link
                  href={blogHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors text-left"
                >
                  Blog
                </Link>
              ) : (
                <button
                  onClick={handleBlogClick}
                  className="font-orbitron font-bold text-sm text-[#B8C5D6] uppercase hover:text-white transition-colors text-left"
                >
                  Blog
                </button>
              ))}
            <a
              href={APP_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5cdfff] hover:bg-[#4dcfef] border-2 border-[#5cdfff] px-6 py-3 hover:scale-105 transition-transform w-full text-center"
            >
              <span className="font-onest font-black text-sm text-[#0d1b4b] tracking-wider uppercase">
                Download Now
              </span>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
