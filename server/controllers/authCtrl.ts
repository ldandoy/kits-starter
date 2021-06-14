import { Request, Response } from 'express'
import userModel from '../models/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateActiveToken, generateAccessToken, generateRefreshToken } from '../config/generateToken'
import sendMail from '../config/sendMail'
import { validEmail } from '../middlewares/valid'

const authCtrl = {
    register: async(req: Request, res: Response) => {
        try {
            const { name, account, password } = req.body
            const user = userModel.findOne({account})
            
            if(!user) return res.status(400).json({msg: 'Email or Phone number already exists.'})

            const passwordhash = await bcrypt.hash(password, 12)

            const newUser = { name, account, password: passwordhash }

            const active_token = generateActiveToken(newUser)

            const url = `${process.env.BASE_URL}/active/${active_token}`

            if (validEmail(account)) {
                // sendMail(account, "Active your account", url)
            
                res.json({ msg: 'Bravo ! Activez votre compte en cliquant sur le lien qui est dans le mail que vous avez reçu.' })
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    login: async(req: Request, res: Response) => {
        try {
            const { account, password } = req.body
            const user = userModel.findOne({account})

            if(!user) return res.status(400).json({msg: "Ce compte n'existe pas."})

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) return res.status(400).json({msg: "Mot de passe incorrecte."})

            const access_token = generateAccessToken({ id: user._id })
            const refresh_token = generateRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: `/api/refresh_token`,
                maxAge: 30*24*60*60*1000
            })

            res.json({
                msg: "Login Success!",
                access_token,
                user
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
}

export default authCtrl