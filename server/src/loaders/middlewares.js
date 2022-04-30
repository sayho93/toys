import Log from '#utils/logger'
import createError from 'http-errors'
import {redisClient} from '#src/loaders/dependencies'

export const logRequest = (req, res, next) => {
    const {headers} = req
    headers['cache-control'] = 'no-cache'
    if (req.method === 'GET') Log.http(`[${req.method}] parameter: ${JSON.stringify(req.query)}`)
    else Log.http(`[${req.method}] parameter: ${JSON.stringify(req.body)}`)
    res.locals.user = req.user
    res.locals.param = req.query
    next()
}

export const logResponseBody = (req, res, next) => {
    const oldWrite = res.write,
        oldEnd = res.end

    const chunks = []

    res.write = chunk => {
        chunks.push(chunk)
        return oldWrite.apply(res, arguments)
    }

    res.end = function (chunk) {
        if (chunk) chunks.push(chunk)
        const body = Buffer.concat(chunks.map(x => (typeof x === 'string' ? Buffer.from(x, 'binary') : x))).toString('utf8')
        Log.verbose(`[${req.originalUrl}] response: ${body}`)
        oldEnd.apply(res, arguments)
    }

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
    if (req.method !== 'GET') return next()

    const cachedData = await redisClient.get(req.originalUrl)

    if (!cachedData) {
        Log.verbose(`[${req.originalUrl}] cache miss`)
        return next()
    }

    Log.verbose(`[${req.originalUrl}] cache hit`)
    res.send(JSON.parse(cachedData))
}
