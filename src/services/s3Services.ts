import AWS from 'aws-sdk'
import { Express } from 'express'
import { AWS_S3 } from '../constants'
import * as _ from 'lodash'
import { IGetAllFilesResponse, ReqFileType } from '../types'

AWS.config.update({
	accessKeyId: AWS_S3.AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_S3.AWS_SECRET_ACCESS_KEY,
	region: AWS_S3.AWS_REGION
})

const s3 = new AWS.S3()

class s3Service {
	static S3 = new AWS.S3()

	public uploadFileS3(file: ReqFileType, uploadPath: string): Promise<AWS.S3.ManagedUpload.SendData> {
		return new Promise((resolve, reject) => {
			s3.upload(
				{
					Body: file.buffer,
					Key: uploadPath || '/uploads/' + Date.now() + '_' + file.originalname,
					ContentType: file.mimetype,
					Bucket: AWS_S3.AWS_S3_BUCKET_NAME || ''
				},
				(error: any, data: any) => {
					if (error) reject(error)
					resolve(data)
				}
			)
		})
	}

	deleteFile(objects: any) {
		const options = {
			Bucket: AWS_S3.AWS_S3_BUCKET_NAME || '',
			Delete: {
				Objects: objects,
				Quiet: false
			}
		}

		return new Promise((resolve, reject) => {
			s3.deleteObjects(options, (err, data) => {
				if (err) reject(err)
				resolve(data)
			})
		})
	}

	public getFileUrl(key: string) {
		return new Promise((resolve, reject) => {
			s3.getSignedUrl(
				'getObject',
				{
					Key: key,
					Bucket: AWS_S3.AWS_S3_BUCKET_NAME || '',
					Expires: 60 * 60 * 5
				},
				(error, data) => {
					if (error) resolve({})
					resolve(
						this.getFileObject(key).then((results: any) => {
							if (_.isEmpty(results)) {
								return ({ url: '', key, contentType: '' })
							} else {
								const contentType = results.ContentType ? results.ContentType.split('/', 2)[1] : ''
								return ({ url: data, key, contentType })
							}
						})
					)
				}
			)
		})
	}

	getAllFiles(folderName: string): Promise<IGetAllFilesResponse[]> {
		const options = {
			Bucket: AWS_S3.AWS_S3_BUCKET_NAME || '',
			Prefix: `uploads/${folderName}`
		}

		return new Promise((resolve, reject) => {
			s3.listObjectsV2(options, (err, data) => {
				if (err) reject(err)
				if (data.Contents && data.Contents.length !== 0) {
					const promises: any = data.Contents.map((obj: any) => {
						return this.getFileUrl(obj.Key)
					})
					resolve(Promise.all(promises))
				} else {
					resolve([])
				}
			})
		})
	}

	getAllFilesRemove(folderName: string): Promise<IGetAllFilesResponse[]> {
		const options = {
			Bucket: AWS_S3.AWS_S3_BUCKET_NAME || '',
			Prefix: `uploads/${folderName}`
		}

		return new Promise((resolve, reject) => {
			s3.listObjectsV2(options, (err, data) => {
				if (err) reject(err)
				if (data.Contents && data.Contents.length !== 0) {
					const promises = data.Contents.map((obj: any) => {
						return obj.Key
					})
					resolve(promises)
				} else {
					resolve([])
				}
			})
		})
	}


	getFileObject(key: string): Promise<AWS.S3.Object> {
		const options = {
			Bucket: AWS_S3.AWS_S3_BUCKET_NAME || '',
			Key: key
		}

		return new Promise((resolve, reject) => {
			s3.getObject(options, (err: Error, data: any) => {
				if (err) resolve({})
				resolve(data)
			})
		})
	}

	getImageUrls(response: any) {
		const imageKeysSet = Array.from(new Set(response))
		const imageUrls: any = imageKeysSet.map((k: any) => {
			return this.getFileUrl(k).then((result: any) => {
				return result
			})
		})
		return Promise.all(imageUrls)
	}
}

export default s3Service
