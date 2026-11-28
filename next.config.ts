import type { NextConfig } from 'next';

const reportOnlyCsp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    const headers = [{ key: 'X-Content-Type-Options', value: 'nosniff' }];

    if (process.env.NODE_ENV === 'production') {
      headers.push({ key: 'Content-Security-Policy-Report-Only', value: reportOnlyCsp });
    }

    return [{ source: '/:path*', headers }];
  },
};

export default nextConfig;
