import {validationErrorHandler} from '#utils/common.util'
import {redisClient} from '#src/loaders/dependencies'

const LotteryController = (LotteryService, requestBatch) => {
    const saveLottery = async (req, res) => {
        validationErrorHandler(req)
        const userId = req.params.userId
        const params = req.body
        const ret = await LotteryService.saveLottery(userId, params)
        redisClient.emit('delWithPrefix', 'lottery')
        res.json(ret)
    }

    const getLotteries = async (req, res) => {
        const userId = req.query.userId
        const searchTxt = req.query.searchTxt ?? ''
        const page = req.query.page ?? 1
        const limit = req.query.limit ?? 27
        const ret = await requestBatch.check(`lottery_list_${userId}_${searchTxt}_${page}_${limit}`, () => LotteryService.getLotteryList(userId, searchTxt, page, limit))
        redisClient.emit('set', req.originalUrl, ret, 60 * 60)
        res.json(ret)
    }

    const fame = async (req, res) => {
        const searchTxt = req.query.searchTxt
        const page = req.query.page
        const limit = req.query.limit
        const ret = await requestBatch.check(`lottery_fame_${searchTxt}_${page}_${limit}`, () => LotteryService.getFameList(searchTxt, page, limit))
        redisClient.emit('set', req.originalUrl, ret, 60 * 60)
        res.json(ret)
    }

    const batchTest = async (req, res) => {
        await LotteryService.batchProcess()
        res.json('done')
    }

    return {
        saveLottery,
        getLotteries,
        fame,
        batchTest,
    }
}

export default LotteryController
