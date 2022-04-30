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

    redis.on('delWithPrefix', prefix => {
        Log.debug(`Redis delWithPrefix prefix: ${prefix}`)
        redis.keys(`${prefix}*`, (err, keys) => {
            if (err) {
                Log.error(err)
            } else {
                keys.forEach(key => {
                    redis.del(key)
                })
            }
        })
    })

    return redis
}

export default RedisDataSource
