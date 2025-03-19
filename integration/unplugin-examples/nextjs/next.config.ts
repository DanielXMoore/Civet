import type { NextConfig } from "next";
import civetWebpackPlugin from '@danielx/civet/webpack';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'civet'],
  webpack(config) {
    config.plugins.push(civetWebpackPlugin({ts: 'preserve'}));
    return config;
  },
};

export default nextConfig;
