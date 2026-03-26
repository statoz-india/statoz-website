"use client";

import { Instagram, Linkedin, Play, Youtube } from "lucide-react";
import Image from "next/image";
import React from "react";

import { scrollToSection } from "../utils/helpers";
import { APP_DOWNLOAD_URL } from "../utils/constants";
import { Logo } from "./shared/Logo";

type SocialIcon = React.ComponentType<{ className?: string }>;

const WhatsAppIcon: SocialIcon = ({ className }) => (
  <Image
    src="/whatsapp.svg"
    alt="WhatsApp"
    width={20}
    height={20}
    className={className}
  />
);

const XSocialIcon: SocialIcon = ({ className }) => (
  <Image src="/x.svg" alt="X" width={20} height={20} className={className} />
);

const RedditIcon: SocialIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M14.2 15.3a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0Zm-2.6 3.1c-1.9 0-3.2-.9-3.3-2.1a.6.6 0 0 1 1.1-.3c.3.6 1.1 1.1 2.2 1.1s1.9-.4 2.2-1.1a.6.6 0 1 1 1.1.3c-.1 1.2-1.4 2.1-3.3 2.1Zm-2.8-2.2a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm11.2-4.2a1.9 1.9 0 0 0-3.1-1.5 6.8 6.8 0 0 0-4.7-1.8l1-3 2.5.6a1.5 1.5 0 1 0 .3-1.2l-3.1-.7a.6.6 0 0 0-.7.4l-1.2 3.7a6.8 6.8 0 0 0-4.8 1.8A1.9 1.9 0 1 0 5 13.7c0 .2 0 .4.1.6 0 2.8 3 5.1 6.9 5.1s6.9-2.3 6.9-5.1v-.6c.7-.3 1.1-1 1.1-1.7Z" />
  </svg>
);

const socialLinks: Array<{ icon: SocialIcon; href: string; label: string }> = [
  {
    icon: Play,
    href: "https://play.google.com/store/apps/details?id=com.statoz.app",
    label: "Play Store",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@StatozIndia",
    label: "YouTube",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/statozindia/",
    label: "Instagram",
  },
  {
    icon: RedditIcon,
    href: "https://www.reddit.com/r/f2p__predictionmarket/",
    label: "Reddit",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/statoz/",
    label: "LinkedIn",
  },
  { icon: XSocialIcon, href: "https://x.com/StatOzindia", label: "X" },
  {
    icon: WhatsAppIcon,
    href: "https://chat.whatsapp.com/JxKL3sVI7S88qNe0pYXo77",
    label: "WhatsApp",
  },
];

const quickLinks = [
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Download Now", href: APP_DOWNLOAD_URL, external: true },
  { label: "Blog", href: "/allblogs" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Support", href: "#" },
];

export function Footer() {
  return (
    <footer
      id="games"
      className="bg-[#08090F] border-t border-[#1A1F2E] py-12 lg:py-16"
    >
      <div className="container mx-auto px-4 lg:px-32">
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="font-jakarta text-[#B8C5D6] text-sm leading-relaxed">
              The ultimate skill-based prediction gaming platform. Bet on
              events, compete in 100+ live bets, and dominate the leaderboards.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-orbitron font-bold text-white text-sm uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.id || link.href}>
                  {link.href ? (
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="font-jakarta text-[#B8C5D6] text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.id!)}
                      className="font-jakarta text-[#B8C5D6] text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-orbitron font-bold text-white text-sm uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="font-jakarta text-[#B8C5D6] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-orbitron font-bold text-white text-sm uppercase mb-4">
              Follow Us
            </h3>
            <ul className="md:hidden space-y-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <li key={index}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="font-jakarta text-[#B8C5D6] text-sm hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4 text-[#B8C5D6]" />
                      <span>{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="hidden md:flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="bg-[#1A1F2E] w-10 h-10 flex items-center justify-center hover:bg-[#5cdfff] transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-white group-hover:text-[#0D111A]" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1A1F2E] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-jakarta text-[#6B7A8F] text-sm text-center md:text-left">
            © 2026 Statoz. All rights reserved. Built with ❤️ for statoz.in
          </p>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-6">
            <a
              href="mailto:support@statoz.in"
              className="font-jakarta text-[#6B7A8F] text-sm hover:text-white transition-colors"
            >
              support@statoz.in
            </a>
            <a
              href="#"
              className="font-jakarta text-[#6B7A8F] text-sm hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="font-jakarta text-[#6B7A8F] text-sm hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="font-jakarta text-[#6B7A8F] text-sm hover:text-white transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
