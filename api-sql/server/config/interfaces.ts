import { Request } from 'express'
import { Model } from 'sequelize';

export interface IUser extends Model {
    id?: number,
    name: string,
    account: string,
    password: string,
    avatar?: string,
    role: string,
    type: string,
    reset_token: string
}

export interface INewUser {
    id?: number,
    name: string,
    account: string,
    password: string,

}

export interface IDecodedToken {
    id?: string
    newUser?: INewUser
    iat: number
    exp:number
}

export interface IGgPayload {
    email: string
    email_verified: boolean
    name: string
    picture: string
}

export interface IReqAuth extends Request {
    user?: IUser
}