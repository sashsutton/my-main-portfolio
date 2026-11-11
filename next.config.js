/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three, drei and postprocessing all ship modern ESM that Next 16 handles
  // directly — no transpilePackages needed.
};

module.exports = nextConfig;
