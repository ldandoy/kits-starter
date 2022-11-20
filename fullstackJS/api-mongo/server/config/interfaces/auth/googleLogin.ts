export interface googleLoginResponse {
    msg: string
    status: number,
    access_token?: string,
    refresh_token?: string,
    user?: any,
    name?: string
}

export interface googleLoginParams {
    id_token: string,
    name: string
}