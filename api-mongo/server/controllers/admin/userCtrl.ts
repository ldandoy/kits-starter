import { Response } from 'express'
import { IReqAuth } from '../../config/interfaces'
import bcrypt from 'bcrypt'

import userModel from '../../models/userModel'

import { Post, Get, Route, Body, Path } from "tsoa"
import { getUsersResponse, getUsersParams } from '../config/interfaces/admin/getUsers'
import { Response, Params } from '../config/interfaces/admin/'
import { Response, Params } from '../config/interfaces/admin/'
import { Response, Params } from '../config/interfaces/admin/'


@Route("/api/admin/user")
export class userCtrl {
    @Get("/users")
    public async logout (): Promise<logoutResponse> {
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
    getUser: async (req: IReqAuth, res: Response) => {
        try {
            const user = await userModel.findOne({
                _id: req.params.userId
            }).select('-password')
            res.status(200).json(user)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteUser: async (req: IReqAuth, res: Response) => {
        try {
            await userModel.findOneAndDelete({
                _id: req.params.userId
            })
            res.status(200).json({msg: "User deleted !"})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateUser: async (req: IReqAuth, res: Response) => {
        try {
            let { avatar, name, type, password, cf_password } = req.body
            
            if (typeof req.file === 'object') {
                avatar = process.env.BACK_HOST+":"+process.env.PORT+"/upload/"+req.file?.filename
            }

            if (type === 'Google') {
                const user = await userModel.findOneAndUpdate({_id: req.params.userId}, {$set:{
                    avatar,
                    type,
                    name
                }}, {new: true})
                res.json(user)
            } else if (type === 'normal') {
                if (password === '') {
                    return res.status(500).json({msg: "Le mot de passe est vide !"})    
                }

                if (password !== cf_password) {
                    return res.status(500).json({msg: "Error lors de la confirmation du mot de passe !"})    
                }
                const passwordHash = await bcrypt.hash(password, 12)
                const user = await userModel.findOneAndUpdate({_id: req.params.userId}, {$set:{
                    avatar,
                    name,
                    type,
                    password: passwordHash
                }}, {new: true}).select('-password')
                res.json(user)
            } else {
                return res.status(500).json({msg: "Error lors de la mise à jour de votre compte !"})    
            }
        } catch (err: any) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
}

export default userCtrl