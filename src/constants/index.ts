export const COMMON_CONSTANT: any = {
	PORT: process.env.PORT || 3000,
	MVF_FROM: process.env.MVF_FROM,
	MVF_TEMP_ID: process.env.MVF_TEMP_ID || 'j/R+gfk/2NC',
	GLOBAL_FEED_API_KEY: process.env.GLOBAL_FEED_API_KEY,
	CRYPTO_API_KEY: process.env.CRYPTO_API_KEY,
	TWELVE_API_KEY: process.env.TWELVE_API_KEY,
	WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
	NODE_ENV: process.env.NODE_ENV,
	JWT_SECRET: process.env.JWT_SECRET,
	SMS_OTP_EXPIRY_TIME: Number(process.env.SMS_OTP_EXPIRY_TIME),
	AUTH_TOKEN_EXPIRY_TIME: 60 * 60 * 24 * 30,
	IMAGE_FILE_SIZE: 1024 * 1024 * 10,
}

export const ENVIRONMENT = {
	PROD: 'production',
	DEV: 'development',
}

export const OTP_PROVIDER = {
	VFIRST: 'VFIRST',
}

export const STOCK_EXCHANGE = {
	NSE: 'NSE',
	MCX: 'MCX',
	NSE_IDX: 'NSE_IDX',
	CDS: 'CDS',
	CRYPTO: 'CRYPTO',
	FOREX: 'FOREX',
	NASDAQ: 'NASDAQ',
	NYSE: 'NYSE',
	BSE: 'BSE',
}

export const STOCK_EXCHANGE_PROVIDER = {
	GDFEED: 'GDFEED',
	CMCAP: 'CMCAP',
	TWELVEDATA: 'TWELVEDATA',
}

export const MONGO_DB: any = {
	MONGO_DB_USER: process.env.MONGO_DB_USER,
	MONGO_DB_PASS: process.env.MONGO_DB_PASS,
	MONGO_DB_URL: process.env.MONGO_DB_URL,
	MONGO_DB_PORT: process.env.MONGO_DB_PORT,
	MONGO_DB_NAME: process.env.MONGO_DB_NAME,
	MONGO_DB_LOCAL: process.env.MONGO_DB_LOCAL,
}

export const GLOBAL_FEED = {
	STOCK_DETAIL: `http://nimblerest.lisuns.com:4531/GetLastQuoteArray/?accessKey=${COMMON_CONSTANT.GLOBAL_FEED_API_KEY}&isShortIdentifiers=true`,
	STOCK_LIST: `http://nimblerest.lisuns.com:4531/GetInstruments/?accessKey=${COMMON_CONSTANT.GLOBAL_FEED_API_KEY}&exchange=NSE&isShortIdentifiers=true`,
	STOCK_HISTORY: `http://nimblerest.lisuns.com:4531/GetHistory/?accessKey=${COMMON_CONSTANT.GLOBAL_FEED_API_KEY}&exchange=NSE&periodicity=MINUTE`,
	CRYPTO_DETAIL: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?convert=USD&aux=num_market_pairs`,
	TWELVE_QUOTE: `https://api.twelvedata.com/quote?apikey=${COMMON_CONSTANT.TWELVE_API_KEY}`,
}

export const RDS_DB: any = {
	RDS_HOST: process.env.RDS_HOST,
	RDS_PORT: process.env.RDS_PORT,
	RDS_PORT_LOCAL: process.env.RDS_PORT_LOCAL,
}

export const AWS_S3 = {
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
	AWS_REGION: process.env.AWS_REGION,
	AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
	AWS_S3_URL: process.env.AWS_S3_URL,
}

export const AWS_SES: any = {
	AWS_SES_ACCESS_KEY_ID: process.env.AWS_SES_ACCESS_KEY_ID,
	AWS_SES_SECRET_ACCESS_KEY: process.env.AWS_SES_SECRET_ACCESS_KEY,
	AWS_SES_REGION: process.env.AWS_SES_REGION,
	AWS_SES_FROM: process.env.AWS_SES_FROM,
}

export const SQL_DB: any = {
	DB_NAME: process.env.DB_NAME,
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_HOSTNAME: process.env.DB_HOSTNAME,
	DB_PORT: process.env.DB_PORT,
}

export const NotificationStatus = {
	PENDING: 'PENDING',
	COMPLETED: 'COMPLETED',
	CANCELED: 'CANCELED'
}

export const NotificationScheduleStatus = {
	NOW: 'NOW',
	LATER: 'LATER',
}

export const COMMON_STOCK_OBJ = {
	AVERAGETRADEDPRICE: 0,
	BUYPRICE: 0,
	BUYQTY: 0,
	CLOSE: 0,
	EXCHANGE: '',
	HIGH: 0,
	INSTRUMENTIDENTIFIER: '',
	LASTTRADEPRICE: 0,
	LASTTRADEQTY: 0,
	LASTTRADETIME: 0,
	LASTTRADEDATE: new Date(),
	LOW: 0,
	OPEN: 0,
	OPENINTEREST: 0,
	PREOPEN: 0,
	QUOTATIONLOT: 0,
	SELLPRICE: 0,
	SELLQTY: 0,
	SERVERTIME: 0,
	TOTALQTYTRADED: 0,
	VALUE: 0,
	PRICECHANGE: 0,
	PRICECHANGEPERCENTAGE: 0,
	OPENINTERESTCHANGE: 0,
	CURRENCY: 'INR',
	PROVIDER: '',
	FIFTYTWOWEEKHIGH: 0,
	FIFTYTWOWEEKLOW: 0
}

export const SCRAPING_STOCK_API = [
	{
		id: 'India',
		param: 's-p-cnx-nifty-components'
	},
	{
		id: 'Usa',
		param: 'investing.com-united-states-30-components'
	},
	{
		id: 'Germany',
		param: 'germany-30-components'
	},
	{
		id: 'HongKong',
		param: 'hang-sen-40-components'
	},
	{
		id: 'Japan',
		param: 'japan-ni225-components'
	},
	{
		id: 'China',
		param: 'ftse-china-a50-components'
	},
	{
		id: 'Australia',
		param: 'sp-asx-all-technology-components'
	},
	{
		id: 'Uk',
		param: 'investing.com-uk-100-components'
	},
	{
		id: 'France',
		param: 'france-40-components'
	},
	{
		id: 'Italy',
		param: 'investing.com-italy-40-components'
	}
]