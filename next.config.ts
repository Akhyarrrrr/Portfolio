/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config: import("webpack").Configuration,
    options: import("next/dist/server/config-shared").WebpackConfigContext
  ) => {
    if (config.module && config.module.rules) {
      config.module.rules.push({
        test: /\.(glb|gltf)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[hash][ext]",
        },
      });
    }

    return config;
  },
};

module.exports = nextConfig;
