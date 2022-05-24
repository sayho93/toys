import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Log, {stream} from '#utils/logger'

import {apiErrorHandler, logRequest, notFoundErrorHandler} from '#src/loaders/middlewares'
/* Routes */
import route from '#routes/index'

const InitApp = () => {
    const app = express()

    app.use(cors())
    app.use(morgan('[:remote-addr] [:method] [:url] HTTP/:http-version :user-agent', {stream: stream, immediate: true}))
    app.use(express.json())
    app.use(express.text())
    app.use(express.urlencoded({extended: true}))
    app.use('/uploads', express.static('uploads'))
    app.use(logRequest)

    /*Routes*/
    app.use('/', route)

    /*Error handlers*/
    app.use(notFoundErrorHandler)
    app.use(apiErrorHandler)

    Log.verbose('server started consuming')
    return app
}

export default InitApp
