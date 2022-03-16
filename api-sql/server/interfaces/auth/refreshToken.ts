import express from 'express'

export interface refreshTokenResponse {
    msg?: string,
    status: number,
    access_token?: string,
    user?: any
}

export interface refreshTokenRequest extends express.Request { }