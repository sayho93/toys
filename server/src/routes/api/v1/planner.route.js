import express from 'express'
import {body} from 'express-validator'
import {AsyncHandler} from '#utils/common.util'

const router = express.Router({mergeParams: true})

const PlannerRoute = PlannerController => {
    router.get('/list', AsyncHandler(PlannerController.getPlanners))

    router.post(
        '/save',
        body('userId').notEmpty().withMessage('UserId is required'),
        body('title').notEmpty().withMessage('Title is required'),
        body('targetDate').notEmpty().withMessage('Target date is required'),
        body('color').notEmpty().withMessage('Color is required'),
        AsyncHandler(PlannerController.savePlanner)
    )

    router.get('/delete/:id', AsyncHandler(PlannerController.deletePlanner))

    router.get('/latest', AsyncHandler(PlannerController.getLatestPlanner))

    return {router}
}

export default PlannerRoute
