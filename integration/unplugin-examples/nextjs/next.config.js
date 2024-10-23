const civetWebpackPlugin = require('@danielx/civet/webpack').default;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'civet'],
  webpack(config) {
    config.plugins.push(civetWebpackPlugin({ts: 'preserve'}));
    return config;
  },
};

module.exports = nextConfig;
