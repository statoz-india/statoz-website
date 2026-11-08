import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BLOG_POSTS, getPost } from "@/lib/blog";

/* A branded 1200×630 share card per post: shown in WhatsApp, LinkedIn and X
   previews and referenced by the post's BlogPosting schema. */

export const alt = "StatOz blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function PostImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  const icon = await readFile(join(process.cwd(), "public/assets/brand/app-icon.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;
  const accent = post?.visual.variant === "quiz" ? "#ff2e7e" : "#5cdfff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: `radial-gradient(circle at 85% 10%, ${accent}33 0%, #06080f 55%)`,
          color: "#f4f7ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={iconSrc} width={72} height={72} alt="" style={{ borderRadius: 16 }} />
          <div style={{ fontSize: 34, fontWeight: 800 }}>StatOz Blog</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 26,
              color: accent,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {post?.eyebrow ?? "StatOz"}
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, maxWidth: 980 }}>
            {post?.title ?? "StatOz Blog"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 28, color: "#a9b3c9" }}>
            The free sports prediction game · statoz.in
          </div>
          {post && (
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#06080f",
                background: accent,
                padding: "10px 22px",
                borderRadius: 10,
              }}
            >
              {post.visual.badge}
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
