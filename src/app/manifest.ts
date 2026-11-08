import type { MetadataRoute } from "next";
import { APP_ICON_PATH, BRAND_IMAGE_SIZE, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const size = `${BRAND_IMAGE_SIZE}x${BRAND_IMAGE_SIZE}`;
  return {
    name: `${SITE_NAME} – free sports prediction game`,
    short_name: SITE_NAME,
    description:
      "Free sports prediction game. Predict fixtures, win Oz Coins and climb the global leaderboard.",
    lang: "en-IN",
    start_url: "/",
    display: "standalone",
    background_color: "#06080f",
    theme_color: "#06080f",
    categories: ["games", "sports", "entertainment"],
    icons: [{ src: APP_ICON_PATH, sizes: size, type: "image/png", purpose: "any" }],
  };
}
