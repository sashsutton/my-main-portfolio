const os = require("os");

/**
 * This machine's LAN IPv4 addresses (e.g. 192.168.1.12), so `npm run dev` can
 * be opened from a phone or another device on the same network. Next 16 blocks
 * dev resources (HMR, dev chunks) from any origin not listed here, which leaves
 * the page un-hydrated — the loader sits at "Initialising 000%" forever.
 * Development only; has no effect on production builds.
 */
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((net) => net && net.family === "IPv4" && !net.internal)
  .map((net) => net.address);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: lanAddresses,
  // three, drei and postprocessing all ship modern ESM that Next 16 handles
  // directly — no transpilePackages needed.
};

module.exports = nextConfig;
