// noinspection DuplicatedCode
import {mockRequest, mockResponse} from '#tests/utils/interceptor'
import {requestBatch, Services} from '#src/loaders/dependencies'
import LotteryController from '#controllers/lottery.controller'

describe('batching test', () => {
    const lotteryController = LotteryController(Services.lotteryService, requestBatch)
    test('', async () => {
        const req = mockRequest({}, {}, {userId: 45})
        const res = mockResponse()

        const jobs = []

        for (let i = 0; i < 10; i++) {
            jobs.push(lotteryController.getLotteries(req, res))
        }

        await Promise.allSettled(jobs)
        // expect(res.json).toHaveBeenCalledTimes(1)
        // expect(res.json.mock.calls.length).toBe(1)
        // expect(res.json).toHaveBeenCalledWith({message: 'Not Found'})
    })
})
