export type IVerifyRequestBody = {
	Key: string
	Otp: string
	UserMobileNo: string
}

export type IUserType = {
	AppAdminID: number
	AdminLoginID: string
	MobileNo?: string
}

export interface ISendOtpResponse {
	otp: string;
	key: string;
}
