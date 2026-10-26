import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'Jeopardy-Game-Bob';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || (isProd ? `/${repoName}` : ''),
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || (isProd ? `/${repoName}/` : undefined),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
