import express, { Application } from 'express'
import { AuthController } from './authController'
import {
    loginValidate
} from './validation'
import { createValidator } from 'express-joi-validation'

const authController = new AuthController()
export const authRouter = express.Router()
const validator = createValidator({
	passError: true
})
authRouter.post('/login', validator.body(loginValidate), authController.logIn as Application)