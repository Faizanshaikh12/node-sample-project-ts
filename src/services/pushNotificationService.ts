import { UtilService } from './utilService'
import { FirebaseService } from './firebaseService'
import NotificationHistory from '../models/NotificationHistory'

class PushNotificationService {
	private readonly utilService: UtilService
	private readonly firebaseApp: FirebaseService

	constructor() {
		this.utilService = new UtilService()
		this.firebaseApp = new FirebaseService()
	}

	async updateKycStatusNotification(message: any, fcmToken: string, userId: number, navigate: string) {
		const payload = {
			data: {
				navigate: 'kyc',
				title: message.notifyTitle,
				body: message.notifyBody,
			},
			android: {
				notification: {
					sound: 'trumpet',
					title: message.notifyTitle,
					body: message.notifyBody,
					channelId: 'sherbazaarbell'
				}
			},
			apns: {
				payload: {
					aps: {
						'mutable-content': 1,
						alert: {
							title: message.notifyTitle,
							body: message.notifyBody
						},
						sound: 'bell.wav'
					}
				}
			},
			token: fcmToken
		}
		await this.firebaseApp.getInstance().send(payload)
		const obj = { userId, title: message.notifyTitle, body: message.notifyBody, navigate }
		const notification = new NotificationHistory(obj)
		await notification.save()
	}

	async gameStartNotification(message: any, fcmTokens: string[], userIds: number[], object: any = null) {
		console.log(object);
		const fcmTokenSet = Array.from(new Set(fcmTokens))
		const userIdSet = Array.from(new Set(userIds))
		const payload = {
			data: {
				navigate: `game_${object.GameInstanceID}`,
				gameInstanceId: object.GameInstanceID.toString(),
				gameName: object.GameName,
				title: message.notifyTitle,
				body: message.notifyBody,
			},
			android: {
				notification: {
					sound: 'trumpet',
					title: message.notifyTitle,
					body: message.notifyBody,
					channelId: 'sherbazaartrumpet'
				}
			},
			apns: {
				payload: {
					aps: {
						'mutable-content': 1,
						alert: {
							title: message.notifyTitle,
							body: message.notifyBody
						},
						sound: 'trumpet.mp3'
					}
				},
			},
			tokens: fcmTokenSet
		}
		await this.firebaseApp.getInstance().sendMultiple(payload)
		const obj = { title: message.notifyTitle, body: message.notifyBody, navigate: `game_${object.GameInstanceID}`}
		const notificationsPayload = userIdSet.map((userId) => {
			return {...obj, userId};
		})
		return NotificationHistory.insertMany(notificationsPayload)
	}

	async sendNotifications(message: any, fcmTokens: string[], userIds: number[], object: any = null) {
		const fcmTokenSet = Array.from(new Set(fcmTokens))
		const userIdSet = Array.from(new Set(userIds))
		const payload = {
			android: {
				notification: {
					title: message.notifyTitle,
					body: message.notifyBody,
					...message.imageUrl,
					channelId: 'sherbazaarbell'
				}
			},
			apns: {
				payload: {
					aps: {
						'mutable-content': 1,
						alert: {
							title: message.notifyTitle,
							body: message.notifyBody
						},
						sound: 'bell.wav'
					},
						...message.fcm_options
				},
			},
			tokens: fcmTokenSet
		}
		await this.firebaseApp.getInstance().sendMultiple(payload)
		const obj = { title: message.notifyTitle, body: message.notifyBody, navigate: 'game' }
		const notificationsPayload = userIdSet.map((userId) => {
			return {...obj, userId};
		})
		return NotificationHistory.insertMany(notificationsPayload)
	}

}

export default PushNotificationService