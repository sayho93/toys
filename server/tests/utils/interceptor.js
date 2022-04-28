import {jest} from '@jest/globals'

export const mockRequest = (params = {}, body = {}) => {
    const req = {}
    req.params = params
    req.body = body
    return req
}

export const mockResponse = () => {
    const res = {}
    res.send = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}
