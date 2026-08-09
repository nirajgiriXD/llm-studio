/** @type {import('next').NextConfig} */
const nextConfig = {
  // `node-llama-cpp` ships native bindings, so it must stay outside the server
  // bundle and be required at runtime instead.
  serverExternalPackages: ["node-llama-cpp"],
};

export default nextConfig;
