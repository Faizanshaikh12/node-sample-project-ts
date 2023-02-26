import Express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { sequelize } from './database'
import { mongoDbConnection } from './mongo-db'
import * as Sentry from '@sentry/node'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'
import { authRouter } from './api/auth/authRouter'
import * as path from 'path'
import { joiErrorHandler, jsonErrorHandler, SBError } from './helper/errorHandler'
import { AWS_S3 } from './constants'
import { authMiddleware } from './api/middleware/authMiddleware'
import { s3Proxy } from './helper/s3-proxy'
import { userHistoryRouter } from './api/history/userHistoryRouter'
import { gameRoomMasterRouter } from './api/game-room-master/gameRoomMasterRouter'
import { bankMasterRouter } from './api/bank-master/bankMasterRouter'
import { gameMasterRouter } from './api/game-master/gameMasterRouter'
import { stocksRouter } from './api/stocks/stocksRouter'
import { holidayMasterRouter } from './api/holiday-master/holidayMasterRouter'
import { gameScriptRouter } from './api/game-script/gameScriptRouter'
import { gamePrizeDistributionRouter } from './api/game-prize-distribution/gamePrizeDistributionRouter'
import { kycRouter } from './api/kyc/kycRouter'
import { transactionRouter } from './api/transaction/transactionRouter'
import { masterDataBindingRouter } from './api/master-data-binding/masterDataBindingRouter'
import { quizRouter } from './api/quiz/quizRouter'
import { notificationCenterRouter } from './api/notification-center/notificationCenterRouter'
import { dashboardRouter } from './api/dashboard/dashboardRouter'
import { bannerRouter } from './api/banner/bannerRouter'
import cron from 'node-cron'
import { smsTokenScheduler, stockScheduler } from './cron/scheduler'
import { closeGameScheduler, startGameScheduler } from './cron/gameScheduler'
import { settingRouter } from './api/setting/settingRouter'

const options = {
	swaggerOptions: {
		filter: true,
		defaultModelsExpandDepth: -1
	}
};

(async function main(): Promise<void> {
	const app = Express()


	app.use(cors())
	// CORS error fix
	app.use((req: Request, res: Response, next: NextFunction) => {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PATCH, PUT, DELETE'
		)
		res.setHeader(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization'
		)
		if (req.method === 'OPTIONS') {
			return res.sendStatus(200)
		}
		return next()
	})

	app.use(bodyParser.json())

	const router = Express.Router()
	app.use(
		'/v2/api-docs',
		swaggerUi.serve,
		swaggerUi.setup(swaggerDocument, options)
	)


	app.use('/api/v2', router)
	app.use('/api/v2/admin', router)
	router.use('/auth', authRouter)
	router.use('/game-room', gameRoomMasterRouter)
	router.use('/game', gameMasterRouter)
	router.use('/prize-distribution', gamePrizeDistributionRouter)
	router.use('/script', gameScriptRouter)
	router.use('/banks', bankMasterRouter)
	router.use('/holiday-master', holidayMasterRouter)
	router.use('/quiz', quizRouter)
	router.use('/history', userHistoryRouter)
	router.use('/master-data', masterDataBindingRouter)
	router.use('/kyc', kycRouter)
	router.use('/stock', stocksRouter)
	router.use('/transaction', transactionRouter)
	router.use('/notification', notificationCenterRouter)
	router.use('/dashboard', dashboardRouter)
	router.use('/banner', bannerRouter)
	router.use('/setting', settingRouter)


	// get image
	app.get('/uploads/*', authMiddleware, s3Proxy({
		bucket: AWS_S3.AWS_S3_BUCKET_NAME,
		accessKeyId: AWS_S3.AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_S3.AWS_SECRET_ACCESS_KEY
	}))

	app.use('*', (req, res) => {
		res.sendFile(path.join(process.cwd() + '/build/src/view/index.html'))
	})

	Sentry.init({
		dsn: 'https://adc7f7689e624459bd15d8d7efcb6b74@o4504015534817280.ingest.sentry.io/4504016242999296',
		release: `SherbazaarVega-${process.env.NODE_ENV}@1.0.0`,
		tracesSampleRate: 1.0
	})

	app.use((err: any, req: Request, res: Response, next: NextFunction) => {
		const error = err
		if (error.message?.toLowerCase() === 'no data found') {
			error.httpStatusCode = 404
		} else if (error?.errorCode) {
			error.httpStatusCode = +error?.errorCode
		} else if (err && err.error && err.error.isJoi) {
			const errors = joiErrorHandler(err.error)
			error.httpStatusCode = 412
			error.message = errors[0].message
		} else {
			error.errorCode = '500'
			error.httpStatusCode = 500
		}

		return jsonErrorHandler(err, req, res, () => {
		})
	})

	// mongo db connection
	mongoDbConnection()

	app.listen(process.env.PORT, () => {
		console.log(`Server running at port http://localhost:${process.env.PORT}`)
		console.log(
			`Swagger Docs http://localhost:${process.env.PORT}/v2/api-docs`
		)
	})

	try {
		await sequelize.authenticate()
		console.log('Database connection has been established successfully.')
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
	const NODE_APP_INSTANCE: any = process.env.NODE_APP_INSTANCE
	if (+NODE_APP_INSTANCE === 0) {

		// Stock cron job
		const stockCronJob = cron.schedule('*/5 * * * *', stockScheduler, { scheduled: false })
		stockCronJob.start()

		// SMS cron job
		const smsTokenCronJob = cron.schedule('0 0 * * *', smsTokenScheduler, { scheduled: false })
		smsTokenCronJob.start()

		// Start Game Update Stock Price
		const startGameUpdateStockPrice = cron.schedule('*/15 * * * *', startGameScheduler, { scheduled: false })
		startGameUpdateStockPrice.start()

		// End Game Update Stock Price
		const closeGameUpdateStockPrice = cron.schedule('*/15 * * * *', closeGameScheduler, { scheduled: false })
		closeGameUpdateStockPrice.start()
	}

})().catch(err => {
	console.log('Error starting application $s', err.message)
	process.exit(1)
})
