/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "randomuser.me" },
    ],
  },
};

module.exports = nextConfig;
