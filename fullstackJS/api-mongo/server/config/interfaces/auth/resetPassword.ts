export interface resetPasswordParams {
    account: string,
    password: string,
    cf_password: string,
    reset_token?: string
}

export interface resetPasswordResponse {
    msg: string,
    status: number,
}