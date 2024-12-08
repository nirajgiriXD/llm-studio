/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: [
        "node-llama-cpp",
      ],
    },
  };

export default nextConfig;
