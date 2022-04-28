import {jest} from '@jest/globals'
import request from 'supertest'
import InitApp from '#src/loaders/initApp'
import {Controllers, Services} from '#src/loaders/dependencies'

const app = InitApp({Controllers})
jest.setTimeout(13000)
test('/api/v1/user/worker-test/:num', async () => {
    const queue = []
    const spy = jest.spyOn(Services.userService, 'workerTest')

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

    jest.spyOn(Services.plannerService, 'getPlanners')

    queue.push(async () => await request(app).get('/api/v1/user/worker-test/80000000'))

    for (let i = 0; i < 5; i++) {
        queue.push(async () => await request(app).get('/api/v1/planner/list'))
    }

    await Promise.all(queue.map(fn => fn()))

    expect(Services.userService.workerTest).toHaveBeenCalledTimes(1)
    expect(Services.plannerService.getPlanners).toHaveBeenCalledTimes(5)
})
