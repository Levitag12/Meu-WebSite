/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "0.0.0.0:3000"]
    }
  },
  allowedDevOrigins: [
    "http://localhost:3001",
    "https://01c6def6-6da5-4ea1-9950-dc3169c4eeb5-00-30iqj27xr6025.janeway.replit.dev/login?callbackUrl=%2Fdashboard"
  ]
}

module.exports = nextConfig
