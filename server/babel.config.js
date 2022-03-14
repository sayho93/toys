module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": ["last 2 versions", "ie >= 11"]
                },
                "useBuiltIns": "usage",
                "corejs": 3,
                "shippedProposals": true
            }
        ]
    ],
    plugins: [
        "@babel/plugin-transform-runtime",
        [
            'module-resolver',
            {
                root: ['../server'],
                alias: {
                    src: './src',
                },
            },
        ]
    ]
}
