import {Datasources} from '#types/datasources'

import Redis from 'ioredis'
import Log from '#utils/logger'
import ErrorHandler from '#utils/errorHandler.util'
import RedisConf = Configs.RedisConf
import RedisDataSource = Datasources.RedisDataSource

export const makeRedisDatasource = (config: RedisConf): RedisDataSource => {
    const redis: Redis = new Redis(config)
    process.env.NODE_ENV === 'development' ? redis.select(15) : redis.select(0)

    redis.on('connect', () => {
        Log.verbose('Connected to Redis')
    })

    redis.on('set', (key: string, value: any, ttl: number) => {
        Log.debug(`Redis set key: ${key}, ttl: ${ttl}`)
        redis.setex(key, ttl, JSON.stringify(value))
    })

    redis.on('del', (key: string) => {
        Log.debug(`Redis del key: ${key}`)
        redis.del(key)
    })

    redis.on('delWithPrefix', async (prefix: string) => {
        Log.debug(`Redis delWithPrefix prefix: ${prefix}`)
        try {
            const keys = await redis.keys(`/api/v1/${prefix}*`)
            console.log(keys)
            keys.forEach(key => redis.del(key))
        } catch (error: any) {
            await ErrorHandler.dispatchErrorLog(error)
            Log.error(error)
        }
    })

    return {instance: redis}
}
