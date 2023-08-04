/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['cdn.intra.42.fr', 'res.cloudinary.com']
  },
  experimental: {
    serverActions: true,
  },
  reactStrictMode: false,

}

module.exports = nextConfig