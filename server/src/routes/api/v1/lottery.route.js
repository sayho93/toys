import express from 'express'
import {body} from 'express-validator'
import {AsyncHandler} from '#utils/common.util'

const router = express.Router({mergeParams: true})

const LotteryRoute = LotteryController => {
    router.post(
        '/save/:userId',
        body('roundNo').notEmpty().withMessage('Round number is required'),
        body('numList').notEmpty().withMessage('List of numbers is required'),
        AsyncHandler(LotteryController.saveLottery)
    )

    router.get('/list', AsyncHandler(LotteryController.getLotteries))

    router.get('/fame', AsyncHandler(LotteryController.fame))

    router.get('/batchTest', AsyncHandler(LotteryController.batchTest))

    return {router}
}

export default LotteryRoute
