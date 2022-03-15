const withPWA = require('next-pwa')
const withPlugins = require('next-compose-plugins')

const nextConfig = {
    generateEtags: false,
    // webpack:
}

module.exports = withPlugins(
    [
        [
            withPWA,
            {
                pwa: {
                    dest: 'public',
                    // disable: process.env.NODE_ENV === 'development',
                    register: true,
                    sw: 'service-worker.js',
                },
            },
        ],
    ],
    nextConfig
)
