import {validationErrorHandler} from '#utils/common.util'

const PlannerController = ({PlannerService, RequestBatch, RedisClient}) => {
    const getPlanners = async (req, res) => {
        const ret = await RequestBatch.check(`planner_list`, () => PlannerService.getPlanners())
        RedisClient.emit('set', req.originalUrl, ret, 60 * 60 * 24 * 3)
        res.json(ret)
    }

    const savePlanner = async (req, res) => {
        validationErrorHandler(req)
        const params = req.body
        const ret = await PlannerService.savePlanner(params)
        RedisClient.emit('del', '/api/v1/planner/list')
        RedisClient.emit('del', '/api/v1/planner/latest')
        res.json(ret)
    }

    const deletePlanner = async (req, res) => {
        const id = req.params.id
        const ret = await PlannerService.deletePlanner(id)
        RedisClient.emit('del', '/api/v1/planner/list')
        RedisClient.emit('del', '/api/v1/planner/latest')
        res.json(ret)
    }

    const getLatestPlanner = async (req, res) => {
        const ret = await PlannerService.getLatest()
        RedisClient.emit('set', req.originalUrl, ret, 60 * 60 * 24 * 3)
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
