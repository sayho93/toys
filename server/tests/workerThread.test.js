import {jest} from '@jest/globals'
import request from 'supertest'
import Container from '#src/loaders/container'
import {asValue} from 'awilix'

test('/api/v1/user/worker-test/:num', async () => {
    const container = await Container.init()

    const UserService = Container.get('UserService')
    const spy = jest.spyOn(UserService, 'workerTest')
    // job on main thread
    // spy.mockImplementation(num => {
    //     let sum = BigInt(0)
    //     console.time('calc')
    //     for (let i = 0; i < num; i++) {
    //         sum += BigInt(i)
    //     }
    //     const avg = sum / BigInt(num - 1)
    //     console.timeEnd('calc')
    //     return avg
    // })

    const RedisClient = {
        get: jest.fn(),
        emit: jest.fn(),
    }

    const PlannerService = Container.get('PlannerService')
    jest.spyOn(PlannerService, 'getPlanners')

    container.register({
        UserService: asValue(UserService),
        PlannerService: asValue(PlannerService),
        RedisClient: asValue(RedisClient),
    })

    const {default: InitApp} = await import('#src/loaders/initApp')
    const app = InitApp()

    const queue = []
    queue.push(async () => await request(app).get('/api/v1/user/worker-test/20000000'))
    for (let i = 0; i < 5; i++) queue.push(async () => await request(app).get('/api/v1/planner/list'))

    await Promise.all(queue.map(fn => fn()))

    expect(UserService.workerTest).toHaveBeenCalledTimes(1)
    expect(PlannerService.getPlanners).toHaveBeenCalledTimes(1)
})
