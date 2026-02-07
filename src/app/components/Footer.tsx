import {
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  X,
  XIcon,
  XSquareIcon,
} from "lucide-react";

import { scrollToSection } from "../utils/helpers";
import { Logo } from "./shared/Logo";

const WhatsAppIcon = (props: any) => (
  <img src="/whatsapp.svg" alt="WhatsApp" {...props} />
);

const XSocialIcon = (props: any) => (
  <img src="/x.svg" alt="X" {...props} />
);

const socialLinks = [
  { icon: XSocialIcon, href: "https://x.com/StatOzindia", label: "x" },
  {
    icon: Instagram,
    href: "https://www.instagram.com/statozindia/",
    label: "Instagram",
  },
  {
    icon: WhatsAppIcon,
    href: "https://chat.whatsapp.com/IQV7FSn106e6zbbEV9kOU3",
    label: "WhatsApp",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61587267737793",
    label: "Facebook",
  },
];

const quickLinks = [
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Join Waitlist", id: "waitlist" },
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
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="font-jakarta text-[#B8C5D6] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
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
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
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
          <div className="flex gap-6">
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
