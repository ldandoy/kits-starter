import express from 'express'
import authCtrl from '../controllers/authCtrl'
import { validRegister } from '../middlewares/valid'

const Router = express.Router()

Router.post('/register', validRegister, authCtrl.register)

Router.post('/login', authCtrl.login)

export default Router