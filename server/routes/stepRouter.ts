import express from 'express'
import auth from '../middlewares/auth'
import stepCtrl from '../controllers/stepCtrl'

const Router = express.Router()

Router.get('/get-last-step', auth, stepCtrl.getLastStep)

export default Router