import type { NextConfig } from "next";

// Static export for GitHub Pages. The lane's deploy.yml sets NEXT_PUBLIC_BASE_PATH to the repo subpath;
// a custom domain later means an empty base path and a public/CNAME. Nothing here ever runs on a server.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
