import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const Config = {
    app: {
        ENV: process.env.NODE_ENV || 'development',
        SERVICE_NAME: 'Toys',
        PORT: 4000,
        HTTPS_PORT: 3443,
        UPLOAD_PATH: path.resolve('uploads'),
        EXTERNAL_PATH: '/uploads',
        GOOGLE_SERVER_KEY: process.env.GOOGLE_SERVER_KEY,
        APNS_SERVER_KEY: process.env.APNS_SERVER_KEY,
        FCM_SERVER: 'https://midnight-pickle.firebaseio.com',
        FCM_CONFIG: path.resolve('dist/config/FirebaseConfig.json'),
        AES_KEY: process.env.AES_KEY,
        SESSION_KEY: process.env.SESSION_KEY,
        MAIL: {
            CONFIG: {
                service: 'gmail',
                host: 'smtp.google.com',
                port: 587,
                secure: true,
                auth: {
                    type: 'OAuth2',
                    user: null,
                    clientId: null,
                    clientSecret: null,
                    refreshToken: null,
                    accessToken: null,
                    expires: 3600,
                },
            },
            NAME: 'Toy Project 안내 메일',
        },
        AUTH_URI: process.env.NODE_ENV === 'production' ? 'https://psyho.pw:3000/api/auth' : 'http://localhost:4000/api/auth',
    },
    cert: {
        development: {
            PRIVATE_KEY_PATH: path.resolve('src/config/server.key'),
            CERT_PATH: path.resolve('src/config/server.crt'),
        },
        test: {
            PRIVATE_KEY_PATH: '/etc/letsencrypt/live/psyho.pw/privkey.pem',
            CERT_PATH: '/etc/letsencrypt/live/psyho.pw/cert.pem',
            CHAIN_PATH: '/etc/letsencrypt/live/psyho.pw/chain.pem',
        },
        production: {
            PRIVATE_KEY_PATH: '/etc/letsencrypt/live/psyho.pw/privkey.pem',
            CERT_PATH: '/etc/letsencrypt/live/psyho.pw/cert.pem',
            CHAIN_PATH: '/etc/letsencrypt/live/psyho.pw/chain.pem',
        },
    },
}

export default Config
