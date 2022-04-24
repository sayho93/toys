// noinspection DuplicatedCode
import {mockRequest, mockResponse} from '#tests/utils/interceptor'
import UserController from '#controllers/user.controller'
import {Services} from '#src/loaders/dependencies'

describe('user.controller', () => {
    const userController = UserController(Services.userService)
    it('should return object array', async () => {
        const req = mockRequest()
        const res = mockResponse()
        const ret = await userController.getUser(req, res)
        console.log(ret)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json.mock.calls.length).toBe(1)
        // expect(res.json).toHaveBeenCalledWith({message: 'Not Found'})
    })
})
