const withPWA = require('next-pwa')
const withPlugins = require('next-compose-plugins')
const runtimeCaching = require('next-pwa/cache')

const nextConfig = {
    generateEtags: false,
    i18n: {
        locales: ['ko'],
        defaultLocale: 'ko',
    },
    images: {
        domains: ['psyho.pw:3000', 'dummyimage.com'],
    },
    // webpack:
}

module.exports = withPlugins(
    [
        [
            withPWA,
            {
                pwa: {
                    disable: process.env.NODE_ENV !== 'production',
                    dest: 'public',
                    scope: '/',
                    runtimeCaching,
                    register: true,
                    sw: 'service-worker.js',
                },
            },
        ],
    ],
    nextConfig
)
