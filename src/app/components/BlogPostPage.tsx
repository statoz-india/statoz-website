import { useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getBlogBySlug, BLOG_POSTS } from "../utils/blogData";

interface BlogPostPageProps {
  slug: string;
  onBack: () => void;
  onBlogClick: (slug: string) => void;
}

export function BlogPostPage({ slug, onBack, onBlogClick }: BlogPostPageProps) {
  const post = getBlogBySlug(slug);

  // Scroll to top when post changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Update document title and meta tags for SEO
  useEffect(() => {
    if (post) {
      document.title = post.seo.metaTitle;

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", post.seo.metaDescription);

      // Update keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", post.seo.keywords.join(", "));

      // Cleanup: restore default title when component unmounts
      return () => {
        document.title = "Statoz - Skill-Based Sports Prediction Gaming";
      };
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-32">
          <div className="text-center py-16">
            <h1 className="font-orbitron font-bold text-3xl text-white mb-4">
              Article Not Found
            </h1>
            <p className="font-jakarta text-[#cad5e2] mb-6">
              The article you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-linear-to-r from-[#7C86FF] to-[#5cdfff] px-6 py-3 font-orbitron text-white text-sm font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(92,223,255,0.6)] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.category === post.category && p.id !== post.id
  ).slice(0, 3);

  // Format content with proper styling
  const formatContent = (content: string) => {
    return content
      .trim()
      .split("\n")
      .map((line, index) => {
        // Headings
        if (line.startsWith("# ")) {
          return (
            <h1
              key={index}
              className="font-orbitron font-extrabold text-3xl lg:text-4xl text-white mb-6 mt-8"
            >
              {line.substring(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="font-orbitron font-bold text-2xl lg:text-3xl text-white mb-4 mt-8"
            >
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="font-orbitron font-bold text-xl lg:text-2xl text-[#5cdfff] mb-3 mt-6"
            >
              {line.substring(4)}
            </h3>
          );
        }
        if (line.startsWith("#### ")) {
          return (
            <h4
              key={index}
              className="font-orbitron font-bold text-lg text-white mb-2 mt-4"
            >
              {line.substring(5)}
            </h4>
          );
        }

        // Bold text
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p
              key={index}
              className="font-jakarta font-bold text-white text-lg mb-3"
            >
              {line.substring(2, line.length - 2)}
            </p>
          );
        }

        // Lists
        if (line.startsWith("- ")) {
          return (
            <li
              key={index}
              className="font-jakarta text-[#cad5e2] leading-relaxed ml-6 mb-2"
            >
              {line.substring(2)}
            </li>
          );
        }

        // Empty lines
        if (line.trim() === "") {
          return <div key={index} className="h-4"></div>;
        }

        // Regular paragraphs
        return (
          <p
            key={index}
            className="font-jakarta text-[#cad5e2] text-base leading-relaxed mb-4"
          >
            {line}
          </p>
        );
      });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = post.title;

  return (
    <div className="min-h-screen bg-[#0a0f1e] pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-32">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#5cdfff] font-orbitron text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to All Articles
        </button>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-[#5cdfff] px-4 py-2 font-orbitron text-[#0a0f1e] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-orbitron font-extrabold text-3xl lg:text-5xl text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-[#8b95a5] text-sm border-b border-[#1d293d] pb-6">
            <div className="flex items-center gap-2">
              <span className="font-orbitron">By {post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-orbitron">
                {new Date(post.publishDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-orbitron">{post.readTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-[rgba(92,223,255,0.1)] border border-[rgba(92,223,255,0.3)] px-3 py-1 text-[#5cdfff] font-orbitron text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Featured Image */}
          <div className="relative h-96 mb-12 overflow-hidden border-2 border-[#1d293d]">
            <ImageWithFallback
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            {formatContent(post.content)}
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-[#1d293d]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="font-orbitron text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share This Article
              </span>
              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    shareText
                  )}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[rgba(92,223,255,0.1)] border border-[rgba(92,223,255,0.3)] text-[#5cdfff] hover:bg-[rgba(92,223,255,0.2)] hover:border-[#5cdfff] transition-all"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[rgba(92,223,255,0.1)] border border-[rgba(92,223,255,0.3)] text-[#5cdfff] hover:bg-[rgba(92,223,255,0.2)] hover:border-[#5cdfff] transition-all"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[rgba(92,223,255,0.1)] border border-[rgba(92,223,255,0.3)] text-[#5cdfff] hover:bg-[rgba(92,223,255,0.2)] hover:border-[#5cdfff] transition-all"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 max-w-6xl mx-auto">
            <h2 className="font-orbitron font-extrabold text-2xl lg:text-3xl text-white uppercase mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="group bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] hover:border-[#5cdfff] transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => onBlogClick(relatedPost.slug)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={relatedPost.imageUrl}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-orbitron font-bold text-base text-white mb-2 group-hover:text-[#5cdfff] transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="font-jakarta text-[#8b95a5] text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-[rgba(15,23,43,0.8)] border-2 border-[#1d293d] p-8 lg:p-12 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-linear-to-r from-[#7C86FF] to-[#5cdfff] opacity-5"></div>
            <div className="relative z-10">
              <h3 className="font-orbitron font-extrabold text-2xl lg:text-3xl text-white uppercase mb-4">
                Ready to Start Predicting?
              </h3>
              <p className="font-jakarta text-[#cad5e2] text-base lg:text-lg max-w-2xl mx-auto mb-6">
                Apply these strategies on Statoz. Join our community of sports
                prediction experts today.
              </p>
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 bg-linear-to-r from-[#7C86FF] to-[#5cdfff] px-8 py-4 font-orbitron text-white text-base font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(92,223,255,0.6)] transition-all duration-300"
              >
                Join Waitlist Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
