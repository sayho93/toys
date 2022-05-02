// noinspection DuplicatedCode
import {mockRequest, mockResponse} from '#tests/utils/interceptor'
import UserController from '#controllers/user.controller'
import Container from '#src/loaders/container'

const container = await Container.init()

const UserService = container.resolve('UserService')
const ErrorHandlerUtil = container.resolve('ErrorHandlerUtil')

describe('user.controller', () => {
    const userController = UserController({UserService, ErrorHandlerUtil})
    it('should return object array', async () => {
        const req = mockRequest({id: 45})
        const res = mockResponse()
        await userController.getUser(req, res)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json.mock.calls.length).toBe(1)
        // expect(res.json).toHaveBeenCalledWith({message: 'Not Found'})
    })
})
