#!/usr/bin/env node
import * as http from 'http'
import {normalizePort, onError, onListening} from '#src/loaders/startupUtils'
import Container from '#src/loaders/container'

await Container.init()

// import InitApp from '#src/loaders/initApp'
// import socketIo from '#src/socketIO/app'
const {default: InitApp} = await import('#src/loaders/initApp')
const {default: socketIo} = await import('#src/socketIO/app')

const Config = Container.get('Config')
const app = InitApp()
const LotteryJob = Container.get('LotteryJob')
LotteryJob.start()

const port = normalizePort(process.env.PORT || Config.app.PORT)
app.set('port', port)

const server = http.createServer(app)
socketIo(server)
server.listen(port)
server.on('error', error => onError(error, port))
server.on('listening', () => onListening(server))
