export interface IGgPayload {
    email: string
    email_verified: boolean
    name: string
    picture: string
}

export interface googleLoginResponse {
    id?: number,
    msg: string
    status: number,
    access_token?: string,
    refresh_token?: string,
    name?: string,
    user?: any
}

export interface googleLoginParams {
    id_token: string,
    name: string
}