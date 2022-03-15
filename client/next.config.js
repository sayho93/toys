const withPWA = require('next-pwa')
const withPlugins = require('next-compose-plugins')
const runtimeCaching = require('next-pwa/cache')

const nextConfig = {
    generateEtags: false,
    i18n: {
        locales: ['ko'],
        defaultLocale: 'ko',
    },
    // webpack:
}

module.exports = withPlugins(
    [
        [
            withPWA,
            {
                pwa: {
                    dest: 'public',
                    scope: '/',
                    runtimeCaching,
                    disable: process.env.NODE_ENV !== 'production',
                    register: true,
                    sw: 'service-worker.js',
                },
            },
        ],
    ],
    nextConfig
)
