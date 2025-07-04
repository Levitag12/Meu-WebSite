/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "0.0.0.0:3000"],
    },
    allowedDevOrigins: ["*.replit.dev"], // Permite origens do Replit
  },
};

module.exports = nextConfig;