/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Firebase Hosting — outputs a static site to the `out/` directory
  output: "export",

  // Disable the default image optimization API (not supported in static export)
  // Use the `unoptimized` flag or a third-party loader instead
  images: {
    unoptimized: true,
  },

  // Optional: set a base path if deployed to a sub-path (leave empty for root)
  // basePath: '',

  // Trailing slash ensures each route maps to an index.html file
  trailingSlash: true,
};

export default nextConfig;
