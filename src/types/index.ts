import { Multer } from 'multer'
import { Request } from 'express'
import { IUserType } from '../api/auth/interface'

export interface IAxiosConfig {
	method: string,
	url: string,
	headers: any,
	data?: any,
	params?: any
}

export interface FileWithRequest extends Request {
	file: ReqFileType
}

export interface UserRequest extends Request {
	user: IUserType
}

export type ReqFileType = Express.Multer.File;