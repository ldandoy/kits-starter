import Users from '../models/userModel'
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from 'path'

import { Post, Route, Body, Patch } from "tsoa"
import { updateUserResponse, updateUserParams } from '../config/interfaces/user/updateUser'
import { resetPasswordResponse, resetPasswordParams } from '../config/interfaces/user/resetPassword'
import { updateProfileImageResponse, updateProfileImageParams } from '../config/interfaces/user/updateProfileImage'


const storage = multer.diskStorage({
    destination: "./public/upload/",
    filename: function(req, file, cb) {
        cb(null, "IMAGE-"+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: {fileSize:1000000}
}).single('file')

@Route("/api/user")
export class userCtrl {
    @Patch("/me")
    public async updateUser (@Body() body :updateUserParams ): Promise<updateUserResponse> {
        if(!req.user) {
            return {
                msg: "Invalid Authentication.",
                status: 400
            }
        }
        try {
            const { avatar, name } = body

            await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, name
            })

            return{
                msg: "Update Success !",
                status: 200
            }
        } catch (err: any) {
            return {
                msg: err.message,
                status: 500
            }
        }
    }
    @Patch("/reset_password")
    public async resetPassword (@Body() body :resetPasswordParams ): Promise<resetPasswordResponse> {
        if(!req.user) {
            return{
                msg: "Invalid Authentication.",
                status: 400
            }
        }
    
        if(req.user.type !== 'normal')
            return {
                msg: `Quick login account with ${req.user.type} can't use this function.`,
                status: 400
            }

        try {
            const { password } = body
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({_id: req.user._id}, {
                password: passwordHash
            })

            return {
                msg: "Reset password success !",
                status: 200
            }
        } catch (err: any) {
            return {
                msg: err.message,
                status: 500
            }
        }
    }
    @Post("/reset_password")
    public async updateProfileImage (@Body() body :updateProfileImageParams ): Promise<updateProfileImageResponse> {
        if(!req.user) {
            return {
                msg: "Invalid Authentification.",
                status: 400
            }
        }

        try {
            await upload(req, res, (err) => {
                if (err) {
                    console.log(err)
                    return {
                        msg: err.code + ": " + err.message,
                        status: 500
                    }
                }

                return{
                    msg : "File uploaded!",
                    url: process.env.BACK_HOST+":"+process.env.PORT+"/upload/"+req.file?.filename
                }
            })
        } catch (err: any) {
            return {
                msg: err.message,
                status: 500
            }
        }
    }
}


export default userCtrl;