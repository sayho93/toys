module.exports = {
    apps: [
        {
            name: "test",
            cwd: "/Users/sayho/WebstormProjects/toys/server/dist",
            script: "./src/app.js",
            instances: 0,
            exec_mode: "cluster",
            instance_var: 'INSTANCE_ID',
            env: {
                NODE_ENV: 'development'
            },
            wait_ready: true,
            listen_timeout: 50000,
            kill_timeout: 5000,
        },
    ],
}
