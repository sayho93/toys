import Redis from 'ioredis'
import Log from '#utils/logger'

const RedisDataSource = config => {
    const redis = new Redis(config)
    process.env.NODE_ENV === 'development' ? redis.select(15) : redis.select(0)

    redis.on('connect', () => {
        Log.debug('Redis connected')
    })

    redis.on('set', (key, value, ttl) => {
        Log.debug(`Redis set key: ${key}, ttl: ${ttl}`)
        redis.setex(key, ttl, JSON.stringify(value))
    })

    redis.on('del', key => {
        Log.debug(`Redis del key: ${key}`)
        redis.del(key)
    })

    redis.on('delWithPrefix', async prefix => {
        Log.debug(`Redis delWithPrefix prefix: ${prefix}`)
        try {
            const keys = await redis.keys(`/api/v1/${prefix}*`)
            console.log(keys)
            keys.forEach(key => redis.del(key))
        } catch (error) {
            Log.error(error)
        }
    })

    return redis
}

export default RedisDataSource
