/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eamon-test-bucket-1.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**", // allow all paths
      },
    ],
  },
};

module.exports = nextConfig;
