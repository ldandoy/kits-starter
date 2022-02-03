import express, { Request, Response } from 'express'

import { authCtrl } from '../controllers/authCtrl'
import { validRegister } from '../middlewares/valid'

const Router = express.Router()
const ctrl = new authCtrl()

Router.post('/register', validRegister, async (req :Request, res :Response) => {
    const response = await ctrl.register(req.body)
    return res.status(response.status).json(response.msg)
})

/*Router.post('/active', authCtrl.activeAccount)

Router.post('/login', authCtrl.login)

Router.get('/logout', authCtrl.logout)

Router.get('/refresh_token', authCtrl.refreshToken)

Router.post('/google_login', authCtrl.googleLogin)

Router.post('/forgot_password', authCtrl.forgot_password)

Router.post('/reset_password/:reset_token', authCtrl.reset_password)*/

export default Router