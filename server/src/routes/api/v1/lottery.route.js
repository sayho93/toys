import express from 'express'
import {body} from 'express-validator'
import {AsyncHandler, checkCache} from '#src/loaders/middlewares'
import Container from '#src/loaders/container'

const LotteryRoute = () => {
    const LotteryController = Container.get('LotteryController')
    const router = express.Router({mergeParams: true})

    router.post(
        '/save/:userId',
        body('roundNo').notEmpty().withMessage('Round number is required'),
        body('numList').notEmpty().withMessage('List of numbers is required'),
        AsyncHandler(LotteryController.saveLottery)
    )

    router.get('/list', checkCache, AsyncHandler(LotteryController.getLotteries))

    router.get('/fame', checkCache, AsyncHandler(LotteryController.fame))

    router.get('/batchTest', AsyncHandler(LotteryController.batchTest))

    return router
}

export default LotteryRoute
