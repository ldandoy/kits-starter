import express, { Request, Response } from 'express'

import AuthCtrl from '../controllers/AuthCtrl'
import { validRegister } from '../middlewares/valid'

const Router = express.Router()
const authCtrl = new AuthCtrl()

Router.post('/register', validRegister, async (request :Request, response :Response) => {
    const registerReturn = await authCtrl.register(request.body)
    
    return response.status(registerReturn.status).json(registerReturn.msg)
})

Router.post('/login', async (request :Request, response :Response) => {
    const loginReturn = await authCtrl.login(request.body)
    
    response.cookie('refreshtoken', loginReturn.refresh_token, {
        httpOnly: true,
        path: `/api/auth/refresh_token`,
        maxAge: 30*24*60*60*1000
    })

    return response.status(loginReturn.status).json({
        user: loginReturn?.user,
        acces_token: loginReturn?.access_token
    })
})

Router.post('/active', async (req :Request, res :Response) => {
    const response = await authCtrl.activeAccount(req.body)
    return res.status(response.status).json(response.msg)
})

Router.get('/logout',  async (req :Request, res :Response) => {
    authCtrl.logout()
    res.clearCookie('refreshtoken', { path: `/api/auth/refresh_token` })
    return res.status(200).json({msg: "Logout"})
})

Router.get('/refresh_token',  async (req :Request, res :Response) => {
    const response = await authCtrl.refreshToken(req)
    
    if (response.status === 500) {
        return res.status(response.status).json({
            msg: response.msg
        })
    } else {
        return res.status(response.status).json({
            msg: response.msg,
            access_token: response.access_token,
            user: response.user
        })
    }
})

Router.post('/google_login', async (req :Request, res :Response) => {
    const response = await authCtrl.googleLogin(req.body)
    res.cookie('refreshtoken', response.refresh_token, {
        httpOnly: true,
        path: `/api/auth/refresh_token`,
        maxAge: 30*24*60*60*1000
    })
    return res.status(response.status).json(response.msg)
})

Router.post('/forgot_password', async (req :Request, res :Response) => {
    const response = await authCtrl.forgot_password(req.body)
    return res.status(response.status).json(response.msg)
})

Router.post('/reset_password/:reset_token', async (req :Request, res :Response) => {
    const response = await authCtrl.reset_password(req.body)
    return res.status(response.status).json(response.msg)
})

export default Router