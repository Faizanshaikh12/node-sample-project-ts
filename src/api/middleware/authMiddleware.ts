import { IUserType } from '../auth/interface'
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { RedisClientService } from '../../services/redisService'

export interface IAuthenticatedRequest extends Request {
	user?: IUserType
}

export const authMiddleware = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // const Avparmas = req.params as any
    //
    // if (!_.isEmpty(Avparmas) && Avparmas[0].split('/', 1)[0] === 'avatar') {
    //   return next()
    // }
    let token = req.headers.authorization as string

    if (token) {
      // if (token.startsWith('Bearer ')) {
      //   const splitToken = token.split(' ')
      //   token = `SB ${splitToken[1]}`
      // } else {
      //   token = `SB ${token}`
      // }
      //
      // const clientObj = new RedisClientService()
      // const userData = await clientObj.get(token)
      // if (userData && !_.isEmpty(JSON.parse(userData))) {
      //   const user = JSON.parse(userData)
      //   req.user = {}
      //   return next()
      // } else {
      //   res.status(401).send({ message: 'Unauthorized', status: 401 })
      // }
    } else {
      return res.status(401).send({ message: 'Please Login', status: 401 })
    }
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized', status: 401 })
  }
}
