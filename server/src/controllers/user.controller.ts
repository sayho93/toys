import {Request, Response} from 'express'
import {Controllers} from '#types/controllers'
import {Utils} from '#types/utils'
import UserController = Controllers.UserController
import ErrorHandler = Utils.ErrorHandler
import UserService = Services.UserService

export const makeUserController = (service: UserService, ErrorHandler: ErrorHandler): UserController => {
    const signup = async (req: Request, res: Response) => {
        ErrorHandler.validationErrorHandler(req)
        const email = req.body.email
        const password = req.body.password
        const name = req.body.name

        const user = await service.signUp(email, name, password)
        res.json(user)
    }

    const auth = async (req: Request, res: Response) => {
        const userId = req.params.userId
        const token = req.query.token

        if (!token) res.status(404).send(`<script>alert('token doesn${`\'`}t exists');self.close()</script>`)

        if (typeof token === 'string') {
            const check = await service.auth(Number(userId), token)
            if (check) res.send(`<script>alert('Success');self.close()</script>`)
            else res.status(404).send(`<script>alert('Invalid token');self.close()</script>`)
        }
    }

    const login = async (req: Request, res: Response) => {
        ErrorHandler.validationErrorHandler(req)
        const user = await service.login(req.body)
        res.json(user)
    }

    const getUser = async (req: Request, res: Response) => {
        let id = req.params.id
        const user = await service.getUserById(Number(id))
        res.json(user)
    }

    const updateToken = async (req: Request, res: Response) => {
        const userId = req.body.userId
        const token = req.body.token
        const result = await service.updateToken(userId, token)
        res.json(result)
    }

    const setUserNotified = async (req: Request, res: Response) => {
        const userId = req.params.userId
        const result = await service.setUserNotified(Number(userId))
        res.json(result)
    }

    const testEmail = async (req: Request, res: Response) => {
        const message = req.query.message
        if (typeof message === 'string') {
            await service.testEmail(message)
        }
        res.json(true)
    }

    const testPush = async (req: Request, res: Response) => {
        const message = req.query.message
        if (typeof message === 'string') {
            await service.testPush(message)
        }
        res.json(true)
    }

    const workerTest = async (req: Request, res: Response) => {
        const ret = await service.workerTest(Number(req.params.num))
        res.json(Number(ret))
    }

    return {
        signup,
        auth,
        login,
        getUser,
        updateToken,
        setUserNotified,
        testEmail,
        testPush,
        workerTest,
    }
}
