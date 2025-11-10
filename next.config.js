/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['http2.mlstatic.com', 'mercadolivre.com.br'],
    unoptimized: false,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }]
    return config
  },
}

module.exports = nextConfig

