/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.NEXT_PUBLIC_SERVER_URL
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/do3tlu1ph/**'
            },
            {
                protocol: 'http',
                hostname: 'gft.up.railway.app',
                port: '',
            }
        ]
    },
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig
