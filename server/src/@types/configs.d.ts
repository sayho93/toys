namespace Configs {
    type DatasourceConfBase = {
        host: string | undefined
        user?: string | undefined
        password: string | undefined
    }

    export type MariaDBConf = DatasourceConfBase & {
        database: string | undefined
        waitForConnections?: boolean
        connectionLimit?: number
        queueLimit?: number
        port?: number | undefined
    }

    export type MongoDBConf = DatasourceConfBase & {
        authMechanism?: string
        authSource?: string
    }

    export type RedisConf = DatasourceConfBase & {
        port?: number | undefined
    }

    export type CertConfig = {
        PRIVATE_KEY_PATH: string
        CERT_PATH: string
        CHAIN_PATH?: string
    }
}
