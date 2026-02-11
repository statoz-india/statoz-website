import { notFound } from "next/navigation";
import { BlogPostPage } from "../../components/BlogPostPage";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { getBlogBySlug } from "../../utils/blogData";

interface BlogDetailRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailRoute({ params }: BlogDetailRouteProps) {
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
