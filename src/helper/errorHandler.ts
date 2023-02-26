import replace from 'lodash/replace'
import { ErrorRequestHandler } from 'express'
import { MESSAGE } from '../constants/messages'
import { CRON_MODULE, CRON_TIME } from '../constants/cron'
import CronHistory from '../models/CronHistory'

export const UNAUTHORIZED = 'Unauthorized'

export const HttpStatusCodes = {
	INTERNAL_SERVER_ERROR: 500
}

export interface ErrorPayload {
	errorCode?: string
	httpStatusCode?: number
	json?: string
	finalClosure?: () => Promise<void>
}

export class SBError extends Error {
	finalClosure?: () => Promise<void>
	httpStatusCode?: number
	errorCode?: string
	json?: string

	constructor(message: string, errorPayload?: ErrorPayload) {
		super(message)
		this.finalClosure = errorPayload?.finalClosure
		this.httpStatusCode = errorPayload?.httpStatusCode
		this.errorCode = errorPayload?.errorCode
		this.name = this.constructor.name
		this.json = errorPayload?.json
	}
}

export const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (typeof err.code === 'string' && (err.code.startsWith('42') || err.code.startsWith('22'))) {
		err.message = 'Internal server error: Database error during request'
	}
	const { errorCode, httpStatusCode } = err
	res.statusCode = httpStatusCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR
	let message = err.message
	if (err.message.includes('SBError')) {
		message = replace(message, new RegExp('SBError: ', 'g'), '')
	} else if (err.code === 'LIMIT_FILE_SIZE') {
		message = MESSAGE.FILE_SIZE
		err.errorCode = '400'
		err.httpStatusCode = 400
	} else {
		message = replace(message, new RegExp('Error: ', 'g'), '')
		err.errorCode = '400'
		err.httpStatusCode = 400
	}
	return res.json({
		message: message,
		code: httpStatusCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR
	})
}

export const cronJonErrorHandler = async (payload: any) => {
	const cronHistory = new CronHistory(payload)
	await cronHistory.save()
}

export const joiErrorHandler = (error: { details: string[] }) => {
	let errors: any = []
	if (error && error.details.length !== 0) {
		error.details.map((err: any) => {
			const message = replace(err.message, new RegExp('"', 'g'), '')
			const key = err.context.key
			errors.push({
				field: key,
				message: message
			})
		})
	}
	return errors
}
