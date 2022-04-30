import {redisClient} from '#src/loaders/dependencies'

describe('', () => {
    test('', async () => {
        const prefix = 'lottery'
        const keys = await redisClient.keys(`/api/v1/${prefix}*`)
        console.log(keys)
        keys.forEach(key => redisClient.del(key))
    })
})
