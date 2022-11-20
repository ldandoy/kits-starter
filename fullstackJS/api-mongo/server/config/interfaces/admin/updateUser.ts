export interface updateUserParams {
    avatar: string,
    name: string,
    type: string,
    password: string, 
    cf_password: string
}

export interface updateUserResponse {
    msg?: string,
    status: number,
    user?: any
}
