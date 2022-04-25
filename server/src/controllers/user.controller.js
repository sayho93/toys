import {validationErrorHandler} from '#utils/common.util'

const UserController = UserService => {
    const signup = async (req, res) => {
        validationErrorHandler(req)
        const user = await UserService.signup(req.body)
        res.json(user)
    }

    const auth = async (req, res) => {
        const userId = req.params.userId
        const token = req.query.token

        if (!token) res.status(404).send(`<script>alert('token doesn${`\'`}t exists');self.close()</script>`)

        const check = await UserService.auth(userId, token)
        if (check) res.send(`<script>alert('Success');self.close()</script>`)
        else res.status(404).send(`<script>alert('Invalid token');self.close()</script>`)
    }

    const login = async (req, res) => {
        validationErrorHandler(req)
        const user = await UserService.login(req.body)
        res.json(user)
    }

    const getUser = async (req, res) => {
        let id = req.params.id
        const user = await UserService.getUserById(id)
        res.json(user)
    }

    const updateToken = async (req, res) => {
        const userId = req.body.userId
        const token = req.body.token
        const result = await UserService.updateToken(userId, token)
        res.json(result)
    }

    const setUserNotified = async (req, res) => {
        const userId = req.params.userId
        const result = await UserService.setUserNotified(userId)
        res.json(result)
    }

    const testEmail = async (req, res) => {
        const message = req.query.message
        await UserService.testEmail(message)
        res.json(true)
    }

    const testPush = async (req, res) => {
        const message = req.query.message
        await UserService.testPush(message)
        res.json(true)
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
    }
}

export default UserController
