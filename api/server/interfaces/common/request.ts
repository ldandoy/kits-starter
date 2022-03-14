import { Request } from 'express'

export interface IReqAuth extends Request {
    user?: any
}