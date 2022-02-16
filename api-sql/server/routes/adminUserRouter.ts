import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'


import authAdmin from '../middlewares/auth'
import adminUserCtrl from '../controllers/admin/userCtrl'

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

const Router = express.Router()
const ctrl = new adminUserCtrl()

Router.get('/'/*, authAdmin*/, async ( req: Request, res :Response) => {
    const response = await ctrl.getUsers()
    return res.status(response.status).json(response.msg)
})

Router.get('/:userId', authAdmin, async ( req: Request, res :Response) => {
    const response = await ctrl.getUser(req.body)
    return res.status(response.status).json(response.msg)
})

Router.delete('/:userId', authAdmin, async ( req: Request, res :Response) => {
    const response = await ctrl.deleteUser(req.body)
    return res.status(response.status).json(response.msg)
})

Router.patch('/:userId/edit', authAdmin, upload.single('avatar'),  async ( req: Request, res :Response) => {
    const response = await ctrl.updateUser(req.body, req)
    return res.status(response.status).json(response.msg)
})
export default Router