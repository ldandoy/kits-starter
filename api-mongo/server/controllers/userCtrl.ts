import { Response } from 'express'
import Users from '../models/userModel'
import bcrypt from 'bcrypt'
import { IReqAuth } from '../config/interfaces'

import { Post, Route, Body, Patch, Request } from "tsoa"
import { updateUserResponse, updateUserParams } from '../config/interfaces/user/updateUser'
import { resetPasswordResponse, resetPasswordParams } from '../config/interfaces/user/resetPassword'


@Route("/api/user")
export class userCtrl {
    @Patch("/me")
    public async updateUser (@Body() body: updateUserParams, @Request() req: IReqAuth ): Promise<updateUserResponse> {
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
    public async resetPassword (@Body() body: resetPasswordParams, @Request() req: IReqAuth ): Promise<resetPasswordResponse> {
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
}


export default userCtrl;