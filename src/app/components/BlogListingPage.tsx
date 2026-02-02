"use client";
import { useState } from "react";
import { Calendar, Clock, Tag, ArrowRight, Search, Filter } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  BLOG_POSTS,
  getAllCategories,
  getAllTags,
  type BlogPost,
} from "../utils/blogData";

interface BlogCardProps {
  post: BlogPost;
  onReadMore: (slug: string) => void;
}

function BlogCard({ post, onReadMore }: BlogCardProps) {
  return (
    <article className="group bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] hover:border-[#5cdfff] transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
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
      <div className="p-6 flex-1 flex flex-col">
        {/* Meta */}
        <div className="flex items-center gap-4 mb-3 text-[#8b95a5] text-xs">
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
        <h3 className="font-orbitron font-bold text-xl text-white mb-3 group-hover:text-[#5cdfff] transition-colors leading-tight">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="font-jakarta text-[#cad5e2] text-sm leading-relaxed mb-4 flex-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
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
        <button
          onClick={() => onReadMore(post.slug)}
          className="inline-flex items-center gap-2 text-[#5cdfff] font-orbitron text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all group/btn"
        >
          Read Article
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
}

interface BlogListingPageProps {
  onBlogClick: (slug: string) => void;
}

export function BlogListingPage({ onBlogClick }: BlogListingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = ["All", ...getAllCategories()];
  const allTags = getAllTags();

  // Filter blogs
  const filteredBlogs = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);

    return matchesCategory && matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-32">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#7C86FF] to-[#5cdfff] px-4 py-2 mb-6">
            <span className="font-orbitron text-white text-sm font-bold tracking-wider">
              STATOZ BLOG
            </span>
          </div>
          <h1 className="font-orbitron font-extrabold text-4xl lg:text-5xl text-white uppercase mb-4">
            Insights & Strategies
          </h1>
          <p className="font-jakarta text-[#cad5e2] text-lg lg:text-xl max-w-3xl mx-auto">
            Expert guides, tournament previews, and winning strategies to help
            you dominate predictions on Statoz.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b95a5]" />
            <input
              type="text"
              placeholder="Search articles, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] text-white font-orbitron placeholder:text-[#8b95a5] focus:border-[#5cdfff] focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-[#5cdfff] shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 font-orbitron text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-[#5cdfff] text-[#0a0f1e]"
                    : "bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] text-[#cad5e2] hover:border-[#5cdfff]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Popular Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-[#8b95a5] shrink-0" />
            <span className="font-orbitron text-[#8b95a5] text-xs uppercase mr-2">
              Popular Tags:
            </span>
            {allTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 font-orbitron text-xs transition-all ${
                  selectedTag === tag
                    ? "bg-[rgba(92,223,255,0.3)] border border-[#5cdfff] text-[#5cdfff]"
                    : "bg-[rgba(92,223,255,0.1)] border border-[rgba(92,223,255,0.2)] text-[#8b95a5] hover:border-[#5cdfff] hover:text-[#5cdfff]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-orbitron text-[#8b95a5] text-sm">
            Showing{" "}
            <span className="text-[#5cdfff] font-bold">
              {filteredBlogs.length}
            </span>{" "}
            {filteredBlogs.length === 1 ? "article" : "articles"}
            {selectedTag && (
              <span className="text-white">
                {" "}
                tagged with &quot;{selectedTag}&quot;
              </span>
            )}
          </p>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredBlogs.map((post) => (
              <BlogCard key={post.id} post={post} onReadMore={onBlogClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d]">
              <Search className="w-16 h-16 text-[#8b95a5] mx-auto mb-4" />
              <h3 className="font-orbitron font-bold text-xl text-white mb-2">
                No Articles Found
              </h3>
              <p className="font-jakarta text-[#8b95a5]">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-[#7C86FF] to-[#5cdfff] opacity-5"></div>
            <div className="relative z-10">
              <h3 className="font-orbitron font-extrabold text-2xl lg:text-3xl text-white uppercase mb-4">
                Ready to Put Knowledge Into Action?
              </h3>
              <p className="font-jakarta text-[#cad5e2] text-base lg:text-lg max-w-2xl mx-auto mb-6">
                Join Statoz and start making predictions on IPL 2026, T20 World
                Cup, FIFA World Cup, and more.
              </p>
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 bg-linear-to-r from-[#7C86FF] to-[#5cdfff] px-8 py-4 font-orbitron text-white text-base font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(92,223,255,0.6)] transition-all duration-300"
              >
                Join Waitlist
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
