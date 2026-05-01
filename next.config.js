const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.js',
    },
  },
  serverExternalPackages: ['@prisma/client'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip', '@radix-ui/react-separator', '@radix-ui/react-progress'],
    workerThreads: false,
    cpus: 1,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ugc.same-assets.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [400, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: 'default',
    loaderFile: undefined,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  trailingSlash: false,
  distDir: '.next',
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  // تحسينات أداء متقدمة
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  allowedDevOrigins: process.env.NEXT_PUBLIC_ALLOWED_DEV_ORIGINS 
    ? process.env.NEXT_PUBLIC_ALLOWED_DEV_ORIGINS.split(',')
    : [
        'deyarsu.com',
        'www.deyarsu.com',
        '*.vercel.app',
        '*.replit.dev',
        '*.spock.replit.dev',
        '*.pike.replit.dev',
        '*.projects.builder.codes',
        '*.builder.codes',
        '*.fly.dev',
        'localhost',
        '127.0.0.1'
      ],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors https: http: 'self';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // تقليل TTFB
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // ✅ تخزين الصور في الذاكرة المؤقتة لفترة طويلة
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'image/webp',
          },
        ],
      },
      // ✅ تخزين الملفات المرفوعة
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ✅ تخزين الملفات الثابتة من Next.js
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ✅ تخزين صور Next.js المحسنة
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ✅ تخزين الـ API responses
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=120',
          },
        ],
      },
      // ✅ تخزين صفحات المشاريع (يعاد بناؤها تلقائياً)
      {
        source: '/portfolio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, stale-while-revalidate=86400',
          },
        ],
      },
      // ✅ تخزين الملفات الثابتة الأخرى
      {
        source: '/favicon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Canonical domain redirect - enforce www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'deyarsu.com',
          },
        ],
        destination: 'https://www.deyarsu.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));
