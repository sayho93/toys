import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import Config from 'src/config/Config'

import Api from 'src/routes/Api'
import Log, {stream} from 'src/utils/Logger'
import bodyParser from 'body-parser'
import cors from 'cors'
import createError from 'http-errors'

/**
 * Database
 */
import Datasource from 'src/database/Datasource'
import UserMapper from 'src/database/query/UserMapper'
import LotteryMapper from 'src/database/query/LotteryMapper'
import PlannerMapper from 'src/database/query/PlannerMapper'
import FileMapper from 'src/database/query/FileMapper'
import ArticleMapper from 'src/database/query/ArticleMapper'
import dotenv from 'dotenv'

const app = express()
dotenv.config()

/**
 * Router with database Mapper
 */
const dataSource = Datasource(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        port: 3306,
    },
    Log
)

const Mappers = {
    userMapper: UserMapper(dataSource),
    lotteryMapper: LotteryMapper(dataSource),
    plannerMapper: PlannerMapper(dataSource),
    articleMapper: ArticleMapper(dataSource),
    fileMapper: FileMapper(dataSource),
}

const AsyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
const api = Api({Mappers, AsyncHandler})

const logRequest = (req, res, next) => {
    const {headers} = req
    headers['cache-control'] = 'no-cache'
    if (req.method === 'GET') Log.http(`[${req.method}] parameter: ${JSON.stringify(req.query)}`)
    else Log.http(`[${req.method}] parameter: ${JSON.stringify(req.body)}`)
    res.locals.user = req.user
    res.locals.param = req.query
    next()
}

const logResponseBody = (req, res, next) => {
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
        Log.http(`[${req.path}] response: ${body}`)
        oldEnd.apply(res, arguments)
    }

    next()
}

const notFoundErrorHandler = (req, res, next) => {
    next(createError(404, 'Not Found'))
}

const apiErrorHandler = (err, req, res, next) => {
    Log.error(err.stack)
    Log.error(JSON.stringify({error: err.message, status: err.status}))
    if (err.status) res.status(err.status).json({error: err.message, status: err.status})
    else res.status(500).json({error: 'Internal server error', status: 500})
}

// const errorHandler = (err, req, res, next) => {
//     Log.debug(':::::::::::::::::::errorHandler')
//     res.status(500)
//     res.render('error', {error: err})
// }

// const  accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(cors())
app.use(morgan('[:remote-addr] [:method] [:url] HTTP/:http-version :user-agent', {stream: stream, immediate: true}))
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser(Config.app.SESSION_KEY))

// app.use(
//     session({
//         secret: Config.app.SESSION_KEY,
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             httpOnly: true,
//             secure: false,
//         },
//     })
// )

/**
 * static file serve
 */
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))

/**
 * routers
 */
app.use(logRequest)
app.use(logResponseBody)
// app.use('/', webRouter)
app.use('/api', api.router)
/**
 * error handlers
 */
app.use(notFoundErrorHandler)
app.use(apiErrorHandler)
// app.use(errorHandler)

Log.verbose('server started consuming')

export default app
