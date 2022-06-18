import {Request, Response} from 'express'
import {Datasources} from '#types/datasources'
import {Controllers} from '#types/controllers'
import {Utils} from '#types/utils'
import RedisDataSource = Datasources.RedisDataSource
import PlannerController = Controllers.PlannerController
import RequestBatcher = Utils.RequestBatcher
import ErrorHandler = Utils.ErrorHandler
import PlannerService = Services.PlannerService

export const makePlannerController = (
    service: PlannerService,
    RedisClient: RedisDataSource,
    ErrorHandlerUtil: ErrorHandler,
    RequestBatcher: RequestBatcher
): PlannerController => {
    const getPlanners = async (req: Request, res: Response) => {
        const ret = await RequestBatcher.check(`planner_list`, async () => {
            const res = await service.getPlanners()
            RedisClient.instance.emit('set', req.originalUrl, res, 60 * 60 * 24 * 3)
            return res
        })
        res.json(ret)
    }

    const savePlanner = async (req: Request, res: Response) => {
        ErrorHandlerUtil.validationErrorHandler(req)
        const params = req.body
        const ret = await service.savePlanner(params)
        RedisClient.instance.emit('del', '/api/v1/planner/list')
        RedisClient.instance.emit('del', '/api/v1/planner/latest')
        res.json(ret)
    }

    const deletePlanner = async (req: Request, res: Response) => {
        const id = req.params.id
        const ret = await service.deletePlanner(Number(id))
        RedisClient.instance.emit('del', '/api/v1/planner/list')
        RedisClient.instance.emit('del', '/api/v1/planner/latest')
        res.json(ret)
    }

    const getLatestPlanner = async (req: Request, res: Response) => {
        const ret = await service.getLatest()
        RedisClient.instance.emit('set', req.originalUrl, ret, 60 * 60 * 24 * 3)
        res.json(ret)
    }

    return {
        getPlanners,
        savePlanner,
        deletePlanner,
        getLatestPlanner,
    }
}
