/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pure App Router — no pages/ directory.
  // instrumentation.ts patches browser-only globals for the Node.js server.
};

export default nextConfig;
