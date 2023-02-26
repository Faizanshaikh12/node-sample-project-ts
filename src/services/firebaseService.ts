import { cert, initializeApp, App } from 'firebase-admin/app'
import { getMessaging, Messaging, Message } from 'firebase-admin/messaging'
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api'
import * as Sentry from '@sentry/node'

export class FirebaseApp {
    private readonly app: App
    private readonly messaging: Messaging
    constructor() {
        this.app = initializeApp({
            credential: cert(process.cwd() + '/firebase.json'),
        }, 'firebase')

        // Initialize Firebase Cloud Messaging and get a reference to the service
        this.messaging = getMessaging(this.app)
    }

    send(payload: Message) {
        return this.messaging.send(payload)
            .then((response) => {
                // Response is a message ID string.
                Sentry.captureMessage('Successfully sent message:');
                console.log('Successfully sent message:', response)
            })
            .catch((error) => {
                Sentry.captureException('Error sending message:', error);
                console.log('Error sending message:', error)
            })
    }

    sendMultiple(payload: MulticastMessage) {
        return this.messaging.sendMulticast(payload)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response)
            })
            .catch((error) => {
                console.log('Error sending message:', error)
            })
    }
}

export class FirebaseService {
    private static instance: FirebaseApp
    constructor() {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseApp()
        }
    }

    getInstance() {
        return FirebaseService.instance
    }

}
