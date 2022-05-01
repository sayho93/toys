// noinspection DuplicatedCode
import Container from '#src/loaders/container'
import {mockRequest, mockResponse} from '#tests/utils/interceptor'
import {jest} from '@jest/globals'
import LotteryController from '#controllers/lottery.controller'

const container = await Container.init()

describe('batching test', () => {
    const LotteryService = Container.get('LotteryService')
    const RequestBatch = Container.get('RequestBatch')
    let RedisClient = {
        emit: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(LotteryService, 'getLotteryList')
    })
    test('', async () => {
        const lotteryController = LotteryController({LotteryService, RequestBatch, RedisClient})

        const req = mockRequest({}, {}, {userId: 45})
        const res = mockResponse()

        const jobs = []

        for (let i = 0; i < 10; i++) {
            jobs.push(lotteryController.getLotteries(req, res))
        }

        await Promise.allSettled(jobs)
        expect(RedisClient.emit).toHaveBeenCalledTimes(1)
        expect(LotteryService.getLotteryList).toHaveBeenCalledTimes(1)
    })
})
