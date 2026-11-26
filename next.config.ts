import type { NextConfig } from 'next';
const pages = process.env.GITHUB_PAGES === 'true';
const nextConfig: NextConfig = {
  transpilePackages: ['@statoz/design-system'],
  devIndicators: false,
  ...(pages ? {
    output: 'export',
    trailingSlash: true,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/statoz-next-website',
    images: { unoptimized: true },
  } : {}),
};
export default nextConfig;
