#!/usr/bin/env node
import 'reflect-metadata'
import spdy from 'spdy'
import {normalizePort, onError, onListening} from '#src/loaders/startupUtils'
import fs from 'fs'
import Config from '#configs/config'
import ErrorHandlerUtil from '#utils/errorHandler.util'

await ErrorHandlerUtil.getWebhookCredentials()
const {default: InitApp} = await import('#src/loaders/initApp')
const app = InitApp()

const port = normalizePort(process.env.PORT || Config.app.PORT)
app.set('port', port)

const sslConfig = Config.cert[process.env.NODE_ENV === 'production' ? process.env.NODE_ENV : 'development']
const option = {
    key: fs.readFileSync(sslConfig.PRIVATE_KEY_PATH),
    cert: fs.readFileSync(sslConfig.CERT_PATH),
}
if (sslConfig.CHAIN_PATH) option.cert = fs.readFileSync(sslConfig.CHAIN_PATH)

const server = spdy.createServer(option, app)
server.listen(port, () => {
    try {
        ;(<any>process).send('ready')
    } catch (err) {
        console.log('Not clusterd')
    }
})
server.on('error', error => onError(error, port))
server.on('listening', () => onListening(server))
