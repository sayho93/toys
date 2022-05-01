import {jest} from '@jest/globals'
import request from 'supertest'
import Container from '#src/loaders/container'
import {asValue} from 'awilix'

const container = await Container.init()

const {default: InitApp} = await import('#src/loaders/initApp')

const app = InitApp()
jest.setTimeout(13000)

test('/api/v1/user/worker-test/:num', async () => {
    const UserService = Container.get('UserService')
    const PlannerService = Container.get('PlannerService')
    const spy = jest.spyOn(UserService, 'workerTest')

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

    jest.spyOn(PlannerService, 'getPlanners')

    container.register({
        UserService: asValue(UserService),
        PlannerService: asValue(PlannerService),
    })

    const queue = []

    queue.push(async () => await request(app).get('/api/v1/user/worker-test/80000000'))

    for (let i = 0; i < 5; i++) {
        queue.push(async () => await request(app).get('/api/v1/planner/list'))
    }

    await Promise.all(queue.map(fn => fn()))

    console.log(Container.get('UserService').workerTest)
    // expect(Container.get('UserService').workerTest).toHaveBeenCalledTimes(1)
    // expect(Container.get('PlannerService').getPlanners).toHaveBeenCalledTimes(5)
})
