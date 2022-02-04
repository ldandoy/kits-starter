import express, { Request, Response } from 'express'

import { authCtrl } from '../controllers/authCtrl'
import { validRegister } from '../middlewares/valid'

const Router = express.Router()
const ctrl = new authCtrl()

Router.post('/register', validRegister, async (req :Request, res :Response) => {
    const response = await ctrl.register(req.body)
    return res.status(response.status).json(response.msg)
})

Router.post('/login', async (req :Request, res :Response) => {
    const response = await ctrl.login(req.body)
    res.cookie('refreshtoken', response.refresh_token, {
        httpOnly: true,
        path: `/api/refresh_token`,
        maxAge: 30*24*60*60*1000
    })
    return res.status(response.status).json(response.msg)
})

Router.post('/active', async (req :Request, res :Response) => {
    const response = await ctrl.activeAccount(req.body)
    return res.status(response.status).json(response.msg)
})

Router.get('/logout',  async (req :Request, res :Response) => {
    ctrl.logout()
    res.clearCookie('refreshtoken', { path: `/api/refresh_token` })
    return res.status(200).json({msg: "Logout"})
})

Router.get('/refresh_token',  async (req :Request, res :Response) => {
    const rf_token = req.cookies.refreshtoken
    const response = await ctrl.refreshToken(rf_token)
    return res.status(response.status).json(response.msg)
})
Router.post('/google_login', async (req :Request, res :Response) => {
    const response = await ctrl.googleLogin(req.body)
    res.cookie('refreshtoken', response.refresh_token, {
                    httpOnly: true,
                    path: `/api/refresh_token`,
                    maxAge: 30*24*60*60*1000
                })
    return res.status(response.status).json(response.msg)
})

Router.post('/forgot_password', async (req :Request, res :Response) => {
    const response = await ctrl.forgot_password(req.body)
    return res.status(response.status).json(response.msg)
})

Router.post('/reset_password/:reset_token', async (req :Request, res :Response) => {
    const response = await ctrl.reset_password(req.body)
    return res.status(response.status).json(response.msg)
})

export default Router