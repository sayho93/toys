import firebase from 'firebase/app'
import messaging from 'firebase/messaging'
import FirebaseCredentials from 'constants/FirebaseCredentials'

const enableMessaging = async () => {
    const clientCredentials = FirebaseCredentials.client

    if (firebase.messaging.isSupported()) {
        !firebase.apps.length ? firebase.initializeApp(clientCredentials) : firebase.app()
        const messaging = firebase.messaging()

        messaging.onMessage(payload => {
            console.log('onMessage: ', payload)
            navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
                registration.showNotification(payload.notification.title, payload.notification)
            })
        })

        try {
            const token = await messaging.getToken({vapidKey: FirebaseCredentials.vapidKey})
            if (token) return token
            else console.log('No registration token available. Request permission to generate one.')
        } catch (err) {
            console.log('An error occurred while retrieving token. ', err)
        }
    } else return null
}

export default enableMessaging
