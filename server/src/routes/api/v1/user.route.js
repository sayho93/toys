import express from 'express'
import {body} from 'express-validator'
import {AsyncHandler} from '#src/loaders/middlewares'

const UserRoute = ({UserController}) => {
    const router = express.Router({mergeParams: true})

    router.get('/worker-test/:num', AsyncHandler(UserController.workerTest))

    router.post(
        '/signup',
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
        body('name').notEmpty().withMessage('Name is required'),
        AsyncHandler(UserController.signup)
    )

    router.get('/auth/:userId', AsyncHandler(UserController.auth))

    router.post(
        '/login',
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
        AsyncHandler(UserController.login)
    )

    router.get('/:id', AsyncHandler(UserController.getUser))

    router.post('/updateToken', body('userId').notEmpty().withMessage('UserId is required'), AsyncHandler(UserController.updateToken))

    router.get('/test/email', AsyncHandler(UserController.testEmail))

    router.get('/test/push', AsyncHandler(UserController.testPush))

    router.get('/notified/:userId', AsyncHandler(UserController.setUserNotified))

    return {router}
}

export default UserRoute
