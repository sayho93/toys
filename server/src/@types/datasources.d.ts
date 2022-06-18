import {Pool} from 'mysql2/promise'
import {Mongoose} from 'mongoose'
import Redis from 'ioredis'

namespace Datasources {
    export interface MariaDBDataSource {
        pool: Pool
        exec: (sql: string, params: any) => Promise<any>
    }

    export interface MongoDBDataSource {
        instance: Mongoose
    }

    export interface RedisDataSource {
        instance: Redis
    }
}
