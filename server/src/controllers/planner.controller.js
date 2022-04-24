import {validationErrorHandler} from '#utils/common.util'

const PlannerController = PlannerService => {
    const getPlanners = async (req, res) => {
        const ret = await PlannerService.getPlanners()
        res.json(ret)
    }

    const savePlanner = async (req, res) => {
        validationErrorHandler(req)
        const params = req.body
        const ret = await PlannerService.savePlanner(params)
        res.json(ret)
    }

    const deletePlanner = async (req, res) => {
        const id = req.params.id
        const ret = await PlannerService.deletePlanner(id)
        res.json(ret)
    }

    const getLatestPlanner = async (req, res) => {
        const ret = await PlannerService.getLatest()
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
