#!/usr/bin/env node
// import * as http from 'http'
import spdy from 'spdy'
import {normalizePort, onError, onListening} from '#src/loaders/startupUtils'
import Container from '#src/loaders/container'
import fs from 'fs'

await Container.init()
const {default: InitApp} = await import('#src/loaders/initApp')
const {default: socketIo} = await import('#src/socketIO/app')

const Config = Container.get('Config')
const app = InitApp()
const LotteryJob = Container.get('LotteryJob')
LotteryJob.start()

const port = normalizePort(process.env.PORT || Config.app.PORT)
app.set('port', port)

const sslConfig = Config.cert[process.env.NODE_ENV]
const option = {
    key: fs.readFileSync(sslConfig.PRIVATE_KEY_PATH),
    cert: fs.readFileSync(sslConfig.CERT_PATH),
}
if (sslConfig.CHAIN_PATH) option.cert = fs.readFileSync(sslConfig.CHAIN_PATH)

const server = spdy.createServer(option, app)
socketIo(server)
server.listen(port)
server.on('error', error => onError(error, port))
server.on('listening', () => onListening(server))
