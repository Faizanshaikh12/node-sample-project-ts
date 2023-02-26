import axios from 'axios'
import { randomBytes } from 'crypto'
import * as Sentry from '@sentry/node'
import S3Service from './s3Services'
import { COMMON_CONSTANT, GLOBAL_FEED, OTP_PROVIDER } from '../constants'
import { IAxiosConfig, ReqFileType } from '../types'
import AWS from 'aws-sdk'
import moment from 'moment'
import Stock from '../models/Stock'
import { SBError } from '../helper/errorHandler'
import SettingService from '../api/setting/settingService'

export class UtilService {
	private readonly s3Service: S3Service

	constructor() {
		this.s3Service = new S3Service()
	}

	// generate Army Code
	generateArmyName = (length = 8) => {
		let result = ''
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		let charactersLength = characters.length
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	// generate otp
	generateOtp = (length = 4) => {
		let digits = '0123456789'
		let OTP = ''
		for (let i = 0; i < length; i++) {
			OTP += digits[Math.floor(Math.random() * 10)]
		}
		return OTP
	}

	// receive message
	getOtpMessage(otp: string) {
		return `Your Sherbazaar Code is ${otp}. Your Code will be valid for 3 minutes and never share this code with anyone. ID: ${COMMON_CONSTANT.MVF_TEMP_ID}`
	}

	// random string
	generateRandomString(length: number) {
		return randomBytes(length).toString('hex')
	}

	async uploadFile(file: ReqFileType, uploadPath: string, name: string, compressImage?: any): Promise<AWS.S3.ManagedUpload.SendData> {
		const names = name || file.originalname
		const fileName = new Date().getTime() + '_' + names

		let fileNameWithoutSpace = fileName.replace(/\s/g, '_')
		const ext = file.originalname.split('.').pop()

		if (fileNameWithoutSpace.length > 200) {
			fileNameWithoutSpace = fileNameWithoutSpace.substring(0, 40) + '.' + ext
		} else {
			fileNameWithoutSpace = fileNameWithoutSpace + '.' + ext
		}
		return new Promise((resolve, reject) =>
			this.s3Service

				.uploadFileS3(file, `uploads/${uploadPath}/${fileNameWithoutSpace}`)

				.then((data: any) => resolve(data))

				.catch((error: any) => {
					reject(error)
				})
		)
	}

	// send message
	async sendSMS(message: any, contacts: any): Promise<any> {
		const settingService = new SettingService()
		const data: any = await settingService.getOtpToken(OTP_PROVIDER.VFIRST);
		const token = data.OtpToken
		const url = `https://http.myvfirst.com/smpp/sendsms?to=91${contacts}&from=${COMMON_CONSTANT.MVF_FROM}&text=${message}`
		const config: IAxiosConfig = {
			method: 'GET',
			url,
			headers: {
				authorization: `Bearer ${token}`,
				'content-type': 'application/json'
			}
		}
		await axios(config)
			.then((res) => {
				console.log(res)
				Sentry.captureMessage(res.data)
			})
			.catch((err) => {
				Sentry.captureException(err)
				console.log(err.response.data)
			})
	}

	async generateSMSToken(token: string, apiKey: string) {
		const url = 'https://http.myvfirst.com/smpp/api/sendsms/token?action=generate'
		const others = token ? { data: { old_token: token } } : undefined
		const config: IAxiosConfig = {
			method: 'POST',
			url,
			...others,
			headers: {
				apikey: apiKey,
				'content-type': 'application/json'
			}
		}
		return axios(config)
			.then((res) => {
				console.log(res.data)
				return res.data
			})
			.catch((err) => {
				console.log(err)
				Sentry.captureException(err.response)
				throw new SBError(err?.response?.data || err, { json: err.response.toString() })
			})
	}

	async getStockHistory(): Promise<any> {
		const stocks = await Stock.find()
		if (stocks.length <= 0) {
			console.log('Stock Data Is Empty!')
		} else {
			const to = moment().unix()
			const from = moment().subtract(6, 'months').unix() // MONTH
			const promise = stocks.map((stock) => {
				const url = `${GLOBAL_FEED.STOCK_HISTORY}&instrumentIdentifier=${stock.IDENTIFIER}&periodicity=HOUR&from=${from}&to=${to}`
				const config: IAxiosConfig = {
					method: 'GET',
					url,
					headers: { 'content-type': 'application/json' }
				}
				return axios(config)
					.then((res) => {
						const response = res.data && res.data.OHLC
						const newResponse = response.map((el: any) => {
							el.LASTTRADEDATE = new Date(el.LASTTRADETIME)
							el.INSTRUMENTIDENTIFIER = stock.IDENTIFIER
							el.TOTALQTYTRADED = el.TRADEDQTY
							el.EXCHANGE = 'NSE'
							return el
						})
						return newResponse
					})
					.catch((err) => {
						console.log(err)
						throw new Error(err)
						Sentry.captureException(err)
					})
			})
			return Promise.all(promise)
		}
	}
}
