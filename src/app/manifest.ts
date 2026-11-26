import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";
import { publicAsset } from '@statoz/design-system/asset';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Your daily home for sport`,
    short_name: SITE_NAME,
    description:
      "Explore StatOz Sports, discover StatOz Games and find your home ground.",
    start_url: publicAsset('/'),
    scope: publicAsset('/'),
    display: "standalone",
    background_color: "#06080f",
    theme_color: "#06080f",
    icons: [
      {
        src: publicAsset('/icon-192.png'),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: publicAsset('/icon-512.png'),
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
