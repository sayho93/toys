import {validationErrorHandler} from '#utils/common.util'
import {redisClient} from '#src/loaders/dependencies'

const PlannerController = (PlannerService, requestBatch) => {
    const getPlanners = async (req, res) => {
        const ret = await requestBatch.check(`planner_list`, () => PlannerService.getPlanners())
        redisClient.emit('set', req.originalUrl, ret, 60 * 60 * 24 * 3)
        res.json(ret)
    }

    const savePlanner = async (req, res) => {
        validationErrorHandler(req)
        const params = req.body
        const ret = await PlannerService.savePlanner(params)
        redisClient.emit('del', '/api/v1/planner/list')
        redisClient.emit('del', '/api/v1/planner/latest')
        res.json(ret)
    }

    const deletePlanner = async (req, res) => {
        const id = req.params.id
        const ret = await PlannerService.deletePlanner(id)
        redisClient.emit('del', '/api/v1/planner/list')
        redisClient.emit('del', '/api/v1/planner/latest')
        res.json(ret)
    }

    const getLatestPlanner = async (req, res) => {
        const ret = await PlannerService.getLatest()
        redisClient.emit('set', req.originalUrl, ret, 60 * 60 * 24 * 3)
        res.json(ret)
    }

    return {
        getPlanners,
        savePlanner,
        deletePlanner,
        getLatestPlanner,
    }
}

export default PlannerController
