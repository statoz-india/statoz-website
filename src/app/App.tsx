"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { TournamentsSection } from "./components/TournamentsSection";
import { HowItWorks } from "./components/HowItWorks";
import { BlogListingPage } from "./components/BlogListingPage";
import { BlogPostPage } from "./components/BlogPostPage";
import { WaitlistSection } from "./components/WaitlistSection";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initializeSEO } from "./utils/seo";
import { initializeErrorHandler } from "./utils/errorHandler";

type ViewType = "home" | "blog-list" | "blog-post";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string>("");

  // Initialize SEO and error handler on app mount
  useEffect(() => {
    initializeErrorHandler();
    initializeSEO();
  }, []);

  const showHome = () => {
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showBlogList = () => {
    setCurrentView("blog-list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showBlogPost = (slug: string) => {
    setCurrentBlogSlug(slug);
    setCurrentView("blog-post");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0D111A] flex flex-col">
        {currentView === "home" && (
          <>
            <Header onBlogClick={showBlogList} onHomeClick={showHome} />
            <main className="flex-1">
              <HeroSection />
              <StatsSection />
              <FeaturesSection />
              <TournamentsSection />
              <HowItWorks />
              <WaitlistSection />
            </main>
            <Footer />
          </>
        )}

        {currentView === "blog-list" && (
          <>
            <Header onBlogClick={showBlogList} onHomeClick={showHome} />
            <BlogListingPage onBlogClick={showBlogPost} />
            <Footer />
          </>
        )}

        {currentView === "blog-post" && (
          <>
            <Header onBlogClick={showBlogList} onHomeClick={showHome} />
            <BlogPostPage
              slug={currentBlogSlug}
              onBack={showBlogList}
              onBlogClick={showBlogPost}
            />
            <Footer />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
