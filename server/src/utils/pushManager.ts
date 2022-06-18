import admin, {messaging, ServiceAccount} from 'firebase-admin'
import Config from '#configs/config'
import Underscore from 'underscore'
import Log from '#utils/logger'
import MulticastMessage = messaging.MulticastMessage

// const serviceAccount = JSON.parse(fs.readFileSync(Config.app.FCM_CONFIG, 'utf8'))

const PushManager = () => {
    const serviceAccount: ServiceAccount = {
        projectId: Config.firebaseConfig.project_id,
        clientEmail: Config.firebaseConfig.client_email,
        privateKey: Config.firebaseConfig.private_key,
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })

    const MULTICAST_LIMIT_SIZE = 500

    const _checkMessageLength = (message: string) => {
        if (message.length > 20) return message.substring(0, 15) + ' ...'
        else return message
    }

    const _sendOnlyData = async (registrationKeys: string[], extras: any) => {
        if (!registrationKeys.length) return

        Log.verbose(JSON.stringify(registrationKeys))

        const msgObj: MulticastMessage = {
            notification: {
                body: '',
                title: '',
            },
            data: {
                message: extras,
            },
            tokens: [],
        }
        Log.verbose(`payload: ${JSON.stringify(msgObj)}`)

        const response = await admin.messaging().sendMulticast(msgObj)
        const failedTokens = registrationKeys.filter((_, idx) => !response.responses[idx].success)
        Log.warn('List of tokens failed: ' + failedTokens)
    }

    const _send = async (registrationKeys: string[], title: string, message: string, extras: any) => {
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

    const sendOnlyData = (registrationKeys: string[], extras: any) => {
        const multicastUnit = Underscore.chunk(registrationKeys, MULTICAST_LIMIT_SIZE)
        // const checkMessage = checkMessageLength(message)
        //TODO
        multicastUnit.forEach(item => {
            _sendOnlyData(item, extras)
        })
    }

    const send = async (registrationKeys: string[], title: string, message: string, extras = {}) => {
        const multicastChunks = Underscore.chunk(registrationKeys, MULTICAST_LIMIT_SIZE)
        Log.verbose(JSON.stringify(multicastChunks))

        const checkMessage = _checkMessageLength(message)
        Log.verbose(`message: ${checkMessage}`)

        await Promise.all(
            multicastChunks.map(async list => {
                Log.verbose(JSON.stringify(list))
                await _send(list, title, checkMessage, extras)
            })
        )
    }

    return {
        send,
        sendOnlyData,
    }
}

export default PushManager()
