// noinspection DuplicatedCode
import Container from '#src/loaders/container'

await Container.init()
// import {mockRequest, mockResponse} from '#tests/utils/interceptor'

describe('batching test', () => {
    test('test', async () => {
        console.log(Container)

        console.log('test')
    })

    // test('', async () => {
    //     const lotteryController = Container.get('LotteryController')
    //     const req = mockRequest({}, {}, {userId: 45})
    //     const res = mockResponse()
    //
    //     const jobs = []
    //
    //     for (let i = 0; i < 10; i++) {
    //         jobs.push(lotteryController.getLotteries(req, res))
    //     }
    //
    //     await Promise.allSettled(jobs)
    //     // expect(res.json).toHaveBeenCalledTimes(1)
    //     // expect(res.json.mock.calls.length).toBe(1)
    //     // expect(res.json).toHaveBeenCalledWith({message: 'Not Found'})
    // })
})
