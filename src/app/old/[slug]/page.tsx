import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "../components/BlogPostPage";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { BLOG_POSTS, getBlogBySlug } from "../utils/blogData";

interface BlogDetailRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = `/allblogs/${post.slug}`;

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      type: "article",
      url: canonical,
      publishedTime: post.publishDate,
      authors: [post.author],
      images: [
        {
          url: post.imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogDetailRoute({
  params,
}: BlogDetailRouteProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0D111A] flex flex-col">
      <Header blogHref="/allblogs" homeHref="/" />
      <BlogPostPage slug={slug} />
      <Footer />
    </div>
  );
}
