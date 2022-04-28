import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const Config = {
    app: {
        ENV: process.env.NODE_ENV || 'development',
        SERVICE_NAME: process.env.SERVICE_NAME || '',
        PORT: process.env.PORT,
        HTTPS_PORT: process.env.HTTPS_PORT,
        UPLOAD_PATH: path.resolve('uploads'),
        EXTERNAL_PATH: '/uploads',
        GOOGLE_SERVER_KEY: process.env.GOOGLE_SERVER_KEY,
        APNS_SERVER_KEY: process.env.APNS_SERVER_KEY,
        // FCM_CONFIG: path.resolve(process.env.FCM_CONFIG),
        AUTH_URI: process.env.NODE_ENV === 'production' ? 'https://psyho.pw:3000/api/v1/user/auth' : 'http://localhost:4000/api/v1/user/auth',
        externalApi: {
            LOTTERY_CHECK: 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=',
        },
        JOB_PATH: path.resolve('src/jobs'),
    },
    datasource: {
        mariaDB: {
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            port: process.env.DB_PORT,
        },
        mongoDB: {
            host: process.env.MONGO_HOST,
            user: process.env.MONGO_USERNAME,
            password: process.env.MONGO_PASSWORD,
        },
    },
    mail: {
        CONFIG: {
            service: 'gmail',
            host: 'smtp.google.com',
            port: 587,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.OAUTH_USER,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: process.env.OAUTH_ACCESS_TOKEN,
                expires: 1484314697598,
            },
        },
        NAME: 'Toy Project 안내 메일',
    },
    firebaseConfig: {
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    },
    cert: {
        development: {
            PRIVATE_KEY_PATH: path.resolve('src/config/server.key'),
            CERT_PATH: path.resolve('src/config/server.crt'),
        },
        production: {
            PRIVATE_KEY_PATH: process.env.CERT_PRIVATE_KEY,
            CERT_PATH: process.env.CERT_PATH,
            CHAIN_PATH: process.env.CERT_CHAIN_PATH,
        },
    },
}

export default Config
