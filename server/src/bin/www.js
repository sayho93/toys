// #!/usr/bin/env node
import Config from 'src/config/Config'
/**
 * Module dependencies.
 */
import app from 'src/app'
import Debug from 'debug'
import http from 'http'
import https from 'https'
const debug = Debug('pkcexpress:server')
import Log from 'src/utils/Logger'
import fs from 'fs'

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || Config.app.PORT)
app.set('port', port)
app.enable('trust proxy')

//TODO HTTPS
// const httpEntrypoint = express()
// const httpPort = normalizePort(process.env.PORT || Config.app.PORT)
// httpEntrypoint.set('port', httpPort)

/**
 * Create HTTP server.
 */
// const option = {
//     key: fs.readFileSync( Config.cert[Config.app.ENV].PRIVATE_KEY_PATH),
//     cert: fs.readFileSync(Config.cert[Config.app.ENV].CERT_PATH),
//     ca: Config.cert[Config.app.ENV].CHAIN_PATH !== undefined ? fs.readFileSync(Config.cert[Config.app.ENV].CHAIN_PATH) : undefined
// }

// TODO HTTPS
// const httpServer = http.createServer(httpEntrypoint)
// const server = https.createServer(option, app)
const server = http.createServer(app)

import socketIo from 'src/socketIO/app.js'
socketIo(server)

/**
 * Listen on provided port, on all network interfaces.
 */
// TODO HTTPS
// httpServer.listen(Config.app.PORT)
// httpServer.on('error', onError)
// httpServer.on('listening', onListeningHttp)

server.listen(port)
server.on('error', onError)
server.on('listening', onListeningHTTPS)

/**
 * https redirect middleware
 */
// TODO HTTPS
// httpEntrypoint.all('*', (req, res, next) => {
//     const protocol = req.headers['x-forwarded-proto'] || req.protocol
//     if(protocol === 'https') next()
//     else{
//         const from = `${protocol}://${req.hostname}:${Config.app.PORT}${req.url}`
//         const to = `https://${req.hostname}:${Config.app.HTTPS_PORT}${req.url}`
//
//         Log.verbose(`[${req.method}]: ${from} -> ${to}`)
//         res.redirect(to)
//     }
// })

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            Log.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            Log.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListeningHttp() {
    const addr = httpServer.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    debug('Listening on ' + bind)
    Log.verbose('Listening on ' + bind)
    Log.verbose(`NODE_ENV: ${process.env.NODE_ENV}`)
}

function onListeningHTTPS() {
    let addr = server.address()
    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    debug('Listening on ' + bind)
    Log.verbose('Listening on ' + bind)
    Log.verbose(`NODE_ENV: ${process.env.NODE_ENV}`)
}
