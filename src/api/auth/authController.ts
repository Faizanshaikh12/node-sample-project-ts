import { AuthService } from './authService'
import { Request, Response } from 'express'
import { MESSAGE } from '../../constants/messages'
import { jsonErrorHandler } from '../../helper/errorHandler'

export class AuthController {
	private readonly authService: AuthService

	constructor() {
		this.authService = new AuthService()
	}

	logIn = async (req: Request, res: Response) => {
		try {
			const user = await this.authService.login(req.body)

			return res.status(200).send({
				data: {
					user,
				}, code: 200, message: MESSAGE.OTP_SEND
			})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {
			})
		}
	}
}
