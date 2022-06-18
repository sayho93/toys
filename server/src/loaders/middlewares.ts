import Log from '#utils/logger'
import createError from 'http-errors'
import Container from '#src/loaders/container'
import {ErrorRequestHandler, NextFunction, Request, RequestHandler, Response} from 'express'

const _resInterceptor = (req: Request, res: any, send: Function) => (content: any) => {
    res.contentBody = content
    res.send = send
    res.send(content)
    Log.http(`[${req.method}] [${req.originalUrl}] response: [${res.statusCode}] ${content}`)
}

export const logRequest = (req: Request, res: any, next: NextFunction) => {
    const {headers} = req
    headers['cache-control'] = 'no-cache'
    if (req.method === 'DELETE') return next()
    if (req.method === 'GET') Log.http(`[${req.method}] parameter: ${JSON.stringify(req.query)}`)
    else Log.http(`[${req.method}] parameter: ${JSON.stringify(req.body)}`)

    res.send = _resInterceptor(req, res, res.send)

    // res.on('finish', () => {
    //     Log.http(`[${req.method}] [${req.originalUrl}] response: [${res.statusCode}] ${res.contentBody}`)
    // })

    next()
}

export const notFoundErrorHandler: RequestHandler = (req, res, next) => {
    next(createError(404, 'Not Found'))
}

export const apiErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    Log.error(err.stack)
    Log.error(JSON.stringify({error: err.message, status: err.status}))
    if (err.status) res.status(err.status).json({error: err.message, status: err.status})
    else res.status(500).json({error: 'Internal server error', status: 500})
}

export const checkCache: RequestHandler = async (req, res, next) => {
    const redisClient = Container.redisDatasource

    if (req.method !== 'GET') return next()

    const cachedData = await redisClient.instance.get(req.originalUrl)

    if (!cachedData) {
        Log.verbose(`[${req.originalUrl}] cache miss`)
        return next()
    }

    Log.verbose(`[${req.originalUrl}] cache hit`)
    res.json(JSON.parse(cachedData))
}

export const AsyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next)
