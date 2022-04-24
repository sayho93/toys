import admin from 'firebase-admin'
import Config from '#configs/config'
import Underscore from 'underscore'
import _ from 'lodash'
import Log from '#utils/logger'

const {default: serviceAccount} = await import(Config.app.FCM_CONFIG, {assert: {type: 'json'}})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const payload = {
    notification: {
        body: '',
        title: '',
    },
    data: {},
    token: '',
    tokens: '',
}

class PushManager {
    constructor() {
        this.MULTICAST_LIMIT_SIZE = 500
    }

    async _sendOnlyData(registrationKeys, extras) {
        if (registrationKeys.length === 0) return
        Log.verbose(JSON.stringify(registrationKeys))
        const json = _.cloneDeep(payload)
        Log.verbose(`payload: ${JSON.stringify(payload)}`)
        json.data.message = extras

        const response = await admin.messaging().sendMulticast(json)
        const failedTokens = registrationKeys.filter((_, idx) => !response.responses[idx].success)
        Log.warn('List of tokens failed: ' + failedTokens)
    }

    async _send(registrationKeys, title, message, extras) {
        if (registrationKeys.length === 0) return
        const json = _.cloneDeep(payload)
        json.notification.title = title
        json.notification.body = message
        json.data = extras
        json.tokens = registrationKeys
        Log.info(JSON.stringify(json))
        const response = await admin.messaging().sendMulticast(json)
        Log.verbose(JSON.stringify(response))
        const failedTokens = registrationKeys.filter((_, idx) => !response.responses[idx].success)
        Log.warn('List of tokens failed: ' + failedTokens)
    }

    sendOnlyData(registrationKeys, extras) {
        const multicastUnit = Underscore.chunk(this.MULTICAST_LIMIT_SIZE)
        const checkMessage = this.checkMessageLength(message)
        //TODO
        multicastUnit.forEach(item => {
            this._sendOnlyData(item, extras)
        })
    }

    async send(registrationKeys, title, message, extras = {}) {
        const multicastUnit = Underscore.chunk(registrationKeys, this.MULTICAST_LIMIT_SIZE)
        Log.verbose(JSON.stringify(multicastUnit))
        const checkMessage = this.checkMessageLength(message)
        Log.verbose(`message: ${checkMessage}`)

        const promises = multicastUnit.map(async list => {
            Log.verbose(JSON.stringify(list))
            await this._send(list, title, checkMessage, extras)
        })
        await Promise.all(promises)
    }

    checkMessageLength(message) {
        if (message.length > 20) return message.substring(0, 15) + ' ...'
        else return message
    }
}

export default new PushManager()
