import { Request, Response } from 'express'
import userModel from '../models/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

import { generateActiveToken, generateAccessToken, generateRefreshToken } from '../config/generateToken'
import sendMail from '../config/sendMail'
import sendSms from '../config/sendSMS'
import { validEmail, validPhone } from '../middlewares/valid'
import { IDecodedToken, IGgPayload } from '../config/interfaces'

const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`)
const CLIENT_URL = `${process.env.BASE_URL}`

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
                    msg: 'Bravo ! Vous avez reçu un email pour activer votre compte.',
                    active_url: url
                })
            } else if (validPhone(account)) {
                if (process.env.SEND) {
                    sendSms(account, url, "Vous avez reçu un SMS pour activer votre compte")
                }
                
                return res.json({ 
                    msg: "Bravo ! Vous avez reçu un SMS pour activer votre compte.",
                    active_url: url
                })
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
            
            const user = await userModel.findOne({ account: newUser.account })

            if (user) return res.status(400).json({msg: "Ce user existe déjà."})

            const new_user = new userModel(newUser)

            await new_user.save()

            res.json({msg: "Account has been activated!"})
    
        } catch (err) {
            return res.status(500).json({msg: err.message})
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

            res.json({
                access_token,
                user
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    googleLogin: async(req: Request, res: Response) => {
        try {
          const { id_token } = req.body
          const verify = await client.verifyIdToken({
            idToken: id_token, audience: `${process.env.GOOGLE_CLIENT_ID}`
          })
    
          const {
            email, email_verified, name, picture
          } = <IGgPayload>verify.getPayload()
    
          if (!email_verified)
            return res.status(500).json({msg: "Email verification failed."})
    
          const password = email + process.env.GOOGLE_SALT
          const passwordHash = await bcrypt.hash(password, 12)
    
          const user = await userModel.findOne({account: email})
    
          if (user) {
            const access_token = generateAccessToken({ id: user._id })
            const refresh_token = generateRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: `/api/refresh_token`,
                maxAge: 30*24*60*60*1000
            })

            return res.json({
                msg: "Login Success!",
                access_token,
                user: {...user._doc, password: ''}
            })
          } else {
            const user = {
              name, 
              account: email, 
              password: passwordHash, 
              avatar: picture,
              type: 'Google'
            }
            
            const newUser = new userModel(user)
            await newUser.save()

            const access_token = generateAccessToken({id: newUser._id})
            const refresh_token = generateRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: `/api/refresh_token`,
                maxAge: 30*24*60*60*1000 // 30days
            })

            return res.json({
                msg: 'Login Success!',
                access_token,
                user: { ...newUser._doc, password: '' }
            })
          }
          
        } catch (err: any) {
          return res.status(500).json({msg: err.message})
        }
    }
}

export default authCtrl