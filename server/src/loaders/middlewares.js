import Log from '#utils/logger'
import createError from 'http-errors'
import Container from '#src/loaders/container'

const _resInterceptor = (res, send) => content => {
    res.contentBody = content
    res.send = send
    res.send(content)
}

export const logRequest = (req, res, next) => {
    const {headers} = req
    headers['cache-control'] = 'no-cache'
    if (req.method === 'DELETE') return next()
    if (req.method === 'GET') Log.http(`[${req.method}] parameter: ${JSON.stringify(req.query)}`)
    else Log.http(`[${req.method}] parameter: ${JSON.stringify(req.body)}`)
    res.locals.user = req.user
    res.locals.param = req.query

    res.send = _resInterceptor(res, res.send)

    res.on('finish', () => {
        Log.http(`[${req.method}] [${req.originalUrl}] response: [${res.statusCode}] ${res.contentBody}`)
    })

    next()
}

export const notFoundErrorHandler = (req, res, next) => {
    next(createError(404, 'Not Found'))
}

export const apiErrorHandler = (err, req, res, next) => {
    Log.error(err.stack)
    Log.error(JSON.stringify({error: err.message, status: err.status}))
    if (err.status) res.status(err.status).json({error: err.message, status: err.status})
    else res.status(500).json({error: 'Internal server error', status: 500})
}

export const checkCache = async (req, res, next) => {
    const redisClient = Container.get('RedisClient')
    if (req.method !== 'GET') return next()

    const cachedData = await redisClient.get(req.originalUrl)

    if (!cachedData) {
        Log.verbose(`[${req.originalUrl}] cache miss`)
        return next()
    }

    Log.verbose(`[${req.originalUrl}] cache hit`)
    res.json(JSON.parse(cachedData))
}

export const AsyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
