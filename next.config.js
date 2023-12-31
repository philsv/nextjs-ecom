/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', "files.stripe.com"]
  },
};

module.exports = nextConfig;
