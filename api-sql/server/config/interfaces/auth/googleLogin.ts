import { INewUser, IUser } from "../../interfaces";

export interface googleLoginResponse {
    id?: number,
    msg: string
    status: number,
    access_token?: string,
    refresh_token?: string,
    name?: string,
    user?: INewUser
}

export interface googleLoginParams {
    id_token: string,
    name: string
}