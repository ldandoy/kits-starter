import { INewUser } from "../../interfaces";

export interface googleLoginResponse {
    id?: number,
    msg: string
    status: number,
    access_token?: string,
    refresh_token?: string,
    name?: string,
}

export interface googleLoginParams {
    id_token: string,
    name: string
}