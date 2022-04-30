import express from 'express'
import {body} from 'express-validator'
import {AsyncHandler} from '#utils/common.util'
import {checkCache} from '#src/loaders/middlewares'

const router = express.Router({mergeParams: true})

const LotteryRoute = LotteryController => {
    router.post(
        '/save/:userId',
        body('roundNo').notEmpty().withMessage('Round number is required'),
        body('numList').notEmpty().withMessage('List of numbers is required'),
        AsyncHandler(LotteryController.saveLottery)
    )

    router.get('/list', checkCache, AsyncHandler(LotteryController.getLotteries))

    router.get('/fame', checkCache, AsyncHandler(LotteryController.fame))

    router.get('/batchTest', AsyncHandler(LotteryController.batchTest))

    return {router}
}

export default LotteryRoute
