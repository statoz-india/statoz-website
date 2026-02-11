"use client";

import {
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Slider, { type CustomArrowProps } from "react-slick";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BLOG_POSTS, type BlogPost } from "../utils/blogData";

interface BlogCardProps {
  post: BlogPost;
  onReadMore?: (slug: string) => void;
  blogBasePath: string;
}

function BlogCard({ post, onReadMore, blogBasePath }: BlogCardProps) {
  const href = `${blogBasePath}/${post.slug}`;

  return (
    <Link
      href={href}
      onClick={() => onReadMore?.(post.slug)}
      className="group bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] hover:border-[#5cdfff] transition-all duration-300 overflow-hidden flex flex-col mx-3 h-[580px] cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <ImageWithFallback
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-[#5cdfff] px-3 py-1 font-orbitron text-[#0a0f1e] text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col min-h-0">
        {/* Meta */}
        <div className="flex items-center gap-4 mb-3 text-[#8b95a5] text-xs flex-shrink-0">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className="font-orbitron">
              {new Date(post.publishDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-orbitron">{post.readTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-orbitron font-bold text-lg text-white mb-3 group-hover:text-[#5cdfff] transition-colors line-clamp-2 flex-shrink-0 overflow-hidden"
          style={{ lineHeight: "1.4", height: "3.92rem" }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          className="font-jakarta text-[#cad5e2] text-sm mb-4 line-clamp-3 flex-shrink-0 overflow-hidden"
          style={{ lineHeight: "1.5", height: "4.5rem" }}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0 h-[28px] overflow-hidden">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-[rgba(92,223,255,0.1)] border border-[rgba(92,223,255,0.3)] px-2 py-1 text-[#5cdfff] font-orbitron text-xs"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Read More */}
        <div className="inline-flex items-center gap-2 text-[#5cdfff] font-orbitron text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all mt-auto">
          Read Article
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

// Custom Arrow Components
function PrevArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#5cdfff] hover:bg-[#4ac9eb] text-[#0a0f1e] p-3 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(92,223,255,0.5)]"
      aria-label="Previous"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
}

function NextArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#5cdfff] hover:bg-[#4ac9eb] text-[#0a0f1e] p-3 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(92,223,255,0.5)]"
      aria-label="Next"
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );
}

interface BlogsSectionProps {
  onBlogClick?: (slug: string) => void;
  onViewAll?: () => void;
  viewAllHref?: string;
  blogBasePath?: string;
}

export function BlogsSection({
  onBlogClick,
  onViewAll,
  viewAllHref,
  blogBasePath = "/allblogs",
}: BlogsSectionProps) {
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setSlidesToShow(1);
        return;
      }
      if (width < 1024) {
        setSlidesToShow(2);
        return;
      }
      setSlidesToShow(3);
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dotsClass: "slick-dots !bottom-[-40px]",
    customPaging: () => (
      <div className="w-3 h-3 bg-[#1d293d] hover:bg-[#5cdfff] transition-colors" />
    ),
  };

  // Get the first 6 blog posts
  const featuredBlogs = BLOG_POSTS.slice(0, 6);

  return (
    <section className="bg-[#0D111A] py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-32">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C86FF] to-[#5cdfff] px-4 py-2 mb-6">
            <span className="font-orbitron text-white text-sm font-bold tracking-wider">
              LATEST INSIGHTS
            </span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl lg:text-5xl text-white uppercase mb-4">
            From The Blog
          </h2>
          <p className="font-jakarta text-[#B8C5D6] text-base lg:text-lg max-w-2xl mx-auto">
            Expert guides, tournament previews, and winning strategies to
            dominate your predictions.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative pb-16 px-8">
          <Slider {...settings}>
            {featuredBlogs.map((post) => (
              <div key={post.id} className="px-2">
                <BlogCard
                  post={post}
                  onReadMore={onBlogClick}
                  blogBasePath={blogBasePath}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9810fa] to-[#155dfc] px-8 py-4 font-orbitron text-white text-base font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(92,223,255,0.6)] transition-all duration-300 group"
            >
              View All Articles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9810fa] to-[#155dfc] px-8 py-4 font-orbitron text-white text-base font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(92,223,255,0.6)] transition-all duration-300 group"
            >
              View All Articles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Custom Slick Carousel Styles */}
      <style>{`
        .slick-dots li button:before {
          display: none;
        }
        .slick-dots li div {
          background: #1d293d;
          transition: background 0.3s;
        }
        .slick-dots li.slick-active div {
          background: #5cdfff;
        }
        .slick-slide > div {
          display: flex;
          height: 100%;
        }
        .slick-track {
          display: flex;
          align-items: stretch;
        }
      `}</style>
    </section>
  );
}
