import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'

import auth from '../middlewares/auth'
import userCtrl from '../controllers/userCtrl'


const Router = express.Router()
const ctrl = new userCtrl()

const storage = multer.diskStorage({
    destination: "./public/upload/",
    filename: function(req, file, cb) {
        cb(null, "IMAGE-"+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: {fileSize:1000000}
})

Router.patch('/me', auth, upload.single('avatar') , async (req :Request, res :Response) => {   
    const response = await ctrl.updateUser(req.body, req)
    return res.status(response.status).json({msg: response.msg})
})

Router.patch('/reset_password', auth, async (req :Request, res :Response) => {
    const response = await ctrl.resetPassword(req.body, req)
    return res.status(response.status).json({msg: response.msg})
})

export default Router