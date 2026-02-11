"use client";

import { BlogListingPage } from "../components/BlogListingPage";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export default function AllBlogsPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0D111A] flex flex-col">
        <Header blogHref="/allblogs" homeHref="/" />
        <BlogListingPage />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
