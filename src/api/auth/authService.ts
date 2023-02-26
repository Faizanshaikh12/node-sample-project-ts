import jwt from 'jsonwebtoken'
import { COMMON_CONSTANT, ENVIRONMENT } from '../../constants'
import { AuthHelpers } from '../../helper/auth.helpers'

export class AuthService {

	constructor() {}

	async login(body: any): Promise<any> {
		// hash password
		const AppSecurityCode = await AuthHelpers.hash(body.password)
		const AppUserID = body.username

		// return this.verifyUser(AppUserID, <string>AppSecurityCode)
	}

	generateJwtToken(AppAdminID: number, AdminLoginID: string): string {
		const timestamp = Date.now() / 1000
		const token = jwt.sign(
			{
				expiresIn: '30d',
				iat: timestamp,
				AppAdminID,
				AdminLoginID
			},
			COMMON_CONSTANT.JWT_SECRET
		)
		return token
	}


	public static verifyJwtToken = (token: string): any => {
		return jwt.verify(token, COMMON_CONSTANT.JWT_SECRET)
	}
}