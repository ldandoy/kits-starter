import { Response } from 'express'
import Users from '../models/userModel'
import bcrypt from 'bcrypt'
import { IReqAuth } from '../interfaces/common/request'

import { Route, Body, Patch, Request } from "tsoa"
import { updateUserResponse, updateUserParams } from '../interfaces/user/updateUser'
import { resetPasswordResponse, resetPasswordParams } from '../interfaces/user/resetPassword'


@Route("/api/user")
export class userCtrl {
    @Patch("/me")
    public async updateUser (@Body() body: updateUserParams, @Request() req: IReqAuth ): Promise<updateUserResponse> {
        try {
            if (!req.user) {
                return {
                    msg: "Invalid Authentication.",
                    status: 400
                }
            }
        
            const { avatar, name } = body

            await Users.update({
                avatar, name
            }, {
                where: {
                    id: req.user.id
                }
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
        try {
            if(!req.user) {
                return{
                    msg: "Invalid Authentication.",
                    status: 400
                }
            }
        
            if(req.user.type !== 'normal') {
                return {
                    msg: `Quick login account with ${req.user.type} can't use this function.`,
                    status: 400
                }
            }

            const { password } = body
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.update({
                password: passwordHash
            }, {
                where: {
                    id: req.user.id
                }
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