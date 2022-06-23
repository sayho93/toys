import {Request, Response} from 'express'
import {Datasources} from '#types/datasources'
import {Controllers} from '#types/controllers'
import {Utils} from '#types/utils'
import LotteryController = Controllers.LotteryController
import ErrorHandlerUtil = Utils.ErrorHandler
import RequestBatcher = Utils.RequestBatcher
import LotteryService = Services.LotteryService
import RedisDataSource = Datasources.RedisDataSource

export const makeLotteryController = (
    service: LotteryService,
    RedisClient: RedisDataSource,
    ErrorHandler: ErrorHandlerUtil,
    RequestBatcher: RequestBatcher
): LotteryController => {
    const saveLottery = async (req: Request, res: Response) => {
        ErrorHandler.validationErrorHandler(req)
        const userId = +req.params.userId
        const params = req.body
        const ret = await service.saveLottery(userId, params)
        RedisClient.instance.emit('delWithPrefix', 'lottery')
        res.json(ret)
    }

    const getLotteries = async (req: Request, res: Response) => {
        let userId = req.query.userId ? +req.query.userId : undefined
        const searchTxt = (req.query.searchTxt as string) ?? ''
        const page = parseInt(req.query.page as string) ?? 1
        const limit = parseInt(req.query.limit as string) ?? 27

        const ret = await RequestBatcher.check(`lottery_list_${userId}_${searchTxt}_${page}_${limit}`, async () => {
            const res = await service.getLotteryList(userId, searchTxt, page, limit)
            RedisClient.instance.emit('set', req.originalUrl, res, 60 * 60)
            return res
        })

        res.json(ret)
    }

    const fame = async (req: Request, res: Response) => {
        const searchTxt = req.query.searchTxt as string
        const page = req.query.page as string
        const limit = req.query.limit as string
        const ret = await RequestBatcher.check(`lottery_fame_${searchTxt}_${page}_${limit}`, async () => {
            const res = await service.getFameList(searchTxt, +page, +limit)
            RedisClient.instance.emit('set', req.originalUrl, res, 60 * 60)
            return res
        })

        res.json(ret)
    }

    const batchTest = async (req: Request, res: Response) => {
        await service.batchProcess()
        res.json('done')
    }

    return {
        saveLottery,
        getLotteries,
        fame,
        batchTest,
    }
}
