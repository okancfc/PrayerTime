// next.config.ts

import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export', // Statik dışa aktarmayı etkinleştirir
  reactStrictMode: true, // Opsiyonel, hataların daha erken tespit edilmesi için
}

export default nextConfig
