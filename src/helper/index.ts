import multer from 'multer'

const storage = multer.memoryStorage()

const whitelist = [
	'image/png',
	'image/jpeg',
	'image/jpg',
	'image/svg+xml',
	'application/json'
]
export const uploadToMulter = (fileSize: number) => {
	return multer({
		storage,
		limits: { fileSize },
		fileFilter: (req, file, cb) => {
			if (!whitelist.includes(file.mimetype)) {
				return cb(new Error('file is not allowed'))
			}

			cb(null, true)
		}
	})
}