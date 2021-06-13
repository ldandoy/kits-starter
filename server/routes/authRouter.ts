import express from 'express'
import authCtrl from '../controllers/authCtrl'
import { validRegister } from '../middlewares/valid'

const Router = express.Router()

Router.post('/register', validRegister, authCtrl.register)

export default Router