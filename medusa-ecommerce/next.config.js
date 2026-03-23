/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: false,
  },
  typescript: {
    strictNullChecks: true,
  },
  // Otimizações para produção
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  // Configurar ISR e revalidação
  experimental: {
    isrMemoryCacheSize: 52 * 1024 * 1024, // 52MB
  },
};

module.exports = nextConfig;
