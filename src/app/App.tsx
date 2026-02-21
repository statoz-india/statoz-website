"use client";

import { useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { TournamentsSection } from "./components/TournamentsSection";
import { HowItWorks } from "./components/HowItWorks";
import { BlogsSection } from "./components/BlogsSection";
import { DownloadSection } from "./components/DownloadSection";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initializeSEO } from "./utils/seo";
import { initializeErrorHandler } from "./utils/errorHandler";

export default function App() {
  // Initialize SEO and error handler on app mount
  useEffect(() => {
    initializeErrorHandler();
    initializeSEO();
  }, []);
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0D111A] flex flex-col">
        <Header blogHref="/allblogs" homeHref="/" />
        <main className="flex-1">
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <TournamentsSection />
          <HowItWorks />
          <DownloadSection />
          <BlogsSection viewAllHref="/allblogs" />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
