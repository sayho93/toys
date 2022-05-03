import {jest} from '@jest/globals'
import Log from '#utils/logger'

export const mockRequest = (params = {}, body = {}, query = {}) => {
    const req = {}
    req.params = params
    req.body = body
    req.query = query
    return req
}

export const mockResponse = () => {
    const res = {}
    res.send = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn(ret => {
        Log.info(JSON.stringify(ret))
    })
    return res
}
