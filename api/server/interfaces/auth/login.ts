import { User } from '../models/user'

export interface loginParams {
    account: string,
    password: string,
}

export interface loginResponse {
    msg: string,
    status: number,
    access_token?: string,
    refresh_token?: string
    user?: any
}