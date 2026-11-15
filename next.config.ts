import type { NextConfig } from 'next';
const nextConfig: NextConfig = { turbopack: process.env.TURBO_WORKSPACE_ROOT ? { root: process.env.TURBO_WORKSPACE_ROOT } : undefined, transpilePackages: ['@statoz/design-system'], devIndicators: false, output: 'export', basePath: '/statoz-website', trailingSlash: true, images: { unoptimized: true } };
export default nextConfig;
