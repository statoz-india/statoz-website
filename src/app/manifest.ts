import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} -sports prediction game`,
    short_name: SITE_NAME,
    description:
      "Free sports prediction game. Predict fixtures, win Oz Coins and climb the global leaderboard.",
    start_url: "/",
    display: "standalone",
    background_color: "#06080f",
    theme_color: "#06080f",
    icons: [
      {
        src: "/assets/brand/app-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
