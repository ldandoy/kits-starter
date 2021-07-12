import express from 'express'
import auth from '../middlewares/auth'
import userCtrl from '../controllers/userCtrl'

const Router = express.Router()

Router.patch('/user', auth, userCtrl.updateUser)

export default Router