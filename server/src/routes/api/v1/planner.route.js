import express from 'express'
import {body} from 'express-validator'
import {AsyncHandler, checkCache} from '#src/loaders/middlewares'

const PlannerRoute = ({PlannerController}) => {
    const router = express.Router({mergeParams: true})

    router.get('/list', checkCache, AsyncHandler(PlannerController.getPlanners))

    router.post(
        '/save',
        body('userId').notEmpty().withMessage('UserId is required'),
        body('title').notEmpty().withMessage('Title is required'),
        body('targetDate').notEmpty().withMessage('Target date is required'),
        body('color').notEmpty().withMessage('Color is required'),
        AsyncHandler(PlannerController.savePlanner)
    )

    router.get('/delete/:id', AsyncHandler(PlannerController.deletePlanner))

    router.get('/latest', checkCache, AsyncHandler(PlannerController.getLatestPlanner))

    return {router}
}

export default PlannerRoute
