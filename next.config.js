/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.NEXT_PUBLIC_SERVER_URL
    },
    images: {
        unoptimized: true,
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
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1:8000',
                port: '',
            }
        ]
    },
}

module.exports = nextConfig
