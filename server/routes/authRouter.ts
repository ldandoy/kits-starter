import express from 'express'
import authCtrl from '../controllers/authCtrl'
import { validRegister } from '../middlewares/valid'

const Router = express.Router()

Router.post('/register', validRegister, authCtrl.register)

Router.post('/active', authCtrl.activeAccount)

Router.post('/login', authCtrl.login)

Router.get('/logout', authCtrl.logout)

Router.get('/refresh_token', authCtrl.refreshToken)

export default Router