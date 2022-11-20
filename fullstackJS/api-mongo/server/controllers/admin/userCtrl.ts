import { IReqAuth } from '../../config/interfaces'
import bcrypt from 'bcrypt'

import userModel from '../../models/userModel'

import { Get, Route, Body, Patch, Request, Delete, SuccessResponse } from "tsoa"
import { getUsersResponse } from '../../config/interfaces/admin/getUsers'
import { getUserResponse, getUserParams } from '../../config/interfaces/admin/getUser'
import { deleteUserResponse, deleteUserParams } from '../../config/interfaces/admin/deleteUser'
import { updateUserResponse, updateUserParams } from '../../config/interfaces/admin/updateUser'


@Route("/api/admin/users")
export class userCtrl {
    @SuccessResponse("200", "Success ! here is the list of all users.")
    @Get("/")
    public async getUsers (): Promise<getUsersResponse> {
        try {
            const users = await userModel.find().select('-password')
            return {
                status:200,
                users
            }        
        } 
        catch (error: any) {
            return {
                msg: error.message,
                status: 500
            }
        }
    }
    @Get("/:userId")
    public async getUser (@Request() req: IReqAuth): Promise<getUserResponse> {
        try {
            const user = await userModel.findOne({
                _id: req.params.userId
            }).select('-password')
            return{
                status: 200,
                user
            }
        } catch (error: any) {
            return {
                msg: error.message,
                status: 500
            }
        }
    }
    @Delete("/:userId")
    public async deleteUser (@Body() body : deleteUserParams): Promise<deleteUserResponse> {
        try {
            await userModel.findOneAndDelete({
                _id: body.userId
            })
            return {
                msg: "User deleted !",
                status: 200
            }
        } catch (error: any) {
            return {
                msg: error.message,
                status: 500
            }
        }
    }
    @Patch("/:userId/edit")
    public async updateUser (@Body() body: updateUserParams, @Request() req: IReqAuth): Promise<updateUserResponse> {
        try {
            let { avatar, name, type, password, cf_password } = body
            
            if (typeof req.file === 'object') {
                avatar = process.env.BACK_HOST+":"+process.env.PORT+"/upload/"+req.file?.filename
            }

            if (type === 'Google') {
                const user = await userModel.findOneAndUpdate({_id: req.params.userId}, {$set:{
                    avatar,
                    type,
                    name
                }}, {new: true})
                return{
                    status: 200,
                    user
                }
            } else if (type === 'normal') {
                if (password === '') {
                    return {
                        msg: "Le mot de passe est vide !",
                        status: 500
                    }
                }

                if (password !== cf_password) {
                    return {
                        msg: "Error lors de la confirmation du mot de passe !",
                        status: 500
                    }
                }
                const passwordHash = await bcrypt.hash(password, 12)
                const user = await userModel.findOneAndUpdate({_id: req.params.userId}, {$set:{
                    avatar,
                    name,
                    type,
                    password: passwordHash
                }}, {new: true}).select('-password')
                return{
                    status: 200,
                    user
                }
            } else {
                return {
                    msg: "Error lors de la mise à jour de votre compte !",
                    status: 500
                }
            }
        } catch (error: any) {
            return {
                msg: error.message,
                status: 500
            }
        }
    }
}

export default userCtrl