import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports Prediction Guides, Tips & F2P Strategy Blog",
  description:
    "Read Statoz blog posts on free-to-play sports prediction strategy, play-to-win game tips, cricket and football analysis, and platform feature updates.",
  alternates: {
    canonical: "/allblogs",
  },
};

export default function BlogsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
