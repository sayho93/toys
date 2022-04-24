import {validationErrorHandler} from '#utils/common.util'

const LotteryController = LotteryService => {
    const saveLottery = async (req, res) => {
        validationErrorHandler(req)
        const userId = req.params.userId
        const params = req.body
        const ret = await LotteryService.saveLottery(userId, params)
        res.json(ret)
    }

    const getLotteries = async (req, res) => {
        const userId = req.query.userId
        const searchTxt = req.query.searchTxt
        const page = req.query.page
        const limit = req.query.limit
        const ret = await LotteryService.getLotteryList(userId, searchTxt, page, limit)
        res.json(ret)
    }

    const fame = async (req, res) => {
        const searchTxt = req.query.searchTxt
        const page = req.query.page
        const limit = req.query.limit
        const ret = await LotteryService.getFameList(searchTxt, page, limit)
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
