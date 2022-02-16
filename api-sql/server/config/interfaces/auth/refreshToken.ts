import { IUser } from "../../interfaces";

export interface refreshTokenResponse {
    msg?: string,
    status: number,
    access_token?: string,
    user?: IUser
}