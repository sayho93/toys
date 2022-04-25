import admin from 'firebase-admin'
import Config from '#configs/config'
import Underscore from 'underscore'
import Log from '#utils/logger'

// const serviceAccount = JSON.parse(fs.readFileSync(Config.app.FCM_CONFIG, 'utf8'))

const PushManager = () => {
    const serviceAccount = Config.firebaseConfig

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })

    const MULTICAST_LIMIT_SIZE = 500

    const _checkMessageLength = message => {
        if (message.length > 20) return message.substring(0, 15) + ' ...'
        else return message
    }

    const _sendOnlyData = async (registrationKeys, extras) => {
        if (!registrationKeys.length) return

        Log.verbose(JSON.stringify(registrationKeys))

        const msgObj = {
            notification: {
                body: '',
                title: '',
            },
            data: {
                message: extras,
            },
            token: '',
            tokens: '',
        }
        Log.verbose(`payload: ${JSON.stringify(msgObj)}`)

        const response = await admin.messaging().sendMulticast(msgObj)
        const failedTokens = registrationKeys.filter((_, idx) => !response.responses[idx].success)
        Log.warn('List of tokens failed: ' + failedTokens)
    }

    const _send = async (registrationKeys, title, message, extras) => {
        if (!registrationKeys.length) return

        const msgObj = {
            notification: {
                title: title,
                body: message,
            },
            data: extras,
            token: '',
            tokens: registrationKeys,
        }
        Log.info(JSON.stringify(msgObj))

        const response = await admin.messaging().sendMulticast(msgObj)
        Log.verbose(JSON.stringify(response))

        const failedTokens = registrationKeys.filter((_, idx) => !response.responses[idx].success)
        Log.warn('List of tokens failed: ' + failedTokens)
    }

    const sendOnlyData = (registrationKeys, extras) => {
        const multicastUnit = Underscore.chunk(MULTICAST_LIMIT_SIZE)
        // const checkMessage = checkMessageLength(message)
        //TODO
        multicastUnit.forEach(item => {
            _sendOnlyData(item, extras)
        })
    }

    const send = async (registrationKeys, title, message, extras = {}) => {
        const multicastChunks = Underscore.chunk(registrationKeys, MULTICAST_LIMIT_SIZE)
        Log.verbose(JSON.stringify(multicastChunks))

        const checkMessage = _checkMessageLength(message)
        Log.verbose(`message: ${checkMessage}`)

        const promises = multicastChunks.map(async list => {
            Log.verbose(JSON.stringify(list))
            await _send(list, title, checkMessage, extras)
        })
        await Promise.all(promises)
    }

    return {
        send,
        sendOnlyData,
    }
}

export default PushManager()
