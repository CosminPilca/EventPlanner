import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // ignore lint
    },
    typescript: {
        ignoreBuildErrors: true, // ignore TS errors
    },
}

export default nextConfig