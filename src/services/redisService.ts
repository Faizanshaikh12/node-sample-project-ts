import { createClient } from 'redis'
import * as Sentry from '@sentry/node'
import { RDS_DB } from '../constants'


export class RedisClientService {
	private readonly client

	constructor() {
		let options = {}
		if (+RDS_DB.RDS_PORT_LOCAL === 1) {
			options = {
				socket: {
					host: RDS_DB.RDS_HOST,
					port: RDS_DB.RDS_PORT
				}
			}
		}

		this.client = createClient(options)

		this.client.on('connect', () => {
			console.log('Redis client successfully initiated connection to the servers.')
			Sentry.captureMessage('Redis client successfully initiated connection to the server.')
		})

		this.client.on('error', function(err) {
			console.log('could not establish a connection with redis. ' + err)
			Sentry.captureException('could not establish a connection with redis. ' + err)
		})

		this.client.on('disconnect', function(err) {
			console.log('disconnected to redis successfully')
			Sentry.captureException('disconnected to redis successfully. ' + err)
		})
	}

	async get(key: string) {
		await this.client.connect()
		const data = await this.client.get(key)
		await this.client.quit()
		return data
	}

	async exists(key: string) {
		await this.client.connect()
		const data: any = await this.client.exists(key)
		Sentry.captureMessage('exists data', data)
		await this.client.quit()
		return data
	}

	async set(key: string, val: string, ttl: object) {
		await this.client.connect()
		const data: any = await this.client.set(key, val, ttl)
		Sentry.captureMessage('set data', data)
		await this.client.quit()
		Sentry.captureMessage('quit', data)
		return data
	}

	async delete(key: string) {
		await this.client.connect()
		const data: any = await this.client.del(key)
		await this.client.quit()
		return data
	}
}
