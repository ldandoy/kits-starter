import express, { Request, Response } from 'express'
import auth from '../middlewares/auth'
import userCtrl from '../controllers/userCtrl'

const Router = express.Router()
const ctrl = new userCtrl()

Router.patch('/me', auth, async (req :Request, res :Response) => {
    const response = await ctrl.updateUser(req.body)
    return res.status(response.status).json(response.msg)
})

Router.patch('/reset_password', auth, async (req :Request, res :Response) => {
    const response = await ctrl.resetPassword(req.body)
    return res.status(response.status).json(response.msg)
})
Router.post('/update_profile_image', auth, async (req :Request, res :Response) => {
    const response = await ctrl.updateProfileImage(req.body)
    return res.status(response.status).json(response.msg)
})

export default Router