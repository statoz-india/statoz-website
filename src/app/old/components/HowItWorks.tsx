"use client";

import { useEffect, useRef, useState } from "react";
import { UserPlus, Target, Trophy, Crown } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "../utils/constants";

const iconMap = {
  UserPlus,
  Target,
  Trophy,
  Crown,
};

export function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    HOW_IT_WORKS_STEPS.map(() => false),
  );
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const indexAttr = (entry.target as HTMLElement).dataset.index;
          const index = Number(indexAttr);
          if (Number.isNaN(index)) return;

          setVisibleSteps((prev) => {
            if (prev[index]) return prev;
            return prev.map((item, i) => (i === index ? true : item));
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );

    stepRefs.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className="container mx-auto px-4 lg:px-32 py-12 lg:py-24"
    >
      <div className="text-center mb-12 lg:mb-16">
        <div className="inline-block bg-linear-to-r from-[#9810fa] to-[#155dfc] px-6 py-2 mb-6">
          <p className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">
            Simple & Powerful
          </p>
        </div>
        <h2 className="font-orbitron font-extrabold text-4xl lg:text-5xl text-white uppercase mb-4">
          HOW IT WORKS
        </h2>
        <p className="font-jakarta text-[#B8C5D6] text-lg lg:text-xl max-w-2xl mx-auto">
          Four steps to start winning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {HOW_IT_WORKS_STEPS.map((step, index) => {
          const Icon = iconMap[step.icon as keyof typeof iconMap];
          return (
            <div
              key={index}
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
              data-index={index}
              className={`relative flex flex-col items-center text-center group transition-all duration-500 ${
                visibleSteps[index]
                  ? [
                      "animate-fade-in-0",
                      "animate-fade-in-250",
                      "animate-fade-in-500",
                      "animate-fade-in-750",
                    ][index]
                  : "translate-y-4 opacity-0"
              }`}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 font-orbitron font-black text-6xl text-[rgba(255,255,255,0.05)] group-hover:text-[rgba(255,255,255,0.1)] transition-colors">
                {step.step}
              </div>

              {/* Icon Container */}
              <div
                className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor: `${step.color}20`,
                  borderColor: step.color,
                }}
              >
                <Icon className="w-10 h-10" style={{ color: step.color }} />
              </div>

              {/* Content */}
              <h3 className="font-orbitron font-extrabold text-lg text-white uppercase mb-3 tracking-wide">
                {step.title}
              </h3>

              <p className="font-jakarta text-[#B8C5D6] text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20px)] h-0.5 bg-linear-to-r from-[rgba(173,70,255,0.3)] to-transparent" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
