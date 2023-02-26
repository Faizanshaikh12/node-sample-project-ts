import Joi from 'joi'

export const commonValidate = {
	objCommon: Joi.object({
		insertUserId: Joi.number().required(),
		insertIpAddress: Joi.string().required(),
	}).required(),
}

export const verifyOTPValidate = Joi.object({
	key: Joi.string().required(),
	otp: Joi.string().required(),
	userId: Joi.number().required(),
})

export const sendOTPValidate = Joi.object({
	userId: Joi.number().required(),
})

export const loginValidate = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
})

export const registerValidate = Joi.object({
	userName: Joi.string().required(),
	displayName: Joi.string().required(),
	mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
	password: Joi.string().required(),
	email: Joi.string().email().allow(''),
	accessTypeId: Joi.number().required(),
	...commonValidate
})

export const updateUserStatusValidate = Joi.object({
	userId: Joi.number().required(),
	...commonValidate
})

export const updateAdminStatusValidate = Joi.object({
	adminId: Joi.number().required(),
	status: Joi.number().required(),
	...commonValidate
})