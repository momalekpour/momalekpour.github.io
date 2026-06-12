/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a fully static site in `out/` (no Node server needed — perfect for GitHub Pages).
  output: "export",
  // GitHub Pages can't run Next's image optimizer, so serve images as-is.
  images: { unoptimized: true },
};

export default nextConfig;
