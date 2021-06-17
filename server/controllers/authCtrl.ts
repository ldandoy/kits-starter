import { Request, Response } from 'express'
import userModel from '../models/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateActiveToken, generateAccessToken, generateRefreshToken } from '../config/generateToken'
import sendMail from '../config/sendMail'
import sendSms from '../config/sendSMS'
import { validEmail, validPhone } from '../middlewares/valid'
import { IDecodedToken } from '../config/interfaces'

const authCtrl = {
    register: async (req: Request, res: Response) => {
        try {
            const { name, account, password } = req.body
            const user = userModel.findOne({account})
            
            if(!user) return res.status(400).json({msg: 'Email or Phone number already exists.'})

            const passwordhash = await bcrypt.hash(password, 12)

            const newUser = { name, account, password: passwordhash }

            const active_token = generateActiveToken({newUser})

            const url = `${process.env.BASE_URL}/active/${active_token}`

            if (validEmail(account)) {
                if (process.env.SEND) {
                    sendMail(account, "Active your account", url)
                }
            
                return res.json({ 
                    msg: 'Bravo ! Activez votre compte en cliquant sur le lien qui est dans le mail que vous avez reçu.',
                    active_token
                })
            } else if (validPhone(account)) {
                if (process.env.SEND) {
                    sendSms(account, url, "Verify your phone number")
                }
                
                return res.json({ msg: "Success! Please check phone." })
              }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const { account, password } = req.body
            const user = await userModel.findOne({account})

            if(!user) return res.status(400).json({msg: "Ce compte n'existe pas."})

            console.log(account, password, user)

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
                user: {...user._doc, password: ''}
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    activeAccount: async(req: Request, res: Response) => {
        try {
            const { active_token } = req.body
    
            const decoded = <IDecodedToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)

            const { newUser } = decoded 
    
            if(!newUser) return res.status(400).json({msg: "Invalid authentication."})
            
            const user = new userModel(newUser)

            await user.save()

            res.json({msg: "Account has been activated!"})
    
        } catch (err) {
            let errMsg;
    
            if (err.code === 11000) {
                errMsg = Object.keys(err.keyValue)[0] + " already exists."
            } else {
                let name = Object.keys(err.errors)[0]
                errMsg = err.errors[`${name}`].message
            }
    
            return res.status(500).json({msg: errMsg})
        }
    },
    logout: async (req: Request, res: Response) => {
        try {
            res.clearCookie('refreshtoken', { path: `/api/refresh_token` })
            return res.json({msg: "Logout !"})
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    refreshToken: async (req: Request, res: Response) => {
        try {
            const rf_token = req.cookies.refreshtoken

            if (!rf_token) return res.status(500).json({ msg: "Merci de vous authentifier !" })

            const decoded = <IDecodedToken>jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)

            if (!decoded) return res.status(500).json({ msg: "Merci de vous authentifier !" })

            const user = await userModel.findById(decoded.id).select('-password')

            if (!user) return res.status(500).json({ msg: "Ce compte n'existe pas !" })

            const access_token = generateAccessToken({id: user._id})

            res.json({msg: 'Success'})
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
}

export default authCtrl