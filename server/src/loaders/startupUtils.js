import Log from '#utils/logger'

export const normalizePort = val => {
    const port = parseInt(val, 10)
    if (isNaN(port)) return val
    if (port >= 0) return port
    return false
}

export const onError = (error, port) => {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

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

export const onListening = server => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    Log.debug('Listening on ' + bind)
    Log.verbose(`NODE_ENV: ${process.env.NODE_ENV}`)
}
