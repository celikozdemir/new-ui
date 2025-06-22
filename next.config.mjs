/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "carv.ist",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
