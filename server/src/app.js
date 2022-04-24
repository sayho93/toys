#!/usr/bin/env node
import * as http from 'http'
import Config from '#configs/config'
import {normalizePort, onError, onListening} from '#src/loaders/startupUtils'
import InitApp from '#src/loaders/initApp'
import {Controllers, Services} from '#src/loaders/dependencies'

import socketIo from '#src/socketIO/app'
import LotteryJob from '#src/jobs/lottery.job'

const app = InitApp({Controllers})
LotteryJob(Services.lotteryService).start()

const port = normalizePort(process.env.PORT || Config.app.PORT)
app.set('port', port)

const server = http.createServer(app)
socketIo(server)
server.listen(port)
server.on('error', error => onError(error, port))
server.on('listening', () => onListening(server))

export {}
