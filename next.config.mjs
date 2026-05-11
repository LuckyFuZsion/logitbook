import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const twAnimateCss = path.join(__dirname, 'node_modules/tw-animate-css/dist/tw-animate.css')

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Parent folder (VB V0) has its own package-lock.json; anchor Turbopack to this app.
    root: __dirname,
    // CSS @import resolves from parent context in dev; pin package to this app's node_modules.
    resolveAlias: {
      'tw-animate-css': twAnimateCss,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'tw-animate-css': twAnimateCss,
    }
    return config
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
