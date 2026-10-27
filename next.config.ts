import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/taylordwraps-nextjs-preview",
  images: { unoptimized: true },
};

export default nextConfig;
